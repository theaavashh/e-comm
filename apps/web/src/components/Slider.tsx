import SliderClient from "./SliderClient";
import SliderSkeleton from "./SliderSkeleton";
import { Suspense } from "react";

interface SliderImage {
  id: string;
  imageUrl: string;
  internalLink: string;
  isActive: boolean;
  order: number;
}

async function getSliders(): Promise<SliderImage[]> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    const response = await fetch(
      `${apiBaseUrl}/api/v1/sliders`,
      { next: { revalidate: 300 } }
    );

    if (response.ok) {
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data?.sliders)) {
        return data.data.sliders
          .filter((slider: SliderImage) => slider.isActive)
          .map((slider: SliderImage) => {
            let processedImageUrl = slider.imageUrl;
            
            if (slider.imageUrl && !slider.imageUrl.startsWith('http')) {
              const normalizedPath = slider.imageUrl.startsWith('/') 
                ? slider.imageUrl 
                : `/${slider.imageUrl}`;
              processedImageUrl = `${apiBaseUrl}${normalizedPath}`;
            }

            return {
              ...slider,
              imageUrl: processedImageUrl
            };
          })
          .sort((a: SliderImage, b: SliderImage) => a.order - b.order);
      }
    }
  } catch (error) {
    console.error("Error fetching sliders:", error);
  }

  return [];
}

export default async function Slider() {
  const sliders = await getSliders();
  
  return (
    <Suspense fallback={<SliderSkeleton />}>
      <SliderClient sliders={sliders} />
    </Suspense>
  );
}
