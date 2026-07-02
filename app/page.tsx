import { HeroSection } from "@/components/home/HeroSection";
import { StatisticsSection } from "@/components/home/StatisticsSection";
import { LeadershipSection } from "@/components/home/LeadershipSection";
import { BooksSection } from "@/components/home/BooksSection";
import { EventsSection } from "@/components/home/EventsSection";
import { SupportSection } from "@/components/home/SupportSection";
import { GallerySection } from "@/components/home/GallerySection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatisticsSection />
      <LeadershipSection />
      <BooksSection />
      <EventsSection />
      <SupportSection />
      <GallerySection />
      <NewsletterSection />
    </>
  );
}
