"use client";

import { useState } from "react";
import { MessageSquare, Facebook, Mail, MapPin, Send, CheckCircle, Phone } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { FadeUp } from "@/components/ui/FadeUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { usePublicContent } from "@/components/content/PublicContentProvider";

export default function ContactPage() {
  const { settings } = usePublicContent();
  const { contact } = settings;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const channels = [
    {
      icon: MessageSquare,
      label: "WhatsApp",
      value: contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=Salaan%2C%20waxaan%20rabaa%20macluumaad`,
      color: "text-green-400",
      bg: "bg-green-400/10 border-green-400/20",
    },
    {
      icon: Facebook,
      label: "Facebook",
      value: "Waqooyi Bari Team",
      href: contact.facebook,
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20",
    },
    {
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      color: "text-gold",
      bg: "bg-gold/10 border-gold/20",
    },
    {
      icon: MapPin,
      label: "Garowe",
      value: "Waqooyi Bari, Somalia",
      href: "#map",
      color: "text-red-400",
      bg: "bg-red-400/10 border-red-400/20",
    },
  ];

  return (
    <main className="pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <Phone className="w-4 h-4" />
              Xiriir
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Nala Soo <span className="text-gradient-gold">Xiriir</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Su&apos;aal ma qabtaa? Nagula soo xiriir habkasta
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Channels */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {channels.map((ch, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <a
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <GlassCard className="p-6 text-center group-hover:border-gold/20 transition-colors h-full">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl border flex items-center justify-center ${ch.bg}`}>
                      <ch.icon className={`w-6 h-6 ${ch.color}`} />
                    </div>
                    <p className="text-white font-medium mb-1">{ch.label}</p>
                    <p className="text-white/40 text-xs line-clamp-2">{ch.value}</p>
                  </GlassCard>
                </a>
              </FadeUp>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <FadeUp>
              <GlassCard className="p-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6">
                  Noo Dir Farriin
                </h2>

                {status === "success" ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-xl mb-2">Farriintaada La Helay!</h3>
                    <p className="text-white/50">Waan kugu soo celinnaa dhowaan.</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-4 text-gold text-sm hover:underline"
                    >
                      Dir farriin kale
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-white/50 text-sm block mb-1.5">
                        Magacaaga *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Magacaaga oo buuxa"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm block mb-1.5">
                        Email ama Telefoon
                      </label>
                      <input
                        type="text"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@example.com ama +252..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm block mb-1.5">
                        Farriinta *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Ku qor farriintaada..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 resize-none"
                      />
                    </div>
                    {status === "error" && (
                      <p className="text-red-400 text-sm">
                        Khalad ayaa dhacay. Mar kale isku day.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3 rounded-xl bg-gold text-navy font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <span className="animate-spin w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Dir Farriinta
                        </>
                      )}
                    </button>
                  </form>
                )}
              </GlassCard>
            </FadeUp>

            {/* Map */}
            <FadeUp delay={0.1}>
              <div id="map" className="rounded-2xl overflow-hidden h-full min-h-[400px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <iframe
                  src={`https://maps.google.com/maps?q=${contact.mapLat},${contact.mapLng}&z=13&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ minHeight: "400px", border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Garowe Map"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </main>
  );
}
