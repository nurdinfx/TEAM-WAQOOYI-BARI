"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeUp } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/Button";
import { usePublicContent } from "@/components/content/PublicContentProvider";

export function GallerySection() {
  const { galleryItems } = usePublicContent();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const displayItems = galleryItems.slice(0, 8);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Gallery"
          subtitle="Sawirrada kulamada iyo munaasabadaha kooxda"
        />

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {displayItems.map((item, i) => (
            <FadeUp key={item.id} delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden"
                onClick={() => setSelectedImage(item.src)}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-8 h-8 text-gold" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{item.caption}</p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/gallery" variant="outline">
            Dhammaan Sawirrada
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[80vh] w-full"
            >
              <Image
                src={selectedImage}
                alt="Gallery image"
                width={1200}
                height={800}
                className="w-full h-auto rounded-2xl object-contain max-h-[80vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
