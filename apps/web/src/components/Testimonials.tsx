'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Kathmandu, Nepal',
    rating: 5,
    comment: 'Amazing quality! The traditional products are authentic and the packaging was excellent. Highly recommend for anyone looking for authentic Nepali items.',
    image: '👩'
  },
  {
    id: 2,
    name: 'Raj Khadka',
    location: 'Pokhara, Nepal',
    rating: 5,
    comment: 'Fast delivery and great customer service. The handcrafted items exceeded my expectations. Will definitely order again!',
    image: '👨'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    rating: 5,
    comment: 'Beautiful products that remind me of my visit to Nepal. The attention to detail in each item is remarkable. Love my purchase!',
    image: '👩'
  },
  {
    id: 4,
    name: 'Mohammed Ali',
    location: 'Dubai, UAE',
    rating: 5,
    comment: 'Excellent shopping experience! The website is easy to navigate and the product quality is outstanding. Shipping was fast too.',
    image: '👨'
  },
  {
    id: 5,
    name: 'Emma Williams',
    location: 'London, UK',
    rating: 5,
    comment: 'I found everything I needed for my home puja setup. Genuine products and great prices. Thank you for bringing Nepali culture to my home!',
    image: '👩'
  },
  {
    id: 6,
    name: 'David Chen',
    location: 'Sydney, Australia',
    rating: 5,
    comment: 'Wonderful collection of traditional items. The jewelry pieces are stunning and the food products taste authentic. Highly satisfied!',
    image: '👨'
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-inter mb-4">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-[#EB6426] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-inter">
            Discover why thousands of customers trust GharSamma for authentic Nepali products
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
            >
              {/* Customer Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#EB6426] to-[#d65a1f] rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 font-inter">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 font-inter">{testimonial.location}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed italic font-inter">
                "{testimonial.comment}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#EB6426] font-inter mb-2">
              10K+
            </div>
            <div className="text-gray-600 text-sm md:text-base font-inter">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#EB6426] font-inter mb-2">
              5K+
            </div>
            <div className="text-gray-600 text-sm md:text-base font-inter">Products Sold</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#EB6426] font-inter mb-2">
              4.9★
            </div>
            <div className="text-gray-600 text-sm md:text-base font-inter">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#EB6426] font-inter mb-2">
              50+
            </div>
            <div className="text-gray-600 text-sm md:text-base font-inter">Countries Served</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}