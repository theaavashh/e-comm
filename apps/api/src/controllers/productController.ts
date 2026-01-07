import { Request, Response } from "express";
import prisma from "@/config/database.js";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";
import * as path from "path";
import * as fs from "fs";

/**
 * Get currency code for a country
 */
const getCurrencyForCountry = (country: string): string => {
  const countryCurrencyMap: Record<string, string> = {
    Australia: "AUD",
    USA: "USD",
    UK: "GBP",
    Canada: "CAD",
    India: "INR",
    China: "CNY",
    Japan: "JPY",
    Singapore: "SGD",
    UAE: "AED",
    Nepal: "NPR",
    NPR: "NPR",
  };

  return countryCurrencyMap[country] || "NPR";
};

/**
 * Get currency symbol for a currency code
 */
const getSymbolForCurrency = (currency: string): string => {
  const currencySymbolMap: Record<string, string> = {
    AUD: "$",
    USD: "$",
    GBP: "£",
    CAD: "$",
    EUR: "€",
    INR: "₹",
    CNY: "¥",
    JPY: "¥",
    SGD: "$",
    AED: "د.إ",
    NPR: "NPR",
  };

  return currencySymbolMap[currency] || "NPR";
};

/**
 * Map user country to pricing country
 * USA/Canada -> USA, UK -> UK, Australia -> Australia, Hong Kong -> Hong Kong
 * Everything else -> USA (fallback)
 */
const mapCountryToPricingCountry = (country: string | undefined): string => {
  if (!country) return "USA";

  const normalized = country.trim();
  const lower = normalized.toLowerCase();

  // Exact matches
  if (
    lower === "usa" ||
    lower === "united states" ||
    lower === "united states of america"
  ) {
    return "USA";
  }
  if (lower === "canada") {
    return "USA"; // USA/Canada share pricing
  }
  if (
    lower === "uk" ||
    lower === "united kingdom" ||
    lower === "great britain"
  ) {
    return "UK";
  }
  if (lower === "australia") {
    return "Australia";
  }
  if (lower === "hong kong" || lower === "hk") {
    return "Hong Kong";
  }

  // Fallback to USA for all other countries
  return "USA";
};

/**
 * Get the appropriate price for a product based on user country
 * Returns the country-specific price, or falls back to USA price
 */
const getProductDisplayPrice = (
  product: any,
  userCountry?: string,
): {
  price: number;
  comparePrice?: number;
  country: string;
  currencyPrice?: any;
} => {
  const pricingCountry = mapCountryToPricingCountry(userCountry);
  const currencyPrices = product.currencyPrices || [];

  // Try to find price for the mapped country
  let currencyPrice = currencyPrices.find(
    (cp: any) =>
      cp.country.toLowerCase() === pricingCountry.toLowerCase() && cp.isActive,
  );

  // If not found, fallback to USA
  if (!currencyPrice && pricingCountry !== "USA") {
    currencyPrice = currencyPrices.find(
      (cp: any) =>
        (cp.country.toLowerCase() === "usa" ||
          cp.country.toLowerCase() === "united states") &&
        cp.isActive,
    );
  }

  // If still not found, use first available price
  if (!currencyPrice && currencyPrices.length > 0) {
    currencyPrice =
      currencyPrices.find((cp: any) => cp.isActive) || currencyPrices[0];
  }

  if (currencyPrice) {
    return {
      price: Number(currencyPrice.price),
      comparePrice: currencyPrice.comparePrice
        ? Number(currencyPrice.comparePrice)
        : undefined,
      country: currencyPrice.country,
      currencyPrice,
    };
  }

  // Ultimate fallback: return 0 (no price available)
  return {
    price: 0,
    country: pricingCountry,
  };
};

// Helper function to convert relative image paths to full URLs
const convertImagePathsToUrls = (req: Request, images: string[]): string[] => {
  if (!images || !Array.isArray(images)) return images;

  // Use API base URL from environment variable, fallback to request-based URL for development
  const apiBaseUrl =
    process.env.API_BASE_URL ||
    `${req.protocol}://${req.get("host")?.split(":")[0] || "localhost"}:${process.env.PORT || 4444}`;

  return images.map((img) => {
    if (img && img.startsWith("/uploads/")) {
      return `${apiBaseUrl}${img}`;
    }
    return img; // Return as-is if not a relative path
  });
};

