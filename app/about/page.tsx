import Image from "next/image";
import { BookOpen, Target, Eye, Star, Heart, Users, Lightbulb, Award } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GlassCard } from "@/components/ui/GlassCard";
import { FadeUp } from "@/components/ui/FadeUp";

const timeline = [
  { year: "2019", title: "Aasaasida Kooxda", desc: "Waqooyi Bari Team waxaa la aasaasay Garowe, xaruntiisa ah." },
  { year: "2020", title: "Maktabadda Ugu Horreysa", desc: "Maktabadda kooxda oo ay xubnuhu wadaagaan buugaag badan." },
  { year: "2021", title: "50+ Xubnood", desc: "Kooxdu waxay gaartay 50 xubnood oo firfircoon." },
  { year: "2022", title: "Abaalmarinta Akhriska", desc: "Munaasabadda abaalmarinta ugu horreysa oo la qabtay." },
  { year: "2023", title: "Workshop Qoraalka", desc: "Tababar qoraalka oo la qabtay xubno badan." },
  { year: "2024", title: "100+ Buugaag", desc: "Kooxdu waxay akhriyeen in ka badan 100 buug." },
  { year: "2025", title: "Ballaarinta", desc: "Kooxdu waxay ballaarday oo waxay noqotay xoog muhiim ah." },
];

const values = [
  { icon: BookOpen, title: "Akhris", desc: "Akhriska waa aasaaska aqoonta iyo kobcinta maskaxda." },
  { icon: Lightbulb, title: "Qoraal", desc: "Qoraalku waa habka ugu wanaagsan ee lagu muujiyo fikirka." },
  { icon: Users, title: "Bulshonimo", desc: "Waxaan aaminnahay in wada shaqeyntu ay keento guul." },
  { icon: Heart, title: "Jacayl Aqoon", desc: "Aqoon-jacaylku waa saldhigga dhammaan wixii wanaagsan." },
];

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-8">
              <BookOpen className="w-4 h-4" />
              Naga Warran
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Naadiga Akhriska iyo{" "}
              <span className="text-gradient-gold">Qoraalka</span>
            </h1>
            <p className="text-white/60 text-xl max-w-3xl mx-auto leading-relaxed">
              Waa bulsho ku mideysan Akhriska, Qoraalka, Aqoonta iyo Horumarka.
              Waxaan ka shaqeynaynaa in aan nala gaarsiiyo dhaqanka akhriska iyo
              qoraalka gobolka Waqooyi Bari.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Ujeedada",
                color: "text-gold",
                desc: "In aan nala kobciyo dhaqanka akhriska iyo qoraalka, aan nala xoojiyo fikir-xuriyada iyo horumarka maskaxda ee dhalinyarada iyo bulshada Waqooyi Bari.",
              },
              {
                icon: Eye,
                title: "Aragtida",
                color: "text-blue-400",
                desc: "In Waqooyi Bari ay noqoto gobol loo yaqaan akhriska iyo qoraalka, halka dhalinyarada ay ku kobcaan aqoonta iyo fikirka xorta ah.",
              },
              {
                icon: Star,
                title: "Qiyamka",
                color: "text-purple-400",
                desc: "Akhris, Qoraal, Wada-shaqayn, Sumcad, Daacadnimo, Horumar — qiyamkani ayaa saldhiga u ah dhammaan waxaan qabanno.",
              },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <GlassCard className="p-8 h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Why Reading & Writing */}
      <section className="py-24 bg-navy-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Muhiimadda Akhriska iyo Qoraalka" subtitle="Sababta aannu u shaqeynaynno" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <GlassCard className="p-6 text-center group">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <v.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h4 className="text-white font-bold mb-2">{v.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Taariikhda Kooxda" subtitle="Safarkaygii iyo wixii la gaaray" />
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <div className="flex gap-6 pl-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center text-gold text-xs font-bold z-10 relative">
                        {item.year.slice(2)}
                      </div>
                    </div>
                    <GlassCard className="flex-1 p-5">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-gold text-sm font-bold">{item.year}</span>
                      </div>
                      <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </GlassCard>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-24 bg-navy-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Hadafyada" subtitle="Waxaan ku dadaallaynaa" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "In aan nala kobciyo dhaqanka akhriska bulshada",
              "In aan nala xoojiyo xirfadda qoraalka ee dhalinyarada",
              "In aan qabanno kulamo akhriska iyo dood bil kasta",
              "In aan nala dhiso maktabad bulsho ah",
              "In aan u dhiirrigelino qoraalka Soomaaliga",
              "In aan nala xidno kooxaha akhriska ee caalamka",
              "In aan nala ansixiyo buugaag cusub lagu kala hadlo",
              "In aan nala sameeyo abaalmarinno akhriska sanadlaha ah",
              "In aan nala tababarno horumarka shaqsiga",
            ].map((obj, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-gold/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-3 h-3 text-gold" />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{obj}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
