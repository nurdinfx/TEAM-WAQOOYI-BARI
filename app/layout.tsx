import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { getContent } from "@/lib/store";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Waqooyi Bari Team | Bulsho ku mideysan Akhriska iyo Qoraalka",
  description:
    "Waa madal lagu akhriyo, lagu qoro, laguna kobciyo aqoon, fikir iyo horumar bulsho. Waqooyi Bari Team - Reading and Writing Community.",
  keywords: ["Waqooyi Bari", "reading", "writing", "Somali", "books", "community"],
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  return (
    <html lang="so" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-navy text-white antialiased">
        <LoadingScreen />
        <SmoothScroll />
        <SiteChrome content={content}>{children}</SiteChrome>
      </body>
    </html>
  );
}