"use client";

import { Users, BookOpen, Calendar, Award } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CountUp } from "@/components/ui/CountUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeUp } from "@/components/ui/FadeUp";
import { usePublicContent } from "@/components/content/PublicContentProvider";

const statIcons = [Users, BookOpen, Calendar, Award];
const statLabels = [
  "Xubno Firfircoon",
  "Buugaag La Akhriyey",
  "Munaasabado",
  "Abaalmarino",
];

export function StatisticsSection() {
  const { settings: siteSettings } = usePublicContent();
  const stats = siteSettings.stats;
  const statValues = [stats.members, stats.books, stats.events, stats.awards];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-light/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Tirakoobka Kooxda"
          subtitle="Horumarka iyo guulaha aan gaarnay"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statValues.map((value, i) => {
            const Icon = statIcons[i];
            return (
              <FadeUp key={i} delay={i * 0.1}>
                <GlassCard className="p-6 text-center group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    <CountUp end={value} suffix="+" />
                  </div>
                  <p className="text-white/60 text-sm">{statLabels[i]}</p>
                </GlassCard>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
