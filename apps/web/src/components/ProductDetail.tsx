"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocation } from "@/contexts/LocationContext";
import {
  Heart,
  ShoppingCart,
  Star,
  Share2,
  ArrowLeft,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
  X,
  Image as ImageIcon,
  MapPin,
  Package,
  DollarSign,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import AuthModal from "./AuthModal";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  quantity: number;
  image: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
  variants?: Array<{
    id: string;
    name: string;
    value: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  brand?: {
    id: string;
    name: string;
    logo?: string;
  };
  attributes?: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  dimensions?: {
    unit: string;
    width?: number;
    height?: number;
    length?: number;
  };
  weight?: string;
  weightUnit?: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string | null;
  date: string;
  verified: boolean;
  title?: string | null;
}

interface ProductDetailProps {
  productId: string;
  category: string;
}

export default function ProductDetail({
  productId,
  category,
}: ProductDetailProps) {
  const router = useRouter();
  const { selectedCountry, selectedCity } = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(false);
  const [customerAlsoViewed, setCustomerAlsoViewed] = useState<Product[]>([]);
  const [customerAlsoViewedLoading, setCustomerAlsoViewedLoading] =
    useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryCountry, setDeliveryCountry] = useState<
    "USA" | "UK" | "Canada" | "Australia"
  >("USA");
  const [deliveryMethod, setDeliveryMethod] = useState<
    "standard" | "express" | "premium" | "next-day"
  >("standard");
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<
    string | null
  >(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phoneNumber: "",
    city: "",
    streetAddress: "",
    building: "",
    floor: "",
    near: "",
    additionalDetails: "",
    postalCode: "",
  });
  const [checkoutData, setCheckoutData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cash",
    notes: "",
  });
  const [reviewData, setReviewData] = useState({
    userName: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState<string[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'custom'>('description');
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<any>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        // Get user country from context for pricing
        const response = await fetch(
          `${API_BASE_URL}/api/v1/products/${productId}?country=${encodeURIComponent(selectedCountry)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        if (data.success && data.data.product) {
          const productData = data.data.product;

          // Transform API data to match our interface
          const transformedProduct = {
            id: productData.id,
            name: productData.name,
            slug: productData.slug,
            description: productData.description || "",
            shortDescription: productData.shortDescription || "",
            price: Number(productData.price),
            comparePrice: productData.comparePrice
              ? Number(productData.comparePrice)
              : undefined,
            sku: productData.sku,
            quantity: productData.quantity || 0,
            image: productData.image || "",
            images: productData.images || [productData.image].filter(Boolean),
            category: productData.category,
            averageRating: productData.averageRating || 0,
            reviewCount: productData.reviewCount || 0,
            variants: productData.variants || [],
            brand: productData.brand,
            attributes: productData.attributes || [],
            dimensions: productData.dimensions,
            weight: productData.weight,
            weightUnit: productData.weightUnit,
          };
          
          setProduct(transformedProduct);

          // Extract reviews from API response
          if (productData.reviews && Array.isArray(productData.reviews)) {
            const apiReviews = productData.reviews.map((review: any) => ({
              id: review.id,
              userName:
                review.user?.username || review.user?.firstName || "Anonymous",
              rating: review.rating,
              comment: review.comment || review.title || "",
              date: new Date(review.createdAt).toISOString().split("T")[0],
              verified: review.isVerified || false,
              title: review.title || null,
            }));
            setReviews(apiReviews);
          } else {
            setReviews([]);
          }

          // Related products are now fetched separately via useEffect

          // Set custom fields from product data
          if (productData.customFields && Array.isArray(productData.customFields)) {
            setCustomFields(productData.customFields);
          }

          // Fetch questions for this product
          try {
            const questionsResponse = await fetch(
              `${API_BASE_URL}/api/v1/products/${productId}/questions`,
            );
            if (questionsResponse.ok) {
              const questionsData = await questionsResponse.json();
              if (questionsData.success && questionsData.data?.questions) {
                setQuestions(questionsData.data.questions);
              }
            }
          } catch (error) {
            console.log(
              "Questions endpoint not available yet, using empty array",
            );
            setQuestions([]);
          }
          
          // Fetch category details for disclaimer and FAQs
          // First try to find subcategory details from the full category tree
          if (transformedProduct.category?.id) {
            await fetchAllCategoriesForSubcategoryDetails();
          }
        } else {
          throw new Error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, category, selectedCountry]);
  
  // Fetch category details
  const fetchCategoryDetails = async (categoryId: string) => {
    try {
      setCategoryLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
      
      const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch category details");
      }
      
      const data = await response.json();
      
      if (data.success && data.data?.category) {
        setCategoryDetails(data.data.category);
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
    } finally {
      setCategoryLoading(false);
    }
  };
  
  // Function to find subcategory with details in the category tree
  const findSubcategoryWithDetails = (categories: any[], targetId: string): any => {
    for (const category of categories) {
      if (category.id === targetId && 
          (category.disclaimer || (category.faqs && category.faqs.length > 0))) {
        return category;
      }
      
      if (category.children && category.children.length > 0) {
        const found: any = findSubcategoryWithDetails(category.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };
  
  // Fetch all categories to find subcategory details
  const fetchAllCategoriesForSubcategoryDetails = async () => {
    try {
      setCategoryLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
      
      const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch all categories");
      }
      
      const data = await response.json();
      
      if (data.success && data.data?.categories) {
        // Look for the current product's category in the full category tree
        // to find if it has specific disclaimer/faq details
        if (product?.category?.id) {
          const subcategoryWithDetails = findSubcategoryWithDetails(
            data.data.categories, 
            product.category.id
          );
          
          if (subcategoryWithDetails) {
            setCategoryDetails(subcategoryWithDetails);
          } else {
            // If no specific subcategory details found, fetch the main category
            await fetchCategoryDetails(product.category.id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching all categories for subcategory details:", error);
      // Fallback to fetching the main category details
      if (product?.category?.id) {
        await fetchCategoryDetails(product.category.id);
      }
    } finally {
      setCategoryLoading(false);
    }
  };

  // Fetch featured products for "You May Also Like" section
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setRelatedProductsLoading(true);
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const country = selectedCountry || "USA";

        const response = await fetch(
          `${API_BASE_URL}/api/v1/products/featured?limit=6&country=${country}`,
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.products) {
            // Filter out the current product from the list
            const filteredProducts = data.data.products
              .filter((p: Product) => p.id !== productId)
              .slice(0, 3) // Show only 3 products
              .map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                description: p.description || "",
                shortDescription: p.shortDescription || "",
                price: p.price || 0,
                comparePrice: p.comparePrice,
                sku: p.sku,
                quantity: p.stock || 0,
                image: p.image || (p.images && p.images[0]) || "",
                images: p.images || [],
                category: p.category || { id: "", name: "", slug: "" },
                averageRating: p.averageRating || 0,
                reviewCount: p.reviewCount || 0,
                variants: p.variants || [],
                brand: p.brand,
                attributes: p.attributes || [],
                dimensions: p.dimensions,
                weight: p.weight,
                weightUnit: p.weightUnit,
              }));
            setRelatedProducts(filteredProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setRelatedProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [productId, selectedCountry]);

  // Fetch products for "Customer Also Viewed" section
  useEffect(() => {
    const fetchCustomerAlsoViewed = async () => {
      setCustomerAlsoViewedLoading(true);
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const country = selectedCountry || "USA";

        // Fetch products from the same category for "Customer Also Viewed"
        const response = await fetch(
          `${API_BASE_URL}/api/v1/products/category/${product?.category?.id}?limit=6&country=${country}`,
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.products) {
            // Filter out the current product from the list
            const filteredProducts = data.data.products
              .filter((p: Product) => p.id !== productId)
              .slice(0, 4) // Show 4 products for this section
              .map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                description: p.description || "",
                shortDescription: p.shortDescription || "",
                price: p.price || 0,
                comparePrice: p.comparePrice,
                sku: p.sku,
                quantity: p.stock || 0,
                image: p.image || (p.images && p.images[0]) || "",
                images: p.images || [],
                category: p.category || { id: "", name: "", slug: "" },
                averageRating: p.averageRating || 0,
                reviewCount: p.reviewCount || 0,
                variants: p.variants || [],
                brand: p.brand,
                attributes: p.attributes || [],
                dimensions: p.dimensions,
                weight: p.weight,
                weightUnit: p.weightUnit,
              }));
            setCustomerAlsoViewed(filteredProducts);
          }
        } else {
          // If category endpoint doesn't work, fallback to featured products with different logic
          const featuredResponse = await fetch(
            `${API_BASE_URL}/api/v1/products/featured?limit=8&country=${country}`,
          );
          if (featuredResponse.ok) {
            const featuredData = await featuredResponse.json();
            if (featuredData.success && featuredData.data?.products) {
              const filteredProducts = featuredData.data.products
                .filter((p: Product) => p.id !== productId)
                .slice(0, 4) // Show 4 products
                .map((p: any) => ({
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  description: p.description || "",
                  shortDescription: p.shortDescription || "",
                  price: p.price || 0,
                  comparePrice: p.comparePrice,
                  sku: p.sku,
                  quantity: p.stock || 0,
                  image: p.image || (p.images && p.images[0]) || "",
                  images: p.images || [],
                  category: p.category || { id: "", name: "", slug: "" },
                  averageRating: p.averageRating || 0,
                  reviewCount: p.reviewCount || 0,
                  variants: p.variants || [],
                  brand: p.brand,
                  attributes: p.attributes || [],
                  dimensions: p.dimensions,
                  weight: p.weight,
                  weightUnit: p.weightUnit,
                }));
              setCustomerAlsoViewed(filteredProducts);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching customer also viewed products:", error);
      } finally {
        setCustomerAlsoViewedLoading(false);
      }
    };

    if (product?.category?.id) {
      fetchCustomerAlsoViewed();
    }
  }, [productId, product?.category?.id, selectedCountry]);

  // Delivery options mapping and persistence
  const DELIVERY_OPTIONS: Record<string, any> = {
    USA: {
      standard: { cost: 12, days: 5 },
      express: { cost: 25, days: 2 },
      premium: { cost: 35, days: 1 },
      "next-day": { cost: 45, days: 1 },
    },
    UK: {
      standard: { cost: 10, days: 4 },
      express: { cost: 22, days: 2 },
      premium: { cost: 32, days: 1 },
      "next-day": { cost: 42, days: 1 },
    },
    Canada: {
      standard: { cost: 11, days: 5 },
      express: { cost: 24, days: 2 },
      premium: { cost: 34, days: 1 },
      "next-day": { cost: 44, days: 1 },
    },
    Australia: {
      standard: { cost: 15, days: 6 },
      express: { cost: 30, days: 3 },
      premium: { cost: 40, days: 2 },
      "next-day": { cost: 50, days: 1 },
    },
  };

  // Same-Day Delivery Options
  const sameDayOptions = [
    { id: "standard", label: "Standard", price: 12, time: "6:00 PM Today" },
    { id: "express", label: "Express", price: 25, time: "3:00 PM Today" },
    { id: "premium", label: "Premium", price: 35, time: "12:00 PM Today" },
  ];

  // Next Day Delivery Options
  const nextDayOptions = [
    {
      id: "next-day",
      label: "Standard",
      price: 45,
      time: "Tomorrow by 6:00 PM",
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("delivery_pref");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.country) setDeliveryCountry(parsed.country);
        if (parsed.method) setDeliveryMethod(parsed.method);
      } catch {}
    }
  }, []);

  const selectedDelivery = DELIVERY_OPTIONS[deliveryCountry][deliveryMethod];
  const etaDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + (selectedDelivery?.days || 0));
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  })();

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log("Added to cart:", { product, quantity });
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Navigate to checkout page with product data
    router.push(
      `/checkout?product=${product.id}&quantity=${quantity}&variant=${selectedVariant}`,
    );
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Handle checkout submission
    console.log("Checkout data:", {
      product,
      quantity,
      checkoutData,
      total: product.price * quantity,
    });

    // Here you would typically send the data to your API
    alert("Order placed successfully! We will contact you soon.");
    setShowCheckoutModal(false);
  };

  const handleCheckoutInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReviewInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmittingReview(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

      // DO NOT include Authorization header - allow unauthenticated reviews
      // Get auth token if available (only for optional user identification)
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      // Prepare headers - explicitly NO Authorization header to allow unauthenticated requests
      const getHeaders = (includeContentType = false) => {
        const headers: Record<string, string> = {};
        // Intentionally NOT including Authorization header even if token exists
        // This allows unauthenticated users to post reviews
        if (includeContentType) {
          headers["Content-Type"] = "application/json";
        }
        return headers;
      };

      let response;

      // If there are images, try FormData first, fallback to JSON if it fails
      if (reviewImages.length > 0) {
        // Try FormData approach for images
        const formData = new FormData();
        formData.append("rating", reviewData.rating.toString());
        formData.append(
          "title",
          reviewData.userName ? `${reviewData.userName}'s Review` : "",
        );
        formData.append("comment", reviewData.comment);

        // Append images
        reviewImages.forEach((image) => {
          formData.append("images", image);
        });

        try {
          response = await fetch(
            `${API_BASE_URL}/api/v1/products/${product.id}/reviews`,
            {
              method: "POST",
              headers: {
                // Explicitly NO Authorization header - browser will set Content-Type with boundary for FormData
              },
              body: formData,
            },
          );

          // If FormData request failed (not ok), try JSON fallback
          if (!response.ok) {
            console.log(
              "FormData submission returned error, trying JSON without images",
            );
            response = await fetch(
              `${API_BASE_URL}/api/v1/products/${product.id}/reviews`,
              {
                method: "POST",
                headers: getHeaders(true),
                body: JSON.stringify({
                  rating: reviewData.rating,
                  title: reviewData.userName
                    ? `${reviewData.userName}'s Review`
                    : null,
                  comment: reviewData.comment,
                }),
              },
            );
          }
        } catch (formError) {
          console.log(
            "FormData submission failed, trying JSON without images:",
            formError,
          );
          // Fallback to JSON without images
          response = await fetch(
            `${API_BASE_URL}/api/v1/products/${product.id}/reviews`,
            {
              method: "POST",
              headers: getHeaders(true),
              body: JSON.stringify({
                rating: reviewData.rating,
                title: reviewData.userName
                  ? `${reviewData.userName}'s Review`
                  : null,
                comment: reviewData.comment,
              }),
            },
          );
        }
      } else {
        // No images, use JSON
        response = await fetch(
          `${API_BASE_URL}/api/v1/products/${product.id}/reviews`,
          {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({
              rating: reviewData.rating,
              title: reviewData.userName
                ? `${reviewData.userName}'s Review`
                : null,
              comment: reviewData.comment,
            }),
          },
        );
      }

      if (response && response.ok) {
        console.log("Review submitted successfully, status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        // Reload product data to get updated reviews
        const productResponse = await fetch(
          `${API_BASE_URL}/api/v1/products/${product.id}`,
        );
        if (productResponse.ok) {
          const productData = await productResponse.json();
          if (productData.success && productData.data?.product) {
            const updatedProductData = productData.data.product;

            // Update reviews from API response
            if (
              updatedProductData.reviews &&
              Array.isArray(updatedProductData.reviews)
            ) {
              const apiReviews = updatedProductData.reviews.map(
                (review: any) => ({
                  id: review.id,
                  userName:
                    review.user?.username ||
                    review.user?.firstName ||
                    "Anonymous",
                  rating: review.rating,
                  comment: review.comment || review.title || "",
                  date: new Date(review.createdAt).toISOString().split("T")[0],
                  verified: review.isVerified || false,
                  title: review.title || null,
                }),
              );
              setReviews(apiReviews);
            }

            // Update product with new average rating and review count
            if (updatedProductData.averageRating !== undefined) {
              setProduct({
                ...product,
                averageRating: updatedProductData.averageRating,
                reviewCount:
                  updatedProductData.reviewCount ||
                  updatedProductData._count?.reviews ||
                  0,
              });
            }
          }
        }

        setReviewData({
          userName: "",
          email: "",
          rating: 5,
          comment: "",
        });
        setReviewImages([]);
        setReviewImagePreviews([]);
        setShowReviewModal(false);

        // Show success message
        alert("Review submitted successfully!");
      } else {
        console.log("Review submission failed. Response exists:", !!response);
        console.log("Response details:", {
          status: response?.status,
          statusText: response?.statusText,
          url: response?.url,
          ok: response?.ok,
          type: response?.type,
        });

        let errorMessage = "Failed to submit review. Please try again.";
        let errorDetails: any = null;

        if (response) {
          try {
            // Try to get response as text first
            let responseText = "";
            try {
              responseText = await response.text();
              console.log("Response text received:", responseText);
            } catch (textError) {
              console.error("Failed to read response as text:", textError);
            }

            // Try to parse as JSON
            if (responseText && responseText.trim()) {
              try {
                const errorData = JSON.parse(responseText);
                console.log("Parsed error data:", errorData);
                errorMessage =
                  errorData.message ||
                  errorData.error ||
                  errorData.msg ||
                  errorData.data?.message ||
                  errorData.data?.error ||
                  errorMessage;
                errorDetails = errorData;
              } catch (parseError) {
                // If not JSON, use the text as error message
                console.log("Response is not JSON, using raw text");
                errorMessage = responseText || errorMessage;
              }
            } else {
              // No response text, use status-based messages
              if (response.status === 401) {
                errorMessage = "Unauthorized. Please try again.";
              } else if (response.status === 400) {
                errorMessage = "Invalid request. Please check your input.";
              } else if (response.status === 403) {
                errorMessage =
                  "Access forbidden. Please check your permissions.";
              } else if (response.status === 404) {
                errorMessage = "Resource not found. Please try again.";
              } else if (response.status === 500) {
                errorMessage = "Server error. Please try again later.";
              } else if (response.status) {
                errorMessage = `Request failed with status ${response.status}. Please try again.`;
              }
            }
          } catch (readError: any) {
            console.error("Error reading response:", readError);
            errorDetails = {
              readError: readError?.message || String(readError),
            };

            // Fallback to status-based messages
            if (response.status === 401) {
              errorMessage = "Unauthorized. Please try again.";
            } else if (response.status === 400) {
              errorMessage = "Invalid request. Please check your input.";
            } else if (response.status === 500) {
              errorMessage = "Server error. Please try again later.";
            }
          }
        } else {
          console.error("Response is null or undefined");
          errorMessage =
            "No response from server. Please check your connection and try again.";
        }

        console.error("Review submission error summary:", {
          hasResponse: !!response,
          status: response?.status,
          statusText: response?.statusText,
          statusCode: response?.status,
          url: response?.url,
          ok: response?.ok,
          errorMessage,
          errorDetails: errorDetails || "No error details available",
        });

        alert(errorMessage);
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      alert(error?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product?.comparePrice && product?.price) {
      return Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      );
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 custom-font">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-lg text-black  mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span>/</span>
        <span className="capitalize">
          {product.category?.name || "Product"}
        </span>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 items-start">
        {/* All Thumbnails - First shown first on mobile */}
        <div className="lg:col-span-1 pr-2 mb-4 lg:mb-0 ">
          <div className="flex flex-row md:flex-col gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                onMouseEnter={() => setHoveredImage(index)}
                onMouseLeave={() => setHoveredImage(null)}
                className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                  selectedImage === index
                    ? "border-blue-600 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Image - shown after thumbnails on mobile */}
        <div className="lg:col-span-4 relative ">
          <div
            className="w-96 h-96 rounded-sm overflow-hidden shadow-lg group cursor-zoom-in relative"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={
                product.images[
                  hoveredImage !== null ? hoveredImage : selectedImage
                ]
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Zoomed Image Overlay - Fixed Position */}
          {isZoomed && (
            <div 
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[800px] h-[800px] rounded-xl overflow-hidden shadow-2xl border-2 border-gray-300 bg-white"
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="w-full h-full relative"
                style={{
                  backgroundImage: `url(${product.images[hoveredImage !== null ? hoveredImage : selectedImage]})`,
                  backgroundSize: "250%",
                  backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
              {/* Close button */}
              <button 
                onClick={handleMouseLeave}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Product Info - Column 3 */}
          <div className="lg:col-span-4 px-6 space-y-3 mt-5">
            {/* Brand & Name */}
            <div>
               <h3 className="text-lg text-[#EB6426] underline">{product.slug}</h3>
              <div className="flex items-center justify-between my-2">
               
                <h1 className="text-2xl font-semibold font-poppins text-gray-900">
                  {product.name}
                
                </h1>
               
              </div>
            </div>


            <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(product.averageRating) ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                     ({product.averageRating}) | {product.reviewCount} reviews
                    </span>
                  </div>

            {/* Price */}
            <div className="space-y-5 py-4 font-poppins border-t border-b border-gray-300">
              <div className="flex items-start justify-between">
                {/* Left Side - Price and Tax */}
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl font-bold text-[#EB6426]">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-xl text-gray-400 line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-black mt-2">
                    Inclusive of all taxes
                  </p>
                </div>

                {/* Right Side - Discount and Rating */}
                <div className="flex flex-col items-end">
                  {product.comparePrice && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium mb-2">
                      {getDiscountPercentage()}% OFF
                    </span>
                  )}
                  {/* Rating */}
                  
                </div>
              </div>
            </div>

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-black mb-3">
                  Product Details
                </h3>
                <div className="space-y-2">
                  {product.attributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex justify-between py-2 border-b border-gray-100"
                    >
                      <span className="text-gray-600">{attr.name}</span>
                      <span className="text-gray-900 font-medium">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Variants */}
            {product.variants &&
              product.variants.some((v: any) => v.name === "Color") && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2 custom-font">
                    Color:{" "}
                    <span className="text-gray-600 font-normal">
                      {selectedColor || "Select Color"}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(
                        product.variants
                          .filter((v: any) => v.name === "Color")
                          .map((v: any) => v.value),
                      ),
                    ).map((colorValue: string) => (
                      <button
                        key={colorValue}
                        type="button"
                        onClick={() => {
                          setSelectedColor(colorValue);
                          // Find variant that matches both color and size if size is selected
                          if (selectedSize && product.variants) {
                            const matchingVariant = product.variants.findIndex(
                              (v: any) =>
                                (v.name === "Color" &&
                                  v.value === colorValue) ||
                                (v.name === "Size" && v.value === selectedSize),
                            );
                            if (matchingVariant !== -1)
                              setSelectedVariant(matchingVariant);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors custom-font ${
                          selectedColor === colorValue
                            ? "border-[#0077b6] text-[#0077b6] bg-blue-50"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {colorValue}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Size Variants */}
            {product.variants &&
              product.variants.some((v: any) => v.name === "Size") && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2 custom-font">
                    Size:{" "}
                    <span className="text-gray-600 font-normal">
                      {selectedSize || "Select Size"}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(
                        product.variants
                          .filter((v: any) => v.name === "Size")
                          .map((v: any) => v.value),
                      ),
                    ).map((sizeValue: string) => (
                      <button
                        key={sizeValue}
                        type="button"
                        onClick={() => {
                          setSelectedSize(sizeValue);
                          // Find variant that matches both color and size if color is selected
                          if (selectedColor && product.variants) {
                            const matchingVariant = product.variants.findIndex(
                              (v: any) =>
                                (v.name === "Color" &&
                                  v.value === selectedColor) ||
                                (v.name === "Size" && v.value === sizeValue),
                            );
                            if (matchingVariant !== -1)
                              setSelectedVariant(matchingVariant);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors custom-font ${
                          selectedSize === sizeValue
                            ? "border-[#0077b6] text-[#0077b6] bg-blue-50"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {sizeValue}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Other Variants (non-Color/Size) */}
            {product.variants &&
              product.variants.some(
                (v: any) => v.name !== "Color" && v.name !== "Size",
              ) &&
              product.variants && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                    Other Variants
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants
                      .filter(
                        (v: any) => v.name !== "Color" && v.name !== "Size",
                      )
                      .map((variant: any, index: number) => {
                        const variantIndex = product.variants!.findIndex(
                          (v: any) => v === variant,
                        );
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variantIndex)}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors custom-font ${
                              selectedVariant === variantIndex
                                ? "border-blue-600 text-blue-600 bg-blue-50"
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {variant.name}: {variant.value}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

            {/* Dimensions */}
            {product.dimensions && (
              <div>
                <h3 className="text-xl text-black mb-3 font-bold">
                  Size: <span className="text-gray-900 font-medium">{product.dimensions.width} {product.dimensions.unit || 'cm'} × {product.dimensions.height} {product.dimensions.unit || 'cm'}</span>
                  {product.weight && (
                    <div className="mt-1 font-bold">
                      Weight: <span className="text-gray-900 font-medium">{product.weight} {product.weightUnit || 'g'}</span>
                    </div>
                  )}
                </h3>
              </div>
            )}
            
            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div>
                <label className="block text-base font-medium text-black mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-medium text-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#EB6426] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      Add to Cart
                    </span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.quantity === 0}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {product.quantity === 0 ? "Out of Stock" : "Buy Now"}
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div
                className={`flex items-center space-x-2 ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  {product.quantity > 0
                    ? `In Stock (${product.quantity} available)`
                    : "Currently unavailable"}
                </span>
              </div>
            </div>

          
          </div>

        {/* Delivery Options - Column 4 */}
          <div className="lg:col-span-3 space-y-6 mt-4 md:mt-0">
            {/* Delivery Options */}
            <div className=" border border-gray-200 p-6 ">
              <div className="space-y-6">
                {/* First Row - Address and Change Button */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {selectedCity}, {selectedCountry}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeliveryModal(true)}
                    className="text-black underline px-4 py-1.5 rounded-lg text-sm font-medium hover:text-[#EB6426] transition-colors"
                  >
                    CHANGE
                  </button>
                </div>

                {/* Second Row - Delivery Options */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delivery Options
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium text-sm capitalize">
                          {deliveryMethod} Delivery
                        </p>
                        <p className="text-gray-500 text-xs">
                          Guaranteed by {etaDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <p className="text-gray-900 text-sm">
                        Cash on Delivery Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Return & Warranty */}
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Return & Warranty
                </h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-4">
                
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <p className="text-gray-900 text-sm">
                    Warranty not available
                  </p>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Description Section with Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 text-lg font-medium ${activeTab === 'description' ? 'border-b-2 border-[#7c3aed] text-[#7c3aed]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 text-lg font-medium ${activeTab === 'details' ? 'border-b-2 border-[#7c3aed] text-[#7c3aed]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Product Details
            </button>
            {customFields && customFields.length > 0 && (
              <button
                onClick={() => setActiveTab('custom')}
                className={`py-4 px-1 text-lg font-medium ${activeTab === 'custom' ? 'border-b-2 border-[#7c3aed] text-[#7c3aed]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Additional Information
              </button>
            )}
          </nav>
        </div>
        
        <div className="mt-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
              {isDescriptionExpanded ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <div>
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: product.description.length > 300 
                        ? product.description.substring(0, 300) + '...' 
                        : product.description 
                    }} 
                  />
                  {product.description.length > 300 && (
                    <button 
                      onClick={() => setIsDescriptionExpanded(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                    >
                      Read More
                    </button>
                  )}
                </div>
              )}
              {isDescriptionExpanded && product.description.length > 300 && (
                <button 
                  onClick={() => setIsDescriptionExpanded(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Specifications</h3>
              <div className="space-y-3">
                {product.attributes && product.attributes.length > 0 && (
                  product.attributes.map((attr) => (
                    <div key={attr.id} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">{attr.name}</span>
                      <span className="text-gray-900">{attr.value}</span>
                    </div>
                  ))
                )}
                {product.dimensions && (
                  <>
                    {product.dimensions.width !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Width</span>
                        <span className="text-gray-900">{product.dimensions.width} {product.dimensions.unit || 'cm'}</span>
                      </div>
                    )}
                    {product.dimensions.height !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Height</span>
                        <span className="text-gray-900">{product.dimensions.height} {product.dimensions.unit || 'cm'}</span>
                      </div>
                    )}
                    {product.dimensions.length !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Length</span>
                        <span className="text-gray-900">{product.dimensions.length} {product.dimensions.unit || 'cm'}</span>
                      </div>
                    )}
                  </>
                )}
                {product.weight !== undefined && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Weight</span>
                    <span className="text-gray-900">{product.weight} {product.weightUnit || 'g'}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'custom' && customFields && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-3">
                {customFields.map((field, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">{field.label}</span>
                    <span className="text-gray-900" dangerouslySetInnerHTML={{ __html: field.content }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclaimer</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          {categoryLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : categoryDetails?.disclaimer ? (
            <div dangerouslySetInnerHTML={{ __html: categoryDetails.disclaimer }} />
          ) : (
            <p>No disclaimer available for this category.</p>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {categoryLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          ) : categoryDetails?.faqs && categoryDetails.faqs.length > 0 ? (
            categoryDetails.faqs.map((faq: any, index: number) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">
              <p>No FAQs available for this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* How to Care Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Care</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">General Care Instructions:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep the product in a cool, dry place away from direct sunlight</li>
            <li>Clean regularly with a soft, dry cloth to prevent dust accumulation</li>
            <li>Avoid using harsh chemicals or abrasive cleaners</li>
            <li>Handle with clean hands to prevent stains and damage</li>
          </ul>
          
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Specific Care by Material:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Wood products:</strong> Apply wood polish occasionally to maintain shine</li>
            <li><strong>Textile items:</strong> Follow washing instructions on the label</li>
            <li><strong>Metal items:</strong> Wipe with damp cloth and dry immediately to prevent rust</li>
            <li><strong>Electronic items:</strong> Turn off before cleaning, use slightly damp cloth</li>
          </ul>
          
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Storage Tips:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Store in original packaging if possible</li>
            <li>Use protective covers for delicate items</li>
            <li>Ensure items are completely dry before storage</li>
          </ul>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Specifications</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Brand</span>
                <span className="text-gray-900">{product.brand?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Category</span>
                <span className="text-gray-900">{product.category?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">SKU</span>
                <span className="text-gray-900">{product.sku || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Available Colors</span>
                <span className="text-gray-900">
                  {product.variants && product.variants.some((v: any) => v.name === 'Color')
                    ? Array.from(new Set(product.variants.filter((v: any) => v.name === 'Color').map((v: any) => v.value))).join(', ')
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Available Sizes</span>
                <span className="text-gray-900">
                  {product.variants && product.variants.some((v: any) => v.name === 'Size')
                    ? Array.from(new Set(product.variants.filter((v: any) => v.name === 'Size').map((v: any) => v.value))).join(', ')
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping & Returns</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Shipping Time</span>
                <span className="text-gray-900">5-7 Business Days</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Return Policy</span>
                <span className="text-gray-900">14 Days Free Return</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Warranty</span>
                <span className="text-gray-900">Not Available</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Origin</span>
                <span className="text-gray-900">Made in Nepal</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Condition</span>
                <span className="text-gray-900">New</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 ">
            Customer Reviews
          </h2>
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-[#7c3aed] text-white px-6 py-2.5 rounded-lg hover:bg-[#6d28d9] transition-colors  font-medium shadow-md"
          >
            Add Review
          </button>
        </div>

        {/* Review Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-5xl font-bold text-gray-900 ">
                {product.averageRating?.toFixed(1) || "0.0"}
              </div>
              <div>
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-7 h-7 ${i < Math.floor(product.averageRating || 0) ? "fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600  text-sm">
                  {product.reviewCount === 0
                    ? "No reviews yet"
                    : `Based on ${product.reviewCount} review${product.reviewCount !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const ratingCount = reviews.filter(
                  (r) => r.rating === rating,
                ).length;
                const percentage =
                  reviews.length > 0 ? (ratingCount / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700  w-10 font-medium">
                      {rating}★
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600  w-8 text-right">
                      {ratingCount}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400  text-sm">
              Rating breakdown will appear when reviews are added
            </div>
          )}
        </div>

        {/* Individual Reviews */}
        <div className="space-y-8">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl mb-3  font-medium">No reviews yet</p>
              <p className="text-sm ">Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-8 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900  text-lg">
                        {review.userName}
                      </h4>
                      {review.verified && (
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full  font-medium">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                {review.title && (
                  <h5 className="font-semibold text-gray-900 mb-2  text-base">
                    {review.title}
                  </h5>
                )}
                {review.comment && (
                  <p className="text-gray-700  leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900  text-center mb-8">
          Questions about this product
        </h2>

        {/* Question Input */}
        <div className="mb-6">
          <div className="relative">
            <textarea
              value={questionText}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setQuestionText(e.target.value);
                }
              }}
              placeholder="Enter your question(s) here"
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent resize-none  text-gray-900"
              maxLength={300}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 ">
              {questionText.length}/300
            </div>
          </div>

          <div className="flex items-start justify-between mt-4">
            <div className="flex-1 pr-4">
              <p className="text-xs text-gray-600  mb-1">
                Your question should not contain contact information such as
                email, phone or external web links.
              </p>
              <p className="text-xs text-gray-600 ">
                Visit{" "}
                <Link
                  href="/orders"
                  className="text-[#7c3aed] hover:underline font-medium"
                >
                  My Orders
                </Link>{" "}
                if you have questions about your previous order.
              </p>
            </div>
            <button
              onClick={async () => {
                if (!questionText.trim() || !product) return;

                setIsSubmittingQuestion(true);
                try {
                  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

                  // Submit question to API (you may need to create this endpoint)
                  // For now, we'll add it locally and can connect to API later
                  const newQuestion = {
                    id: Date.now().toString(),
                    question: questionText,
                    productId: product.id,
                    userId: "anonymous", // Replace with actual user ID when auth is implemented
                    createdAt: new Date().toISOString(),
                    answer: null,
                  };

                  // Try to submit to API if endpoint exists
                  try {
                    const response = await fetch(
                      `${API_BASE_URL}/api/v1/products/${product.id}/questions`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          question: questionText,
                        }),
                      },
                    );

                    if (response.ok) {
                      const data = await response.json();
                      if (data.success && data.data?.question) {
                        // Reload questions from API
                        const questionsResponse = await fetch(
                          `${API_BASE_URL}/api/v1/products/${product.id}/questions`,
                        );
                        if (questionsResponse.ok) {
                          const questionsData = await questionsResponse.json();
                          if (
                            questionsData.success &&
                            questionsData.data?.questions
                          ) {
                            setQuestions(questionsData.data.questions);
                          } else {
                            setQuestions((prev) => [
                              data.data.question,
                              ...prev,
                            ]);
                          }
                        } else {
                          setQuestions((prev) => [data.data.question, ...prev]);
                        }
                      } else {
                        setQuestions((prev) => [newQuestion, ...prev]);
                      }
                    } else {
                      setQuestions((prev) => [newQuestion, ...prev]);
                    }
                  } catch {
                    // Fallback to local state if API doesn't exist yet
                    setQuestions((prev) => [newQuestion, ...prev]);
                  }

                  setQuestionText("");
                  alert("Question submitted successfully!");
                } catch (error) {
                  console.error("Error submitting question:", error);
                  alert("Failed to submit question. Please try again.");
                } finally {
                  setIsSubmittingQuestion(false);
                }
              }}
              disabled={!questionText.trim() || isSubmittingQuestion}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium  transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmittingQuestion ? "Submitting..." : "ASK QUESTIONS"}
            </button>
          </div>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-400  text-lg mb-1">
                There are no questions yet.
              </p>
              <p className="text-gray-400  text-sm">
                Ask the seller now and their answer will show here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="border-b border-gray-100 pb-6 last:border-b-0"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900 ">
                        Q:
                      </span>
                      <p className="text-gray-900 ">{question.question}</p>
                    </div>
                    {question.answer && (
                      <div className="flex items-start space-x-2 mt-3 ml-6 pl-4 border-l-2 border-gray-200">
                        <span className="text-sm font-medium text-[#7c3aed] ">
                          A:
                        </span>
                        <p className="text-gray-700 ">{question.answer}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500  mt-2">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Also Viewed Section */}
      {(customerAlsoViewedLoading || customerAlsoViewed.length > 0) && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 custom-font">
            Customer Also Viewed
          </h2>

          {customerAlsoViewedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-200 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {customerAlsoViewed.map((viewedProduct) => (
                <motion.div
                  key={viewedProduct.id}
                  whileHover={{ y: -5 }}
                  className="border border-gray-200 overflow-hidden cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/products/${viewedProduct.category?.slug || viewedProduct.category?.name || "all"}/${viewedProduct.id}`,
                    )
                  }
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={
                        viewedProduct.image ||
                        (viewedProduct.images && viewedProduct.images[0]) ||
                        "/placeholder-product.jpg"
                      }
                      alt={viewedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 custom-font text-sm">
                      {viewedProduct.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[#0077b6] font-bold custom-font text-sm">
                        {formatPrice(viewedProduct.price)}
                      </span>
                      {viewedProduct.comparePrice &&
                        viewedProduct.comparePrice > viewedProduct.price && (
                          <span className="text-gray-400 line-through text-xs custom-font">
                            {formatPrice(viewedProduct.comparePrice)}
                          </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(viewedProduct.averageRating) ? "fill-current" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs custom-font">
                        ({viewedProduct.reviewCount})
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* You May Also Like Section */}
      {(relatedProductsLoading || relatedProducts.length > 0) && (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 custom-font">
            You May Also Like
          </h2>

          {relatedProductsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-200 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  whileHover={{ y: -5 }}
                  className="border border-gray-200 overflow-hidden cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/products/${relatedProduct.category?.slug || relatedProduct.category?.name || "all"}/${relatedProduct.id}`,
                    )
                  }
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={
                        relatedProduct.image ||
                        (relatedProduct.images && relatedProduct.images[0]) ||
                        "/placeholder-product.jpg"
                      }
                      alt={relatedProduct.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 custom-font">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[#0077b6] font-bold custom-font">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.comparePrice &&
                        relatedProduct.comparePrice > relatedProduct.price && (
                          <span className="text-gray-400 line-through text-sm custom-font">
                            {formatPrice(relatedProduct.comparePrice)}
                          </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(relatedProduct.averageRating) ? "fill-current" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm custom-font">
                        ({relatedProduct.reviewCount})
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && product && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#F8F9F5] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black ">
                  Write a Review
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1 ">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={reviewData.userName}
                    onChange={handleReviewInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black "
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1 ">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={reviewData.email}
                    onChange={handleReviewInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black "
                    placeholder="Enter your email"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2 ">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() =>
                          setReviewData((prev) => ({ ...prev, rating }))
                        }
                        className={`transition-colors ${
                          rating <= reviewData.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 ">
                      {reviewData.rating} star
                      {reviewData.rating !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1 ">
                    Review *
                  </label>
                  <textarea
                    name="comment"
                    value={reviewData.comment}
                    onChange={handleReviewInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black  resize-none"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2 ">
                    Add Images (Optional)
                  </label>
                  <div className="space-y-3">
                    {/* Image Preview Grid */}
                    {reviewImagePreviews.length > 0 && (
                      <div className="grid grid-cols-4 gap-3">
                        {reviewImagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Review ${index + 1}`}
                              className="w-full h-24 object-contain rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newPreviews = [...reviewImagePreviews];
                                const newImages = [...reviewImages];
                                newPreviews.splice(index, 1);
                                newImages.splice(index, 1);
                                setReviewImagePreviews(newPreviews);
                                setReviewImages(newImages);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    {reviewImages.length < 5 && (
                      <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#7c3aed] transition-colors">
                        <div className="flex flex-col items-center">
                          <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                          <span className="text-sm text-gray-600 ">
                            {reviewImages.length > 0
                              ? "Add more images"
                              : "Click to upload images"}
                          </span>
                          <span className="text-xs text-gray-400 ">
                            (Max 5 images, {5 - reviewImages.length} remaining)
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const remainingSlots = 5 - reviewImages.length;
                            const filesToAdd = files.slice(0, remainingSlots);

                            if (filesToAdd.length > 0) {
                              const newImages = [
                                ...reviewImages,
                                ...filesToAdd,
                              ];
                              setReviewImages(newImages);

                              // Create previews
                              filesToAdd.forEach((file) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setReviewImagePreviews((prev) => [
                                    ...prev,
                                    reader.result as string,
                                  ]);
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewImages([]);
                      setReviewImagePreviews([]);
                    }}
                    disabled={isSubmittingReview}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors  disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="flex-1 bg-[#7c3aed] text-white py-2 px-4 rounded-lg hover:bg-[#6d28d9] transition-colors  font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && product && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#F8F9F5] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </h3>

                  {/* Product Details */}
                  <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {product.category?.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">
                          Qty: {quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span className="text-gray-900">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-green-600">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Form */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Delivery Information
                  </h3>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    {/* Customer Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={checkoutData.customerName}
                        onChange={handleCheckoutInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={checkoutData.email}
                        onChange={handleCheckoutInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={checkoutData.phone}
                        onChange={handleCheckoutInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={checkoutData.address}
                        onChange={handleCheckoutInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your delivery address"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={checkoutData.city}
                        onChange={handleCheckoutInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your city"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method *
                      </label>
                      <select
                        name="paymentMethod"
                        value={checkoutData.paymentMethod}
                        onChange={handleCheckoutInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="cash">Cash on Delivery</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="esewa">eSewa</option>
                        <option value="khalti">Khalti</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Instructions
                      </label>
                      <textarea
                        name="notes"
                        value={checkoutData.notes}
                        onChange={handleCheckoutInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any special delivery instructions?"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Place Order - {formatPrice(product.price * quantity)}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeliveryModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Choose Delivery</h3>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Same-Day Delivery Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Same-Day Delivery
                </h4>
                <div className="space-y-3">
                  {sameDayOptions.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                        selectedDeliveryOption === option.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDeliveryOption(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold text-gray-900">
                              {option.label}
                            </h5>
                            {selectedDeliveryOption === option.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
                              >
                                <CheckCircle className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {option.time}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            ${option.price}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDeliveryOption(option.id);
                            setDeliveryMethod(option.id as any);
                            setShowDeliveryModal(false);
                            if (typeof window !== "undefined") {
                              localStorage.setItem(
                                "delivery_pref",
                                JSON.stringify({
                                  country: deliveryCountry,
                                  method: option.id,
                                }),
                              );
                            }
                          }}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            selectedDeliveryOption === option.id
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Select
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Next Day Delivery Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Next Day Delivery
                </h4>
                <div className="space-y-3">
                  {nextDayOptions.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                        selectedDeliveryOption === option.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDeliveryOption(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold text-gray-900">
                              {option.label}
                            </h5>
                            {selectedDeliveryOption === option.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
                              >
                                <CheckCircle className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {option.time}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            ${option.price}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDeliveryOption(option.id);
                            setDeliveryMethod(option.id as any);
                            setShowDeliveryModal(false);
                            if (typeof window !== "undefined") {
                              localStorage.setItem(
                                "delivery_pref",
                                JSON.stringify({
                                  country: deliveryCountry,
                                  method: option.id,
                                }),
                              );
                            }
                          }}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            selectedDeliveryOption === option.id
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Select
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
