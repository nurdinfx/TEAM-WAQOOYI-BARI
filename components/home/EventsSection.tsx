"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { usePublicContent } from "@/components/content/PublicContentProvider";
import { formatDate } from "@/lib/utils";

export function EventsSection() {
  const { events } = usePublicContent();
  const displayEvents = events.slice(0, 4);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Munaasabadaha"
          subtitle="Kulamada iyo doodaha kooxda"
        />

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/50 to-transparent hidden md:block" />

          <div className="space-y-8">
            {displayEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative md:pl-20"
              >
                <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-gold border-4 border-navy hidden md:block" />

                <GlassCard className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center">
                        <span className="text-gold text-xs font-medium">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-white text-2xl font-bold">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {event.isUpcoming && (
                          <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                            Upcoming
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                      </div>
                      <p className="text-white/60 text-sm mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-white/40 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gold" />
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gold" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gold" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Button href="/events" variant="outline">
            Dhammaan Munaasabadaha
          </Button>
        </div>
      </div>
    </section>
  );
}
