"use client";

import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { FadeUp } from "@/components/ui/FadeUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { usePublicContent } from "@/components/content/PublicContentProvider";
import { formatDate, cn } from "@/lib/utils";

export default function EventsPage() {
  const { events } = usePublicContent();
  const upcoming = events.filter((e) => e.isUpcoming);
  const past = events.filter((e) => !e.isUpcoming);

  return (
    <main className="pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <Calendar className="w-4 h-4" />
              Munaasabadaha
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Hawlaha iyo <span className="text-gradient-gold">Munaasabadaha</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Kulamo akhriska, doodaha, iyo howlaha kale ee kooxda
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mb-16">
              <SectionTitle title="Munaasabadaha Soo Socda" subtitle="Ha ka dhaadin" />
              <div className="space-y-4">
                {upcoming.map((event, i) => (
                  <FadeUp key={event.id} delay={i * 0.1}>
                    <GlassCard className="p-6 border-l-2 border-l-gold">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-gold font-bold text-xl leading-none">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="text-gold/60 text-xs">
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-xs border border-gold/20">
                              Soo Socda
                            </span>
                          </div>
                          <h3 className="text-white font-bold text-lg mb-1">{event.title}</h3>
                          <p className="text-white/50 text-sm mb-3">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-white/40 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </FadeUp>
                ))}
              </div>
            </div>
          )}

          {/* Past — Timeline */}
          {past.length > 0 && (
            <div>
              <SectionTitle title="Taariikhda Munaasabadaha" subtitle="Wixii hore la qabtay" />
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-white/10 to-transparent" />
                <div className="space-y-6">
                  {past.map((event, i) => (
                    <FadeUp key={event.id} delay={i * 0.08}>
                      <div className="flex gap-6">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-navy-light border border-white/10 flex items-center justify-center z-10 relative">
                            <Calendar className="w-4 h-4 text-white/40" />
                          </div>
                        </div>
                        <GlassCard className="flex-1 p-5 opacity-80 hover:opacity-100 transition-opacity">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-xs">
                              La qabtay
                            </span>
                            <span className="text-white/30 text-xs">{formatDate(event.date)}</span>
                          </div>
                          <h3 className="text-white font-semibold mb-1">{event.title}</h3>
                          <p className="text-white/50 text-sm mb-2">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-white/30 text-xs">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>
                        </GlassCard>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </div>
          )}

          {events.length === 0 && (
            <div className="text-center py-24">
              <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Munaasabad ma jirto weli.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
