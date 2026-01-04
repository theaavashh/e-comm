'use client';

import Link from 'next/link';
import { Home, MessageCircle, ShoppingCart, User, Grid2x2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { href: '/', label: 'For You', icon: Home },
    { href: '/categories', label: 'Categories', icon: Grid2x2 },
    { href: '/messages', label: 'Messages', icon: MessageCircle, badge: 23 },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: 2 },
    { href: '/account', label: 'Account', icon: User },
  ];



  return (
    <>
    <nav className="w-screen max-w-screen fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:hidden">
      <div className="mx-auto max-w-3xl grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== '/' && pathname?.startsWith(href));
          const isAccount = href === '/account';
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-2 text-xs ${
                active ? 'text-black' : 'text-gray-600'
              }`}
              onClick={(e) => {
                if (isAccount) {
                  e.preventDefault();
                  router.push('/login');
                }
                
                // Handle message button click to open live chat
                const isMessage = href === '/messages';
                if (isMessage) {
                  e.preventDefault();
                  // Dispatch a custom event to open the live chat
                  window.dispatchEvent(new CustomEvent('openLiveChat'));
                }
              }}
            >
              <div className={`relative flex items-center justify-center w-10 h-10 `}>
                <Icon className={`w-6 h-6 ${active ? 'text-[#EB6426]' : 'text-gray-600'}`} />
                {typeof badge === 'number' && badge > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-[#622A1F] text-white rounded-xl px-1.5 py-0.5">
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
    </>
  );
}




