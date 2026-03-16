import TopBannerClient from "./TopBannerClient";

interface Banner {
  id: string;
  title: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

async function getBanners(): Promise<Banner[]> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    const response = await fetch(
      `${apiBaseUrl}/api/v1/banners`,
      { next: { revalidate: 300 } }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    }
  } catch (error) {
    console.error("Error fetching banners:", error);
  }

  return [];
}

export const metadata = {
  title: "GharSamma - Authentic Nepali Products",
  description: "Shop authentic Nepali products including carpets, statues, jewellery, traditional foods, and more.",
  openGraph: {
    title: "GharSamma - Authentic Nepali Products",
    description: "Shop authentic Nepali products including carpets, statues, jewellery, traditional foods, and more.",
    type: "website",
    locale: "en_US",
  },
};

export default async function TopBanner() {
  const banners = await getBanners();
  
  return <TopBannerClient banners={banners} />;
}
