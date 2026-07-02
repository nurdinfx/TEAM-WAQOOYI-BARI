"use client";

import { usePathname } from "next/navigation";
import type { ContentData } from "@/lib/types";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PublicContentProvider } from "@/components/content/PublicContentProvider";

export function SiteChrome({
  children,
  content,
}: {
  children: React.ReactNode;
  content: ContentData;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <PublicContentProvider content={content}>
      <Header />
      <main>{children}</main>
      <Footer />
    </PublicContentProvider>
  );
}
