import Image from "next/image";
import Link from "next/link";
import { FileText, Calendar, User } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { FadeUp } from "@/components/ui/FadeUp";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getContent } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const content = await getContent();
  const articles = content.articles.filter((a) => a.published);

  return (
    <main className="pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <FileText className="w-4 h-4" />
              Wararka & Maqaalada
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Wararka iyo <span className="text-gradient-gold">Maqaalada</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Akhri maqaalada iyo wararka ay xubnahu qoraan
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-24">
              <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">Maqaal ma jirto weli.</p>
            </div>
          ) : (
            <>
              {/* Featured article */}
              {articles[0] && (
                <FadeUp className="mb-12">
                  <Link href={`/news/${articles[0].id}`}>
                    <GlassCard className="overflow-hidden group">
                      <div className="grid lg:grid-cols-2">
                        <div className="relative h-64 lg:h-auto overflow-hidden">
                          {articles[0].cover ? (
                            <Image
                              src={articles[0].cover}
                              alt={articles[0].title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-navy-light to-navy flex items-center justify-center">
                              <FileText className="w-20 h-20 text-white/20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/50" />
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                          <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs border border-gold/20 inline-block mb-4 w-fit">
                            Maqaalka Ugu Dambeeyay
                          </span>
                          <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-gold transition-colors leading-tight">
                            {articles[0].title}
                          </h2>
                          <p className="text-white/60 mb-6 leading-relaxed">{articles[0].excerpt}</p>
                          <div className="flex items-center gap-4 text-white/40 text-sm">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {articles[0].author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(articles[0].date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </FadeUp>
              )}

              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(1).map((article, i) => (
                  <FadeUp key={article.id} delay={i * 0.08}>
                    <Link href={`/news/${article.id}`} className="group block h-full">
                      <GlassCard className="overflow-hidden h-full" hover={false}>
                        <div className="relative h-44 overflow-hidden">
                          {article.cover ? (
                            <Image
                              src={article.cover}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-navy-light to-navy flex items-center justify-center">
                              <FileText className="w-12 h-12 text-white/20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent" />
                        </div>
                        <div className="p-5">
                          <h3 className="text-white font-bold mb-2 group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h3>
                          <p className="text-white/50 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center gap-3 text-white/30 text-xs">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {article.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(article.date)}
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </FadeUp>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
