'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CategoryShowcaseSecondRow() {
  return (
    <div className="bg-[#F0F2F5] py-16 w-full">
      <div className="w-full px-6">
        {/* Second Row - Additional Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Gear up to get fit */}
          <div className="bg-[#F0F2F5] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 custom-font mb-1">
                Gear up to get fit
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link href="/products/fitness/clothing" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Clothing"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Clothing</p>
              </Link>
              <Link href="/products/fitness/trackers" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Trackers"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Trackers</p>
              </Link>
              <Link href="/products/fitness/equipment" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Equipment"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Equipment</p>
              </Link>
              <Link href="/products/fitness/deals" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Deals"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Deals</p>
              </Link>
            </div>
          </div>

          {/* Level up your PC here */}
          <div className="bg-[#F0F2F5] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 custom-font mb-1">
                Level up your PC here
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link href="/products/computers/laptops" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Laptops"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Laptops</p>
              </Link>
              <Link href="/products/computers/pcs" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="PCs"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">PCs</p>
              </Link>
              <Link href="/products/computers/hard-drives" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Hard Drives"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Hard Drives</p>
              </Link>
              <Link href="/products/computers/monitors" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Monitors"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Monitors</p>
              </Link>
            </div>
          </div>

          {/* Most-loved watches */}
          <div className="bg-[#F0F2F5] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 custom-font mb-1">
                Most-loved watches
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link href="/products/watches/women" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Women"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Women</p>
              </Link>
              <Link href="/products/watches/men" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Men"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Men</p>
              </Link>
              <Link href="/products/watches/girls" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Girls"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Girls</p>
              </Link>
              <Link href="/products/watches/boys" className="group block">
                <div className="relative bg-gray-50 overflow-hidden aspect-square mb-2">
                  <Image
                    src="/image.png"
                    alt="Boys"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center custom-font">Boys</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

