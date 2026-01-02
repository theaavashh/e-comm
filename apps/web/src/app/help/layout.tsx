'use client';

import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import CookieConsent from "@/components/CookieConsent";

export default function HelpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
      </div>
      <BottomNav />
      <CookieConsent />
    </Providers>
  );
}