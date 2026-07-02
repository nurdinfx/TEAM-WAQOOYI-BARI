"use client";

import Link from "next/link";
import { BookOpen, Facebook, Mail, MapPin } from "lucide-react";
import { usePublicContent } from "@/components/content/PublicContentProvider";

const quickLinks = [
  { href: "/about", label: "About Team" },
  { href: "/leadership", label: "Leadership" },
  { href: "/books", label: "Books Library" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News & Articles" },
  { href: "/support", label: "Support Us" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const { settings: siteSettings } = usePublicContent();
  const { contact } = siteSettings;

  return (
    <footer className="relative bg-navy-dark border-t border-white/5">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
                <BookOpen className="w-6 h-6 text-gold" />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-white">
                  WAQOOYI BARI
                </span>
                <span className="block text-xs text-gold tracking-widest">TEAM</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Bulsho ku mideysan Akhriska iyo Qoraalka. Waa madal lagu akhriyo,
              lagu qoro, laguna kobciyo aqoon, fikir iyo horumar bulsho.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold">
                    W
                  </span>
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-gold" />
                Garowe, Waqooyi Bari
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-semibold mb-6">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/30 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-green-400 hover:border-green-400/30 transition-all text-xs font-bold"
              >
                W
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/30 transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-white/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Waqooyi Bari Team. Dhammaan xuquuqda way dhowran yihiin.</p>
        </div>
      </div>
    </footer>
  );
}