// Helper function to convert single thumbnail path to full URL
const convertThumbnailUrl = (
  req: Request,
  thumbnail: string | null,
): string | null => {
  if (!thumbnail) return null;

  if (thumbnail.startsWith("/uploads/")) {
    const apiBaseUrl =
      process.env.API_BASE_URL ||
      `${req.protocol}://${req.get("host")?.split(":")[0] || "localhost"}:${process.env.PORT || 4444}`;
    return `${apiBaseUrl}${thumbnail}`;
  }

  return thumbnail; // Return as-is if not a relative path
};

// Get all products with pagination and filters
export const getProducts = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    rawCategory: rawCategoryParam,
    categories: categoriesParam, // Support 'categories' parameter
    subcategory: rawSubcategory,
    minPrice,
    maxPrice,
    search,
    isActive = "true",
    country, // User's country for pricing
  } = req.query;

  // Support both 'rawCategory' and 'categories' parameter names
  const finalCategoryParam = rawCategoryParam || categoriesParam;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Convert rawCategory to string
    const rawCategory = Array.isArray(finalCategoryParam)
      ? finalCategoryParam[0]
      : finalCategoryParam;

    // Track if main category was not found
    let mainCategoryNotFound = false;

    console.log(`DEBUG: Processing rawCategory: ${rawCategory}`);
    logger.info(`Processing rawCategory: ${rawCategory}`);

    // Build where clause
    const where: any = {
      isActive: isActive === "true",
    };

    if (rawCategory) {
      // Check if category is an ID (UUID format) or name/slug
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          rawCategory as string,
        );

      if (isUUID) {
        // If it's a UUID, find the category and include its subcategories
        const mainCategory = await prisma.category.findUnique({
          where: { id: rawCategory as string },
        });

        if (mainCategory) {
          // Include both main category products and subcategory products
          where.OR = [
            { categoryId: rawCategory },
            { subCategoryId: rawCategory },
          ];

          // Also include products from subcategories of this main category
          const subcategories = await prisma.category.findMany({
            where: { parentId: rawCategory, isActive: true },
            select: { id: true },
          });

          if (subcategories.length > 0) {
            const subcategoryIds = subcategories.map((sc) => sc.id);
            where.OR.push({ categoryId: { in: subcategoryIds } });
            where.OR.push({ subCategoryId: { in: subcategoryIds } });
          }
        } else {
          // If category not found, return empty results
          // Set a condition that will never match any real product
          where.id = "00000000-0000-0000-0000-000000000000"; // Valid UUID format that will never match
          mainCategoryNotFound = true;
        }
      } else {
        // If it's a name or slug, find the category first
        const categoryRecord = await prisma.category.findFirst({
          where: {
            OR: [
              { name: { equals: rawCategory as string, mode: "insensitive" } },
              { slug: { equals: rawCategory as string, mode: "insensitive" } },
            ],
            isActive: true,
          },
        });

        if (categoryRecord) {
          // Include both main category products and subcategory products
          where.OR = [
            { categoryId: categoryRecord.id },
            { subCategoryId: categoryRecord.id },
          ];

          // Also include products from subcategories of this main category
          const subcategories = await prisma.category.findMany({
            where: { parentId: categoryRecord.id, isActive: true },
            select: { id: true },
          });

          if (subcategories.length > 0) {
            const subcategoryIds = subcategories.map((sc) => sc.id);
            where.OR.push({ categoryId: { in: subcategoryIds } });
            where.OR.push({ subCategoryId: { in: subcategoryIds } });
          }
        } else {
          // If category not found, return empty results
          // Set a condition that will never match any real product
          logger.info(
            `Category not found: ${rawCategory}, returning empty results`,
          );
          where.id = "00000000-0000-0000-0000-000000000000"; // Valid UUID format that will never match
        }
      }
    }

    // Handle subcategory parameter if provided
    if (rawSubcategory) {
      const subcategory = Array.isArray(rawSubcategory)
        ? rawSubcategory[0]
        : rawSubcategory;
      if (subcategory) {
        // Check if subcategory is an ID (UUID format) or name/slug
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            subcategory as string,
          );

        if (isUUID) {
          // If it's a UUID, use it directly to filter by subCategoryId
          if (where.OR) {
            // Add subcategory filter to existing OR conditions
            where.OR = where.OR.map((condition: any) => ({
              AND: [condition, { subCategoryId: subcategory }],
            }));
          } else {
            where.subCategoryId = subcategory;
          }
        } else {
          // If it's a name or slug, find the subcategory first
          const subcategoryRecord = await prisma.category.findFirst({
            where: {
              OR: [
                {
                  name: { equals: subcategory as string, mode: "insensitive" },
                },
                {
                  slug: { equals: subcategory as string, mode: "insensitive" },
                },
              ],
              isActive: true,
            },
          });

          if (subcategoryRecord) {
            // Update the where clause to filter by subCategoryId
            if (where.OR) {
              // Add subcategory filter to existing OR conditions
              where.OR = where.OR.map((condition: any) => ({
                AND: [condition, { subCategoryId: subcategoryRecord.id }],
              }));
            } else {
              where.subCategoryId = subcategoryRecord.id;
            }
          }
        }
      }
    }

    // Price filtering is now done through currencyPrices, so we skip base price filtering
    // TODO: Implement price filtering using currencyPrices if needed

    if (search) {
      const searchConditions = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { sku: { contains: search as string, mode: "insensitive" } },
      ];

      // If there are existing OR conditions (from category filtering), combine them
      if (where.OR && where.OR.length > 0) {
        // Create AND condition between category OR and search OR
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          currencyPrices: {
            where: { isActive: true },
            orderBy: { country: "asc" },
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              value: true,
              price: true,
              comparePrice: true,
              sku: true,
              barcode: true,
              quantity: true,
              weight: true,
              height: true,
              width: true,
              length: true,
              dimensions: true,
              image: true,
            },
          },
          pricingTiers: {
            where: { isActive: true },
            orderBy: { minQuantity: "asc" },
          },
          attributes: {
            orderBy: { sortOrder: "asc" },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product and add derived image + country-specific pricing
    const productsWithRating = (products as any[]).map((product: any) => {
      const ratings = (product?.reviews || []).map(
        (review: any) => review.rating,
      );
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) /
            ratings.length
          : 0;

      // Get country-specific pricing
      const displayPrice = getProductDisplayPrice(product, country as string);

      // Convert image paths to URLs
      const imageUrls = convertImagePathsToUrls(req, product?.images || []);
      const thumbnailUrl = convertThumbnailUrl(req, product?.thumbnail);

      return {
        ...product,
        images: imageUrls, // Convert relative paths to full URLs
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: product?._count?.reviews ?? 0,
        image: thumbnailUrl || (imageUrls?.length ? imageUrls[0] : null),
        // Override price fields with country-specific pricing
        price: displayPrice.price,
        comparePrice: displayPrice.comparePrice,
        pricingCountry: displayPrice.country,
        reviews: undefined, // Remove reviews from response
        _count: undefined, // Remove _count from response
      };
    });

    const totalPages = Math.ceil(total / take);

    res.json({
      success: true,
      data: {
        products: productsWithRating,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    logger.error("Get products error:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Provide more detailed error message
    if (error instanceof Error) {
      throw new AppError(`Failed to fetch products: ${error.message}`, 500);
    }
    throw new AppError("Failed to fetch products", 500);
  }
};

// Get single product by ID or slug
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { country } = req.query; // User's country for pricing

  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            value: true,
            price: true,
            comparePrice: true,
            sku: true,
            barcode: true,
            quantity: true,
            weight: true,
            height: true,
            width: true,
            length: true,
            dimensions: true,
            image: true,
          },
        },
        pricingTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: "asc" },
        },
        attributes: {
          orderBy: { sortOrder: "asc" },
        },
        currencyPrices: {
          where: { isActive: true },
          orderBy: { country: "asc" },
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Calculate average rating
    const ratings = ((product as any)?.reviews || []).map(
      (review: any) => review.rating,
    );
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) /
          ratings.length
        : 0;

    // Get country-specific pricing
    const displayPrice = getProductDisplayPrice(product, country as string);

    // Convert image paths to URLs
    const imageUrls = convertImagePathsToUrls(
      req,
      (product as any)?.images || [],
    );
    const thumbnailUrl = convertThumbnailUrl(req, (product as any)?.thumbnail);

    const productWithRating = {
      ...product,
      images: imageUrls, // Convert relative paths to full URLs
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: (product as any)?._count?.reviews ?? 0,
      image: thumbnailUrl || (imageUrls?.length ? imageUrls[0] : null),
      // Override price fields with country-specific pricing
      price: displayPrice.price,
      comparePrice: displayPrice.comparePrice,
      pricingCountry: displayPrice.country,
      _count: undefined, // Remove _count from response
    };

    res.json({
      success: true,
      data: { product: productWithRating },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Get product error:", error);
    throw new AppError("Failed to fetch product", 500);
  }
};

