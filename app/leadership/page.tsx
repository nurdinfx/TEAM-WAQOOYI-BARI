import Image from "next/image";
import { Facebook, Twitter, Linkedin, Users } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { FadeUp } from "@/components/ui/FadeUp";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function LeadershipPage() {
  const content = await getContent();
  const { leaders } = content;

  return (
    <main className="pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <Users className="w-4 h-4" />
              Hoggaanka
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Hoggaanka <span className="text-gradient-gold">Kooxda</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              Masuuliyiinta iyo hogaamiyeyaasha ay kooxdu haysato
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {leaders.length === 0 ? (
            <div className="text-center py-24">
              <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">Hoggaan ma jirto weli.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {leaders.map((leader, i) => (
                <FadeUp key={leader.id} delay={i * 0.1}>
                  <GlassCard className="overflow-hidden group text-center">
                    <div className="relative h-56 overflow-hidden">
                      {leader.image ? (
                        <Image
                          src={leader.image}
                          alt={leader.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy-light to-navy flex items-center justify-center">
                          <Users className="w-20 h-20 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-gold transition-colors">
                        {leader.name}
                      </h3>
                      <span className="inline-block px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-medium mb-3">
                        {leader.position}
                      </span>
                      <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3">
                        {leader.bio}
                      </p>
                      {leader.social && (
                        <div className="flex gap-2 justify-center">
                          {leader.social.facebook && (
                            <a
                              href={leader.social.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                            >
                              <Facebook className="w-4 h-4" />
                            </a>
                          )}
                          {leader.social.twitter && (
                            <a
                              href={leader.social.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
                            >
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                          {leader.social.linkedin && (
                            <a
                              href={leader.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
