import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BottomNavWrapper from "@/components/BottomNavWrapper";
import LiveChatWrapper from "@/components/LiveChatWrapper";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ConditionalHeader from "@/components/ConditionalHeader";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <Providers>
          <ConditionalHeader />
          <div className="min-h-screen flex flex-col">


            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
          </div>
          <BottomNavWrapper />
          <LiveChatWrapper />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}