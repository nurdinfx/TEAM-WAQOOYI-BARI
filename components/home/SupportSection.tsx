"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { usePublicContent } from "@/components/content/PublicContentProvider";
import { formatCurrency } from "@/lib/utils";

export function SupportSection() {
  const { settings: siteSettings, paymentChannels } = usePublicContent();
  const { fundraisingGoal, fundraisingProgress } = siteSettings;
  const percentage = Math.min((fundraisingProgress / fundraisingGoal) * 100, 100);

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Taageer Waqooyi Bari Team"
          subtitle="Ka qayb qaado horumarka akhriska iyo qoraalka"
        />

        <GlassCard className="p-8 md:p-10">
          <div className="text-center mb-8">
            <p className="text-white/60 mb-2">Waxaan ururinay</p>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-4xl md:text-5xl font-bold text-gold">
                {formatCurrency(fundraisingProgress)}
              </span>
              <span className="text-white/40 text-lg">
                oo ka mid ah {formatCurrency(fundraisingGoal)}
              </span>
            </div>

            <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-full"
              />
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-gold text-sm font-medium">{percentage.toFixed(0)}% la gaaray</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {paymentChannels.map((channel) => (
              <motion.div
                key={channel.id}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 text-center transition-colors cursor-pointer"
              >
                <p className="text-white font-medium text-sm mb-1">{channel.name}</p>
                <p className="text-white/40 text-xs">{channel.code}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button href="/support" variant="gold" size="lg">
              Taageer Hadda
            </Button>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
