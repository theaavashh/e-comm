'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';
import Footer from './Footer';

export default function BottomNavWrapper() {
  const pathname = usePathname();
  
  // Don't show BottomNav and Footer on login, register, or checkout pages
  const shouldHideNavAndFooter = pathname && (pathname === '/login' || pathname === '/register' || pathname.startsWith('/checkout'));
  
  if (shouldHideNavAndFooter) {
    return null;
  }
  
  return (
    <>
      <BottomNav />
      <Footer />
    </>
  );
}