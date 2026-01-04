'use client';

import { usePathname } from 'next/navigation';
import LiveChatSupport from './LiveChatSupport';

export default function LiveChatWrapper() {
  const pathname = usePathname();
  
  // Don't show LiveChatSupport on login, register, or checkout pages
  const shouldHideLiveChat = pathname && (pathname === '/login' || pathname === '/register' || pathname.startsWith('/checkout'));
  
  if (shouldHideLiveChat) {
    return null;
  }
  
  return <LiveChatSupport />;
}