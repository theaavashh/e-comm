'use client';

import { Heart, Award, Users, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <section className="bg-[#F0F2F5] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 custom-font mb-4">
            About GharSamma
          </h2>
          <div className="w-24 h-1 bg-[#0077b6] mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-16">
          {/* Text Content */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 custom-font">
              Bringing Authentic Nepali Heritage to Your Home
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              At GharSamma, we are passionate about preserving and sharing the rich cultural heritage 
              of Nepal with the world. Our name, which means "everything for home" in Nepali, reflects 
              our commitment to providing authentic, traditional products that add warmth and meaning 
              to your household.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              From handcrafted items made by skilled artisans to traditional puja samagri, from 
              aromatic herbs to beautiful jewelry, we carefully curate each product to ensure it 
              represents the true essence of Nepali craftsmanship and tradition.
            </p>
            <Link 
              href="/about" 
              className="inline-block mt-4 px-8 py-3 bg-[#0077b6] text-white rounded-lg hover:bg-[#005f8f] transition-colors font-medium custom-font"
            >
              Learn More
            </Link>
          </div>

          {/* Image/Visual Content */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#0077b6]/10 to-[#0077b6]/5 rounded-2xl p-8 md:p-12">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Globe className="w-24 h-24 text-[#0077b6] mx-auto" />
                    <p className="text-gray-600 font-medium custom-font">
                      Celebrating Nepali Culture
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-16 h-16 bg-[#0077b6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#0077b6]" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 custom-font mb-2">
              Authentic Products
            </h4>
            <p className="text-sm text-gray-600">
              Handpicked items directly from local artisans and traditional makers
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-16 h-16 bg-[#0077b6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-[#0077b6]" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 custom-font mb-2">
              Quality Assured
            </h4>
            <p className="text-sm text-gray-600">
              Each product meets our high standards for quality and authenticity
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-16 h-16 bg-[#0077b6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[#0077b6]" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 custom-font mb-2">
              Supporting Artisans
            </h4>
            <p className="text-sm text-gray-600">
              Empowering local communities and preserving traditional craftsmanship
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-16 h-16 bg-[#0077b6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-[#0077b6]" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 custom-font mb-2">
              Global Reach
            </h4>
            <p className="text-sm text-gray-600">
              Delivering Nepali heritage to customers around the world
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

