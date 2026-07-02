"use client";

import { Heart, TrendingUp, Star } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { FadeUp } from "@/components/ui/FadeUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { usePublicContent } from "@/components/content/PublicContentProvider";
import { formatCurrency } from "@/lib/utils";

export default function SupportPage() {
  const { settings, sponsors, paymentChannels } = usePublicContent();
  const { fundraisingGoal, fundraisingProgress } = settings;
  const percent = Math.min(100, Math.round((fundraisingProgress / fundraisingGoal) * 100));

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.2),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <Heart className="w-4 h-4" />
              Taageero
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Naga <span className="text-gradient-gold">Taageero</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
              Gacankaaga noo sii si aan u wanaajinno aqoonta iyo akhriska bulshada
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Progress */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">Qorshaha Maalgelinta</h2>
                  <p className="text-white/50 text-sm">Taageeradaada muhiim bay tahay</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/70 text-sm">Wadarta la uruuriyey</span>
                  <span className="text-gold font-bold text-lg">{percent}%</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-1000 relative"
                    style={{ width: `${percent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-white/40 text-xs mb-1">La uruuriyey</p>
                  <p className="text-white font-bold text-2xl text-gradient-gold">
                    {formatCurrency(fundraisingProgress)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-xs mb-1">Hadaf</p>
                  <p className="text-white font-bold text-2xl">
                    {formatCurrency(fundraisingGoal)}
                  </p>
                </div>
              </div>

              <p className="text-white/50 text-sm mt-4 text-center">
                Waxaan ururinay{" "}
                <strong className="text-gold">{formatCurrency(fundraisingProgress)}</strong> oo ka
                mid ah{" "}
                <strong className="text-white">{formatCurrency(fundraisingGoal)}</strong>
              </p>
            </GlassCard>
          </FadeUp>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Hab-Lacageedyada" subtitle="Dooro habka kuu habboon" />
          <div className="grid sm:grid-cols-2 gap-4">
            {paymentChannels.map((ch, i) => (
              <FadeUp key={ch.id} delay={i * 0.1}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                      {ch.name.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{ch.name}</h3>
                      <p className="text-white/40 text-xs">Xawaaladda fudud</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-gold text-sm font-mono font-medium">{ch.code}</p>
                  </div>
                </GlassCard>
              </FadeUp>
            ))}
          </div>

          {/* Big CTA */}
          <FadeUp className="mt-12 text-center">
            <div className="p-8 rounded-3xl border border-gold/20 bg-gold/5">
              <Heart className="w-12 h-12 text-gold mx-auto mb-4 animate-pulse" />
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Become a Sponsor
              </h3>
              <p className="text-white/60 mb-6 max-w-sm mx-auto">
                Kooxda kuu dan ah? Nagala soo xiriir si aanu kuu dhigno liiska
                taageerayaasha rasmi ah.
              </p>
              <Button href="/contact" variant="gold" size="lg">
                Nala Soo Xiriir
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Taageerayaasha" subtitle="Kuwa naga gacan siiyey" />
            <div className="flex flex-wrap gap-4 justify-center">
              {sponsors.map((sponsor, i) => (
                <FadeUp key={sponsor.id} delay={i * 0.08}>
                  <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/20 transition-colors">
                    <Star className="w-4 h-4 text-gold" />
                    <span className="text-white font-medium">{sponsor.name}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