// Create product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    comparePrice,
    costPrice,
    margin,
    sku,
    barcode,
    upc,
    ean,
    isbn,
    trackQuantity,
    quantity,
    stock, // Support both quantity and stock from form
    lowStockThreshold,
    allowBackorder,
    manageStock,
    weight,
    weightUnit,
    dimensions,
    images,
    videos,
    thumbnail,
    seoTitle,
    seoDescription,
    seoKeywords,
    metaTags,
    isActive,
    isDigital,
    isFeatured,
    isNew,
    isOnSale,
    isBestSeller,
    visibility,
    publishedAt,
    categoryId,
    subCategoryId,
    tags,
    brandId,
    requiresShipping,
    shippingClass,
    freeShipping,
    taxable,
    taxClass,
    customFields,
    customSections,
    notes,
    pricingTiers,
    attributes,
    currencyPrices,
    seo,
    variants,
  } = req.body;

  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      throw new AppError("A product with this name already exists", 409);
    }

    // Normalize custom sections alias
    const normalizedCustomFields =
      customFields ??
      (customSections && Array.isArray(customSections)
        ? customSections.map((s: any) => ({
            key: s.key || s.title || s.label || "section",
            label: s.label || s.title || s.key || "Section",
            content: s.content ?? "",
            isVisible: s.isVisible !== false,
          }))
        : undefined);

    // Handle base64 image data by saving to uploads directory
    let processedImages = images || [];
    let processedThumbnail = thumbnail ?? undefined;

    // Process images if they contain base64 data
    if (images && Array.isArray(images)) {
      processedImages = [];
      for (const img of images) {
        if (typeof img === "string" && img.startsWith("data:image")) {
          // This is a base64 image, need to save it to uploads
          const [header, base64Data] = img.split(";base64,");
          const mimeType = header.split(":")[1];
          const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const filename = `product-${uniqueSuffix}.${extension}`;
          const uploadDir = path.join(process.cwd(), "uploads", "products");

          // Ensure directory exists
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, filename);
          const buffer = Buffer.from(base64Data, "base64");
          fs.writeFileSync(filePath, buffer);

          // Add relative path to processed images
          processedImages.push(`/uploads/products/${filename}`);
        } else {
          processedImages.push(img); // Keep as is if not base64
        }
      }
    }

    // Process thumbnail if it's base64
    if (typeof thumbnail === "string" && thumbnail.startsWith("data:image")) {
      const [header, base64Data] = thumbnail.split(";base64,");
      const mimeType = header.split(":")[1];
      const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `product-thumb-${uniqueSuffix}.${extension}`;
      const uploadDir = path.join(process.cwd(), "uploads", "products");

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(filePath, buffer);

      processedThumbnail = `/uploads/products/${filename}`;
    }

    // Build create data and strip undefined to avoid Prisma validation noise
    const baseCreateData: any = {
      name,
      slug,
      description: description || undefined,
      price: 0, // Base price is deprecated, pricing is handled via currencyPrices
      comparePrice: comparePrice ?? undefined,
      costPrice: costPrice ?? undefined,
      margin: margin ?? undefined,
      sku: sku || undefined,
      barcode: barcode || undefined,
      upc: upc || undefined,
      ean: ean || undefined,
      isbn: isbn || undefined,
      trackQuantity,
      quantity: quantity ?? stock ?? 0,
      lowStockThreshold,
      allowBackorder,
      manageStock,
      weight: weight ?? undefined,
      weightUnit,
      dimensions: dimensions ?? undefined,
      images: processedImages,
      videos: videos || [],
      thumbnail: processedThumbnail,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      seoKeywords: seoKeywords || [],
      metaTags: metaTags ?? undefined,
      isActive: isActive ?? true,
      isDigital: isDigital ?? false,
      isFeatured: isFeatured ?? false,
      isNew: isNew ?? false,
      isOnSale: isOnSale ?? false,
      isBestSeller: isBestSeller ?? false,
      visibility: (visibility as any) || "VISIBLE",
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      categoryId,
      subCategoryId:
        subCategoryId && subCategoryId.trim() !== ""
          ? subCategoryId
          : undefined,
      tags: tags || [],
      brandId: brandId && brandId.trim() !== "" ? brandId : undefined,
      requiresShipping: requiresShipping ?? true,
      shippingClass: shippingClass ?? undefined,
      freeShipping: freeShipping ?? false,
      taxable: taxable ?? true,
      taxClass: taxClass ?? undefined,
      customFields: normalizedCustomFields,
      notes: notes ?? undefined,
    };

    if (pricingTiers && pricingTiers.length) {
      baseCreateData.pricingTiers = {
        create: pricingTiers.map((tier: any) => ({
          minQuantity: tier.minQuantity,
          maxQuantity: tier.maxQuantity,
          price: tier.price,
          discount: tier.discount,
        })),
      };
    }

    if (attributes && attributes.length) {
      baseCreateData.attributes = {
        create: attributes.map((attr: any) => ({
          name: attr.name,
          value: attr.value,
          type: attr.type || "TEXT",
          isRequired: attr.isRequired || false,
          isFilterable: attr.isFilterable ?? true,
          sortOrder: attr.sortOrder || 0,
        })),
      };
    }

    const product = await prisma.product.create({ data: baseCreateData });

    // If images were provided as full URLs, convert them to relative paths for storage
    if (baseCreateData.images && Array.isArray(baseCreateData.images)) {
      const relativeImagePaths = baseCreateData.images.map((img: string) => {
        if (typeof img === "string" && img.startsWith("http")) {
          // Extract the relative path from the full URL
          try {
            const url = new URL(img);
            return url.pathname; // This will be something like /uploads/products/filename.jpg
          } catch (e) {
            // If URL parsing fails, return as-is
            return img;
          }
        }
        return img; // Return as-is if not a full URL
      });

      // Update the product with relative paths
      await prisma.product.update({
        where: { id: product.id },
        data: { images: relativeImagePaths },
      });
    }

    // Update SEO fields separately if provided
    if (seo && (seo.ogImage || seo.canonicalUrl || seo.focusKeyword)) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          ogImage:
            seo.ogImage && seo.ogImage.trim() !== "" ? seo.ogImage : undefined,
          canonicalUrl:
            seo.canonicalUrl && seo.canonicalUrl.trim() !== ""
              ? seo.canonicalUrl
              : undefined,
          focusKeyword:
            seo.focusKeyword && seo.focusKeyword.trim() !== ""
              ? seo.focusKeyword
              : undefined,
        },
      });
    }

    // Create currency prices separately if provided
    if (currencyPrices && currencyPrices.length > 0) {
      // Delete existing currency prices for this product first
      await prisma.productCurrencyPrice.deleteMany({
        where: { productId: product.id },
      });

      // Create new currency prices
      await prisma.productCurrencyPrice.createMany({
        data: currencyPrices.map((cp: any) => ({
          productId: product.id,
          country: cp.country,
          currency: cp.currency || getCurrencyForCountry(cp.country),
          symbol:
            cp.symbol ||
            getSymbolForCurrency(
              cp.currency || getCurrencyForCountry(cp.country),
            ),
          price: cp.price,
          comparePrice: cp.comparePrice || null,
          minDeliveryDays: cp.minDeliveryDays || 1,
          maxDeliveryDays: cp.maxDeliveryDays || 7,
          isActive: cp.isActive ?? true,
        })),
      });
    }

    // Create variants separately if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      // Delete existing variants for this product first
      await prisma.productVariant.deleteMany({
        where: { productId: product.id },
      });

      // Create new variants
      for (const variant of variants) {
        const variantData: any = {
          productId: product.id,
          name: variant.name || "",
          value: variant.value || "",
          price: variant.price ? parseFloat(variant.price) : null,
          comparePrice: variant.comparePrice
            ? parseFloat(variant.comparePrice)
            : null,
          sku: variant.sku || null,
          barcode: variant.barcode || null,
          quantity: variant.quantity || 0,
          weight: variant.weight ? parseFloat(variant.weight) : null,
          height: variant.height ? parseFloat(variant.height) : null,
          width: variant.width ? parseFloat(variant.width) : null,
          length: variant.length ? parseFloat(variant.length) : null,
          dimensions: variant.dimensions || null,
          image: variant.image || null,
          isActive: variant.isActive !== false,
        };

        await prisma.productVariant.create({
          data: variantData,
        });
      }
    }

    // Fetch the complete product with relations
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        pricingTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: "asc" },
        },
        attributes: {
          orderBy: { sortOrder: "asc" },
        },
        currencyPrices: {
          where: { isActive: true },
          orderBy: { country: "asc" },
        },
      },
    });

    logger.info("Product created", {
      productId: completeProduct!.id,
      name: completeProduct!.name,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product: completeProduct },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Create product error:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      body: req.body,
    });

    // Provide more detailed error message
    if (error instanceof Error) {
      throw new AppError(`Failed to create product: ${error.message}`, 500);
    }
    throw new AppError("Failed to create product", 500);
  }
};

