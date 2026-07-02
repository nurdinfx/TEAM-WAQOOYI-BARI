"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Facebook, Linkedin, Twitter, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { usePublicContent } from "@/components/content/PublicContentProvider";

export function LeadershipSection() {
  const { leaders } = usePublicContent();
  const scrollRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Hoggaanka Team-ka"
          subtitle="Hoggaamiyeyaasha kooxda akhriska iyo qoraalka"
        />

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-navy/80 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors -ml-2 hidden md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {leaders.map((leader, i) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex-shrink-0 w-72 snap-center"
              >
                <GlassCard className="p-6 text-center h-full">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 blur-md" />
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      width={128}
                      height={128}
                      className="relative w-32 h-32 rounded-full object-cover border-2 border-gold/30"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{leader.name}</h3>
                  <p className="text-gold text-sm font-medium mb-3">{leader.position}</p>
                  <p className="text-white/60 text-sm mb-4 line-clamp-3">{leader.bio}</p>
                  <div className="flex justify-center gap-3">
                    {leader.social?.facebook && (
                      <a href={leader.social.facebook} className="text-white/40 hover:text-gold transition-colors">
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {leader.social?.twitter && (
                      <a href={leader.social.twitter} className="text-white/40 hover:text-gold transition-colors">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {leader.social?.linkedin && (
                      <a href={leader.social.linkedin} className="text-white/40 hover:text-gold transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-navy/80 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors -mr-2 hidden md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-10">
          <Button href="/leadership" variant="outline">
            Dhammaan Hoggaanka
          </Button>
        </div>
      </div>
    </section>
  );
}
