'use client';

import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#262626] text-white pl-2  font-inter">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 border-t border-[#363636]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Logo Section */}
          <div className='col-span-1 sm:col-span-2 lg:col-span-1 flex items-center'>
            {/* <Link href="/" className="inline-block">
              <Image 
                src="/gharsamma-logo.png" 
                alt="Gharsamma" 
                width={100} 
                height={60}
                className="w-40 sm:w-48 md:w-52"
              />
            </Link> */}
          </div>

          {/* About Section */}
          <div className="space-y-1">
            <h3 className="text-white font-extrabold text-xl md:text-2xl mb-1 font-inter">About</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/about/company" className="text-sm font-inter text-white hover:text-white transition-colors">
                  Company
                </Link>
              </li>
              <li>
                <Link href="/about/policies" className="text-sm text-white hover:text-white transition-colors">
                  Policies
                </Link>
              </li>
              <li>
                <Link href="/about/advertise" className="text-sm text-white hover:text-white transition-colors">
                  Advertise with us
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-extrabold text-xl lg:text-2xl mb-2 font-mono">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/foods" className="text-sm text-white hover:text-white transition-colors">
                  Foods
                </Link>
              </li>
              <li>
                <Link href="/products/gift-souvenir" className="text-sm text-white hover:text-white transition-colors">
                  Gift & Souvenir
                </Link>
              </li>
              <li>
                <Link href="/products/puja-samagri" className="text-sm text-white hover:text-white transition-colors">
                  Puja Samagri
                </Link>
              </li>
              <li>
                <Link href="/products/handicrafts" className="text-sm text-white hover:text-white transition-colors">
                  Handicrafts
                </Link>
              </li>
              <li>
                <Link href="/products/musical-instruments" className="text-sm text-white hover:text-white transition-colors">
                  Musical Instruments
                </Link>
              </li>
              <li>
                <Link href="/products/herbs-naturals" className="text-sm text-white hover:text-white transition-colors">
                  Herbs & Naturals
                </Link>
              </li>
              <li>
                <Link href="/products/jewellery" className="text-sm text-white hover:text-white transition-colors">
                  Jewellery
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-extrabold text-xl md:text-2xl mb-2 font-inter">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-sm text-white hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-white hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-sm text-white hover:text-white transition-colors">
                  Checkout
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-extrabold text-xl md:text-2xl mb-2 font-mono">Get in Touch</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white">
                    Kathmandu, Nepal
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-white flex-shrink-0" />
                  <a href="tel:+9771234567890" className="text-sm text-white hover:text-white transition-colors">
                    +977 123 456 7890
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-white flex-shrink-0" />
                  <a href="mailto:info@gharsamma.com" className="text-sm text-white hover:text-white transition-colors">
                    info@gharsamma.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-extrabold text-xl md:text-2xl mb-2 font-inter">Social</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </a>
                <a 
                  href="https://www.instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a 
                  href="https://www.tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#363636] bg-[#262626] font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white text-center md:text-left opacity-80">
              <p>
                © {currentYear} GharSamma. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 sm:space-x-6 text-sm">
              <Link href="#" className="text-white hover:text-white transition-colors opacity-80 hover:opacity-100">
                Privacy Policy
              </Link>
              <Link href="#" className="text-white hover:text-white transition-colors opacity-80 hover:opacity-100">
                Terms of Service
              </Link>
              <Link href="#" className="text-white hover:text-white transition-colors opacity-80 hover:opacity-100">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}