// Update product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    // If name is being updated, generate new slug
    if (updateData.name && updateData.name !== existingProduct.name) {
      const slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if new slug already exists
      const slugExists = await prisma.product.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        throw new AppError("A product with this name already exists", 409);
      }

      updateData.slug = slug;
    }

    // Remove deprecated price field - pricing is now handled via currencyPrices
    if (updateData.price !== undefined) {
      delete updateData.price;
      logger.warn(
        `Price field in update request ignored for product ${id} - use currencyPrices instead`,
      );
    }

    // Handle SEO fields from seo object
    if (updateData.seo) {
      if (updateData.seo.ogImage !== undefined) {
        updateData.ogImage = updateData.seo.ogImage;
      }
      if (updateData.seo.canonicalUrl !== undefined) {
        updateData.canonicalUrl = updateData.seo.canonicalUrl;
      }
      if (updateData.seo.focusKeyword !== undefined) {
        updateData.focusKeyword = updateData.seo.focusKeyword;
      }
      delete updateData.seo;
    }

    // Handle currency prices update separately if provided
    if (updateData.currencyPrices) {
      const currencyPrices = updateData.currencyPrices;
      delete updateData.currencyPrices;

      // Delete existing currency prices and create new ones
      await prisma.productCurrencyPrice.deleteMany({
        where: { productId: id },
      });

      if (currencyPrices.length > 0) {
        await prisma.productCurrencyPrice.createMany({
          data: currencyPrices.map((cp: any) => ({
            productId: id,
            country: cp.country,
            currency: cp.currency || getCurrencyForCountry(cp.country),
            symbol:
              cp.symbol ||
              getSymbolForCurrency(
                cp.currency || getCurrencyForCountry(cp.country),
              ),
            price: cp.price,
            comparePrice: cp.comparePrice,
            minDeliveryDays: cp.minDeliveryDays,
            maxDeliveryDays: cp.maxDeliveryDays,
            isActive: cp.isActive ?? true,
          })),
        });
      }
    }

    // Process images if they contain base64 data
    if (updateData.images && Array.isArray(updateData.images)) {
      const processedImages = [];
      for (const img of updateData.images) {
        if (typeof img === "string" && img.startsWith("data:image")) {
          // This is a base64 image, need to save it to uploads
          const [header, base64Data] = img.split(";base64,");
          const mimeType = header.split(":")[1];
          const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const filename = `product-${uniqueSuffix}.${extension}`;
          const uploadDir = path.join(process.cwd(), "uploads", "products");

          // Ensure directory exists
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, filename);
          const buffer = Buffer.from(base64Data, "base64");
          fs.writeFileSync(filePath, buffer);

          // Add relative path to processed images
          processedImages.push(`/uploads/products/${filename}`);
        } else if (typeof img === "string" && img.startsWith("http")) {
          // Extract the relative path from the full URL
          try {
            const url = new URL(img);
            processedImages.push(url.pathname); // This will be something like /uploads/products/filename.jpg
          } catch (e) {
            // If URL parsing fails, return as-is
            processedImages.push(img);
          }
        } else {
          processedImages.push(img); // Keep as is if not base64 or URL
        }
      }

      // Update the updateData with processed images
      updateData.images = processedImages;
    }

    // Process thumbnail if it's base64
    if (
      typeof updateData.thumbnail === "string" &&
      updateData.thumbnail.startsWith("data:image")
    ) {
      const [header, base64Data] = updateData.thumbnail.split(";base64,");
      const mimeType = header.split(":")[1];
      const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `product-thumb-${uniqueSuffix}.${extension}`;
      const uploadDir = path.join(process.cwd(), "uploads", "products");

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(filePath, buffer);

      updateData.thumbnail = `/uploads/products/${filename}`;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        currencyPrices: {
          where: { isActive: true },
          orderBy: { country: "asc" },
        },
      },
    });

    logger.info("Product updated", {
      productId: product.id,
      name: product.name,
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Update product error:", error);
    throw new AppError("Failed to update product", 500);
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Soft delete by setting isActive to false (with fallback to raw SQL)
    if (prisma.product.update) {
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
    }

    logger.info("Product deleted", { productId: id, name: product.name });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Delete product error:", {
      error,
      code: error?.code,
      message: error?.message,
      meta: error?.meta,
    });
    // Map some common Prisma errors to friendlier responses
    if (error?.code === "P2014" || error?.code === "P2025") {
      throw new AppError("Product not found", 404);
    }
    throw new AppError(
      `Failed to delete product${error?.message ? `: ${error.message}` : ""}`,
      500,
    );
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  const { limit = 8, country } = req.query; // User's country for pricing

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: Number(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        pricingTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: "asc" },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Calculate average rating for each product and add derived image + country-specific pricing
    const productsWithRating = (products as any[]).map((product: any) => {
      const ratings = (product?.reviews || []).map(
        (review: any) => review.rating,
      );
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) /
            ratings.length
          : 0;

      // Get country-specific pricing
      const displayPrice = getProductDisplayPrice(product, country as string);

      // Convert image paths to URLs
      const imageUrls = convertImagePathsToUrls(req, product?.images || []);
      const thumbnailUrl = convertThumbnailUrl(req, product?.thumbnail);

      return {
        ...product,
        images: imageUrls, // Convert relative paths to full URLs
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: product?._count?.reviews ?? 0,
        image: thumbnailUrl || (imageUrls?.length ? imageUrls[0] : null),
        // Override price fields with country-specific pricing
        price: displayPrice.price,
        comparePrice: displayPrice.comparePrice,
        pricingCountry: displayPrice.country,
        reviews: undefined,
        _count: undefined,
      };
    });

    res.json({
      success: true,
      data: { products: productsWithRating },
    });
  } catch (error) {
    logger.error("Get featured products error:", error);
    throw new AppError("Failed to fetch featured products", 500);
  }
};

