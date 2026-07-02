"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeUp } from "@/components/ui/FadeUp";
import { usePublicContent } from "@/components/content/PublicContentProvider";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Photos", "Videos"] as const;

export default function GalleryPage() {
  const { galleryItems } = usePublicContent();
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = galleryItems.filter((item) => {
    if (filter === "Photos") return item.type === "photo";
    if (filter === "Videos") return item.type === "video";
    return true;
  });

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prevPhoto = () => setLightbox((p) => (p !== null ? Math.max(0, p - 1) : null));
  const nextPhoto = () =>
    setLightbox((p) => (p !== null ? Math.min(filtered.length - 1, p + 1) : null));

  return (
    <main className="pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <ImageIcon className="w-4 h-4" />
              Gallery
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Sawirrada <span className="text-gradient-gold">Kooxda</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Xafliyaha, kulanka, iyo munaasabadaha kooxda
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter tabs */}
          <div className="flex gap-2 justify-center mb-10">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-medium transition-colors",
                  filter === f
                    ? "bg-gold text-navy"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Sawirro ma jirto weli.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
              {filtered.map((item, i) => (
                <FadeUp key={item.id} delay={i * 0.04}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openLightbox(i)}
                    className="relative mb-4 overflow-hidden rounded-2xl cursor-pointer group break-inside-avoid"
                  >
                    <Image
                      src={item.thumbnail || item.src}
                      alt={item.caption}
                      width={600}
                      height={400}
                      className="w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <p className="text-white text-sm font-medium">{item.caption}</p>
                        <p className="text-white/50 text-xs mt-0.5">{item.date}</p>
                      </div>
                    </div>
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gold/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-navy ml-1" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-navy/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {lightbox > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {lightbox < filtered.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            <motion.div
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[80vh] rounded-2xl overflow-hidden"
            >
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].caption}
                width={1200}
                height={800}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy to-transparent">
                <p className="text-white font-medium">{filtered[lightbox].caption}</p>
                <p className="text-white/50 text-sm">{filtered[lightbox].date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
