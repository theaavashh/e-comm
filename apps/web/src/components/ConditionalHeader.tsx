'use client';

import GlobalHeader from "@/components/GlobalHeader";
import { usePathname } from "next/navigation";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show global header on help page
  if (pathname?.startsWith('/help') || pathname?.startsWith('/login')) {
    return null;
  }
  
  return <GlobalHeader />;
}