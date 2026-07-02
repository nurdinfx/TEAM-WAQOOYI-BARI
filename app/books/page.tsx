"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StarRating } from "@/components/ui/StarRating";
import { FadeUp } from "@/components/ui/FadeUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { usePublicContent } from "@/components/content/PublicContentProvider";
import { formatDate, cn } from "@/lib/utils";

export default function BooksPage() {
  const { books, bookCategories } = usePublicContent();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || b.category === category;
      return matchSearch && matchCat;
    });
  }, [books, search, category]);

  return (
    <main className="pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <BookOpen className="w-4 h-4" />
              Maktabadda
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Buugaagta La <span className="text-gradient-gold">Akhriyey</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              {books.length} buug oo ay kooxdu akhriyeen iyo qiimeyeen
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Raadi buug ama qoraa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {bookCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm transition-colors",
                    category === cat
                      ? "bg-gold text-navy font-semibold"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">Buug la helin.</p>
              <p className="text-white/30 text-sm mt-2">
                Isku day inaan la raadin kale
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((book, i) => (
                <FadeUp key={book.id} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -8, rotateY: 3, rotateX: 2 }}
                    transition={{ duration: 0.3 }}
                    style={{ perspective: 1000 }}
                    className="group"
                  >
                    <GlassCard className="overflow-hidden h-full" hover={false}>
                      <div className="relative h-56 overflow-hidden">
                        {book.cover ? (
                          <Image
                            src={book.cover}
                            alt={book.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-navy-light to-navy flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs backdrop-blur-sm">
                          {book.category}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-white font-bold mb-1 line-clamp-2 group-hover:text-gold transition-colors leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-white/50 text-sm mb-2">{book.author}</p>
                        <StarRating rating={book.rating} size="sm" />
                        <p className="text-white/40 text-xs mt-2">{formatDate(book.dateRead)}</p>
                        {book.summary && (
                          <p className="text-white/40 text-xs mt-3 line-clamp-2 leading-relaxed">
                            {book.summary}
                          </p>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