// Get product pricing for specific quantity
// Note: Pricing is now handled through currencyPrices, but this endpoint
// still supports pricing tiers for quantity-based discounts
export const getProductPricing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity = 1, country } = req.query;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        pricingTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: "asc" },
        },
        currencyPrices: {
          where: { isActive: true },
          orderBy: { country: "asc" },
        },
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const qty = Number(quantity);

    // Get base price from currencyPrices if country is specified
    let basePrice = 0;
    let currencyPrice = null;

    if (country) {
      currencyPrice = product.currencyPrices.find(
        (cp: any) => cp.country.toLowerCase() === String(country).toLowerCase(),
      );
      if (currencyPrice) {
        basePrice = Number(currencyPrice.price);
      }
    }

    // If no country match or no country specified, use first currency price or 0
    if (basePrice === 0 && product.currencyPrices.length > 0) {
      basePrice = Number(product.currencyPrices[0].price);
      currencyPrice = product.currencyPrices[0];
    }

    let finalPrice = basePrice;
    let appliedTier = null;

    // Find the best pricing tier for the quantity
    for (const tier of product.pricingTiers) {
      if (
        qty >= tier.minQuantity &&
        (!tier.maxQuantity || qty <= tier.maxQuantity)
      ) {
        finalPrice = Number(tier.price);
        appliedTier = tier;
      }
    }

    // Calculate discount if applicable
    let discountAmount = 0;
    if (appliedTier?.discount) {
      discountAmount = (finalPrice * Number(appliedTier.discount)) / 100;
      finalPrice = finalPrice - discountAmount;
    }

    res.json({
      success: true,
      data: {
        productId: product.id,
        basePrice,
        finalPrice,
        quantity: qty,
        appliedTier,
        discountAmount,
        savings: basePrice - finalPrice,
        currencyPrice: currencyPrice
          ? {
              country: currencyPrice.country,
              price: Number(currencyPrice.price),
              comparePrice: currencyPrice.comparePrice
                ? Number(currencyPrice.comparePrice)
                : null,
            }
          : null,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Get product pricing error:", error);
    throw new AppError("Failed to get product pricing", 500);
  }
};

// Add pricing tier to product
export const addPricingTier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { minQuantity, maxQuantity, price, discount } = req.body;

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const pricingTier = await prisma.productPricingTier.create({
      data: {
        productId: id,
        minQuantity,
        maxQuantity,
        price,
        discount,
      },
    });

    res.status(201).json({
      success: true,
      message: "Pricing tier added successfully",
      data: { pricingTier },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Add pricing tier error:", error);
    throw new AppError("Failed to add pricing tier", 500);
  }
};

// Update pricing tier
export const updatePricingTier = async (req: Request, res: Response) => {
  const { id, tierId } = req.params;
  const updateData = req.body;

  try {
    const pricingTier = await prisma.productPricingTier.update({
      where: { id: tierId },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Pricing tier updated successfully",
      data: { pricingTier },
    });
  } catch (error) {
    logger.error("Update pricing tier error:", error);
    throw new AppError("Failed to update pricing tier", 500);
  }
};

// Delete pricing tier
export const deletePricingTier = async (req: Request, res: Response) => {
  const { tierId } = req.params;

  try {
    await prisma.productPricingTier.delete({
      where: { id: tierId },
    });

    res.json({
      success: true,
      message: "Pricing tier deleted successfully",
    });
  } catch (error) {
    logger.error("Delete pricing tier error:", error);
    throw new AppError("Failed to delete pricing tier", 500);
  }
};

// Add product attribute
export const addProductAttribute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, value, type, isRequired, isFilterable, sortOrder } = req.body;

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const attribute = await prisma.productAttribute.create({
      data: {
        productId: id,
        name,
        value,
        type: type || "TEXT",
        isRequired: isRequired || false,
        isFilterable: isFilterable ?? true,
        sortOrder: sortOrder || 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product attribute added successfully",
      data: { attribute },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Add product attribute error:", error);
    throw new AppError("Failed to add product attribute", 500);
  }
};

// Update product attribute
export const updateProductAttribute = async (req: Request, res: Response) => {
  const { attributeId } = req.params;
  const updateData = req.body;

  try {
    const attribute = await prisma.productAttribute.update({
      where: { id: attributeId },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Product attribute updated successfully",
      data: { attribute },
    });
  } catch (error) {
    logger.error("Update product attribute error:", error);
    throw new AppError("Failed to update product attribute", 500);
  }
};

// Delete product attribute
export const deleteProductAttribute = async (req: Request, res: Response) => {
  const { attributeId } = req.params;

  try {
    await prisma.productAttribute.delete({
      where: { id: attributeId },
    });

    res.json({
      success: true,
      message: "Product attribute deleted successfully",
    });
  } catch (error) {
    logger.error("Delete product attribute error:", error);
    throw new AppError("Failed to delete product attribute", 500);
  }
};
