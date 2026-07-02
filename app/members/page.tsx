"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Users, Search } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { FadeUp } from "@/components/ui/FadeUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { usePublicContent } from "@/components/content/PublicContentProvider";
import { cn } from "@/lib/utils";

const LEVELS = ["All", "Xubin Sare", "Xubin Firfircoon", "Xubin"];
const PER_PAGE = 12;

export default function MembersPage() {
  const { members } = usePublicContent();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase());
      const matchLevel = level === "All" || m.level === level;
      return matchSearch && matchLevel;
    });
  }, [members, search, level]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main className="pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <Users className="w-4 h-4" />
              Xubnaha
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Xubnaha <span className="text-gradient-gold">Kooxda</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              {members.length}+ xubnood oo firfircoon oo ka mid ah bulshadeenna
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Raadi xubnaha..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => { setLevel(l); setPage(1); }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm transition-colors",
                    level === l
                      ? "bg-gold text-navy font-semibold"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {paginated.length === 0 ? (
            <div className="text-center py-24">
              <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Xubno la helin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {paginated.map((member, i) => (
                <FadeUp key={member.id} delay={i * 0.04}>
                  <GlassCard className="overflow-hidden text-center group">
                    <div className="relative h-32">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy-light to-navy flex items-center justify-center">
                          <Users className="w-10 h-10 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                    </div>
                    <div className="p-3">
                      <p className="text-white font-medium text-sm line-clamp-1 group-hover:text-gold transition-colors">
                        {member.name}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{member.role}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-gold/10 text-gold text-xs">
                        {member.level}
                      </span>
                    </div>
                  </GlassCard>
                </FadeUp>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-sm font-medium transition-colors",
                    p === page
                      ? "bg-gold text-navy"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
