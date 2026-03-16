import GlobalHeaderClient from "./GlobalHeaderClient";
import GlobalHeaderSkeleton from "./GlobalHeaderSkeleton";
import { getNavigationItems } from "@/utils/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function GlobalHeader() {
  const navigationItems = await getNavigationItems();
  
  return (
    <Suspense fallback={<GlobalHeaderSkeleton />}>
      <GlobalHeaderClient navigationItems={navigationItems} />
    </Suspense>
  );
}
