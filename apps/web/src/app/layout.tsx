import type { Metadata } from "next";
import { Urbanist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GharSamma - Traditional Nepali Products",
  description: "Discover authentic Nepali handicrafts, puja samagri, musical instruments, herbs, and jewelry at GharSamma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://cdn.paddle.com/paddle/paddle.js"
          data-vendor={process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || 'your-vendor-id'}
        />
      </head>
      <body
        className={`${urbanist.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <GlobalHeader />
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
            <Footer />
          </div>
          <BottomNav />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
