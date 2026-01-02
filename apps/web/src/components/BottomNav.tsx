'use client';

import Link from 'next/link';
import { Home, MessageCircle, ShoppingCart, User, Grid2x2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AuthModal from './AuthModal';

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'For You', icon: Home },
    { href: '/categories', label: 'Categories', icon: Grid2x2 },
    { href: '/messages', label: 'Messages', icon: MessageCircle, badge: 23 },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: 2 },
    { href: '/account', label: 'Account', icon: User },
  ];

  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
    <nav className="w-screen max-w-screen fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-[#F0F2F5]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F0F2F5]/60 md:hidden">
      <div className="mx-auto max-w-3xl grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== '/' && pathname?.startsWith(href));
          const isAccount = href === '/account';
          return (
            <Link
              key={href}
              href={isAccount ? '#' : href}
              className={`flex flex-col items-center justify-center py-2 text-xs ${
                active ? 'text-[#7c3aed]' : 'text-gray-600'
              }`}
              onClick={(e) => {
                if (isAccount) {
                  e.preventDefault();
                  setShowAuth(true);
                }
              }}
            >
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full ${active ? 'bg-[#f3e8ff]' : ''}`}>
                <Icon className={`w-5 h-5 ${active ? 'text-[#7c3aed]' : 'text-gray-600'}`} />
                {typeof badge === 'number' && badge > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-pink-500 text-white rounded-full px-1.5 py-0.5">
                    {badge}
                  </span>
                )}
              </div>
              <span className="mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
    <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}




