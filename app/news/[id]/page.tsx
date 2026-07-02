import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Facebook } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getContent } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getContent();
  const article = content.articles.find((a) => a.id === id && a.published);
  if (!article) notFound();

  return (
    <main className="pt-20">
      <article className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dib ugu noqo Wararka
          </Link>

          {article.cover && (
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={article.cover}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm mb-8 pb-8 border-b border-white/5">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-gold" />
              {article.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              {formatDate(article.date)}
            </span>
          </div>

          <div className="prose prose-invert prose-gold max-w-none text-white/70 leading-relaxed space-y-4">
            {article.content.split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} className="text-white/70 leading-relaxed">
                  {para}
                </p>
              ) : null
            )}
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-white/40 text-sm mb-4">La wadaag:</p>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm hover:bg-blue-600/20 transition-colors"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
            </div>
          </div>

          {/* Related */}
          <div className="mt-16">
            <h3 className="text-white font-bold text-xl mb-6">Maqaalada Kale</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {content.articles
                .filter((a) => a.published && a.id !== article.id)
                .slice(0, 2)
                .map((related) => (
                  <Link key={related.id} href={`/news/${related.id}`}>
                    <GlassCard className="p-4 group hover:border-gold/30 transition-colors">
                      <h4 className="text-white font-medium text-sm group-hover:text-gold transition-colors line-clamp-2 mb-1">
                        {related.title}
                      </h4>
                      <p className="text-white/40 text-xs">{formatDate(related.date)}</p>
                    </GlassCard>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
