"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { StarRating } from "@/components/ui/StarRating";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeUp } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/Button";
import { usePublicContent } from "@/components/content/PublicContentProvider";
import { formatDate } from "@/lib/utils";

export function BooksSection() {
  const { books } = usePublicContent();
  const featuredBooks = books.slice(0, 4);

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-light/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Buugaagta Ugu Dambeeyay"
          subtitle="Buugaagta kooxdu akhriday oo dhowaan"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book, i) => (
            <FadeUp key={book.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <GlassCard className="overflow-hidden" hover={false}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs">
                      {book.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-white/50 text-sm mb-2">{book.author}</p>
                    <StarRating rating={book.rating} size="sm" />
                    <p className="text-white/40 text-xs mt-2">
                      {formatDate(book.dateRead)}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </FadeUp>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/books" variant="outline">
            Dhammaan Buugaagta
          </Button>
        </div>
      </div>
    </section>
  );
}
