import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import GlobalHeader from "@/components/GlobalHeader";
import Footer from "@/components/Footer";
import SearchPageSkeleton from "@/components/SearchPageSkeleton";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1", 10);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gharsamma.com";
  
  const title = query 
    ? `Search: ${query}${page > 1 ? ` - Page ${page}` : ""} | GharSamma`
    : "Search Products | GharSamma";
    
  const description = query
    ? `Search results for "${query}" at GharSamma. Find authentic Nepali products including carpets, statues, jewellery, foods and more.${page > 1 ? ` Page ${page} of results.` : ""}`
    : "Search for authentic Nepali products at GharSamma. Browse carpets, statues, jewellery, traditional foods, dresses and more.";
    
  const url = `${baseUrl}/search${query ? `?q=${encodeURIComponent(query)}${page > 1 ? `&page=${page}` : ""}` : ""}`;

  return {
    title,
    description,
    robots: "index, follow",
    alternates: {
      canonical: url,
      languages: {
        en: url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "GharSamma",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

async function getSearchResults(query: string, page: number = 1) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
  const limit = 20;
  
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/v1/products?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Search fetch error:", error);
    return { success: false, data: { products: [], total: 0, page: 1, totalPages: 0 } };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1", 10);
  
  const searchData = query.trim() ? await getSearchResults(query, page) : { success: true, data: { products: [], total: 0, page: 1, totalPages: 0 } };
  
  const products = searchData.success ? searchData.data.products || [] : [];
  const total = searchData.data?.total || 0;
  const totalPages = searchData.data?.totalPages || 0;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gharsamma.com";
  
  const jsonLd = query.trim() && products.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Search results for "${query}"`,
    description: `Found ${total} products matching "${query}"`,
    url: `${baseUrl}/search?q=${encodeURIComponent(query)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: products.slice(0, 10).map((product: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/products/${product.slug}`,
        name: product.name,
        image: product.images?.[0] || product.image,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
        },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Search",
          item: `${baseUrl}/search`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: query,
        },
      ],
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <div className="min-h-screen flex flex-col">
        <GlobalHeader />
        
        <main className="flex-1 bg-gray-50" role="main" aria-label="Search results">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-bricolage">
                Search Products
              </h1>
              
              <div className="max-w-3xl">
                <SearchBar 
                  placeholder="Search for products, categories, brands..."
                  className="w-full"
                  inputClassName="text-lg py-4"
                />
              </div>
            </header>

            {query.trim() ? (
              <section aria-label="Search results">
                <p className="text-gray-600 mb-6" role="status">
                  {total > 0 
                    ? `Found ${total} results for "${query}"`
                    : `No results found for "${query}"`
                  }
                </p>
                
              {products.length > 0 ? (
                <Suspense fallback={<ProductGridSkeleton />}>
                  <ProductGrid products={products} viewMode="grid" />
                </Suspense>
              ) : query.trim() ? (
                <div className="text-center py-12 bg-white rounded-lg" role="status">
                  <p className="text-gray-500 text-lg">
                    No products found. Try different keywords.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg" role="status">
                  <p className="text-gray-500 text-lg">
                    Enter a search term to find products.
                  </p>
                </div>
              )}
            </section>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg" role="status">
                <p className="text-gray-500 text-lg">
                  Enter a search term to find products.
                </p>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
