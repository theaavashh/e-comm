'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  link: string;
}

interface CategorySection {
  title: string;
  subtitle?: string;
  items: CategoryItem[];
  linkText: string;
  linkHref: string;
}

const categoryData: CategorySection[] = [
  {
    title: "Foods",
    subtitle: "Authentic Nepali Flavors",
    items: [
      { id: "1", name: "Achar", image: "/achar-layout.webp", link: "/foods/veg-achar" },
      { id: "2", name: "Tea", image: "/tea-layout.webp", link: "/foods/tea" },
      { id: "3", name: "Typical Nepali", image: "/typical-layout.webp", link: "/foods/typical-nepali" },
      { id: "4", name: "Masala", image: "/masala-layout.webp", link: "/foods/masala" }
    ],
    linkText: "Discover more",
    linkHref: "/products/foods"
  },
  {
    title: "Dress",
    subtitle: "Traditional & Modern",
    items: [
      { id: "1", name: "Sari", image: "/sari-layout.webp", link: "/products/dress/sari" },
      { id: "2", name: "Lehenga", image: "/lehenga-layout.webp", link: "/products/dress/lehenga" },
      { id: "3", name: "Gown", image: "/gown-layout.webp", link: "/products/dress/gown" },
      { id: "4", name: "Cultural", image: "/cultural-layout.webp", link: "/products/dress/cultural" }
    ],
    linkText: "Discover more",
    linkHref: "/products/dress"
  },
  {
    title: "Gift and Souvenir",
    subtitle: "Perfect Presents",
    items: [
      { id: "1", name: "Statue", image: "/statue-layout.webp", link: "/products/gift-souvenir/statue" },
      { id: "2", name: "Singing Bowl", image: "/singingbowl-layout.webp", link: "/products/gift-souvenir/singing-bowl" },
      { id: "3", name: "Khukuri", image: "/khurkuri-layout.webp", link: "/products/gift-souvenir/khukuri" },
      { id: "4", name: "Rudrakshya", image: "/rudrakhsya-layout.webp", link: "/products/gift-souvenir/rudrakshya" }
    ],
    linkText: "Discover more",
    linkHref: "/products/gift-souvenir"
  },
  {
    title: "Handicrafts",
    subtitle: "Artisan Made",
    items: [
      { id: "1", name: "Carpet", image: "/carpet-layout.webp", link: "/products/handicrafts/carpet" },
      { id: "2", name: "Pashmina", image: "/pashmina-layout.webp", link: "/products/handicrafts/pashmina" },
      { id: "3", name: "Woven", image: "/woven-layout.webp", link: "/products/handicrafts/woven" },
      { id: "4", name: "Metal", image: "/metal-handicraft-300x300.png", link: "/products/handicrafts/metal" }
    ],
    linkText: "Discover more",
    linkHref: "/products/handicrafts"
  }
];

export default function CategoryShowcase() {
  return (
    <div className="bg-[#F0F2F5] w-full max-w-8xl mx-4 sm:mx-6 md:mx-12 my-12">
      <div className="w-full">
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-xl md:text-3xl font-semibold font-bricolage text-gray-900">
            Top Categories <span className="font-bold font-bricolage not-italic">We Serve</span>
          </h2>
        </div>
        
        {/* Horizontal Scrollable Container */}
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {categoryData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="flex-shrink-0 w-80 bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Section Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 font-bricolage mb-1">
                  {section.title}
                </h3>
                {section.subtitle && (
                  <p className="text-sm text-gray-600 custom-font">
                    {section.subtitle}
                  </p>
                )}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="group block"
                  >
                    <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/image.png';
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 text-center custom-font">
                      {item.name}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Action Link */}
              <div className="text-center">
                <Link
                  href={section.linkHref}
                  className="inline-flex items-center text-sm font-medium text-[#EB6426] hover:text-[#005f8f] transition-colors custom-font"
                >
                  {section.linkText}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}