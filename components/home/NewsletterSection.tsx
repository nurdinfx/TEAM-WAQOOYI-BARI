"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Subscription failed");
      }
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Newsletter"
          subtitle="Hel wararka iyo cusboonaysiinta kooxda"
        />

        <GlassCard className="p-8 md:p-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-gold" />
            </div>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-gold text-lg font-medium mb-2">Mahadsanid!</p>
              <p className="text-white/60">Waxaad ku biirtay newsletter-kayaga.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email-kaaga geli"
                required
                disabled={loading}
                className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-navy font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-shadow disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Subscribe
                  </>
                )}
              </motion.button>
            </form>
          )}
          {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
        </GlassCard>
      </div>
    </section>
  );
}
