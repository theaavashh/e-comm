'use client';

import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RefreshCw
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold text-white custom-font">GharSamma</h2>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted destination for authentic Nepali products. Discover traditional handicrafts, 
              puja samagri, musical instruments, herbs, and jewelry from the heart of Nepal.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0077b6] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0077b6] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0077b6] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0077b6] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 custom-font">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/foods" className="text-sm hover:text-white transition-colors">
                  Foods
                </Link>
              </li>
              <li>
                <Link href="/products/gift-souvenir" className="text-sm hover:text-white transition-colors">
                  Gift & Souvenir
                </Link>
              </li>
              <li>
                <Link href="/products/puja-samagri" className="text-sm hover:text-white transition-colors">
                  Puja Samagri
                </Link>
              </li>
              <li>
                <Link href="/products/handicrafts" className="text-sm hover:text-white transition-colors">
                  Handicrafts
                </Link>
              </li>
              <li>
                <Link href="/products/musical-instruments" className="text-sm hover:text-white transition-colors">
                  Musical Instruments
                </Link>
              </li>
              <li>
                <Link href="/products/herbs-naturals" className="text-sm hover:text-white transition-colors">
                  Herbs & Naturals
                </Link>
              </li>
              <li>
                <Link href="/products/jewellery" className="text-sm hover:text-white transition-colors">
                  Jewellery
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-sm hover:text-white transition-colors">
                  Our Brands
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 custom-font">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-sm hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-sm hover:text-white transition-colors">
                  Checkout
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4 custom-font">Get in Touch</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#0077b6] flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Kathmandu, Nepal
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#0077b6] flex-shrink-0" />
                  <a href="tel:+9771234567890" className="text-sm hover:text-white transition-colors">
                    +977 123 456 7890
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#0077b6] flex-shrink-0" />
                  <a href="mailto:info@gharsamma.com" className="text-sm hover:text-white transition-colors">
                    info@gharsamma.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4 custom-font">Newsletter</h3>
              <p className="text-sm text-gray-400 mb-3">
                Subscribe to get updates on new products and special offers
              </p>
              <form className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#0077b6] transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0077b6] text-white rounded-lg hover:bg-[#005f8f] transition-colors text-sm font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <Truck className="w-6 h-6 text-[#0077b6] flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Free Shipping</p>
              <p className="text-xs text-gray-400">On orders over Rs. 2000</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 text-[#0077b6] flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Easy Returns</p>
              <p className="text-xs text-gray-400">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-[#0077b6] flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Secure Payment</p>
              <p className="text-xs text-gray-400">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-[#0077b6] flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Multiple Payment</p>
              <p className="text-xs text-gray-400">Various payment options</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 text-center md:text-left">
              <p>
                © {currentYear} GharSamma. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}




