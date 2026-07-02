"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { useContent } from "@/components/admin/ContentProvider";
import { FormField, ImageUploadField, inputClass, textareaClass, SaveButton } from "@/components/admin/AdminForms";
import type { SiteSettings } from "@/lib/types";
import { Settings, Globe, Heart, BarChart3, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "hero" | "contact" | "fundraising" | "stats" | "about";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "hero", label: "Hero", icon: Globe },
  { id: "about", label: "About", icon: Settings },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "fundraising", label: "Fundraising", icon: Heart },
  { id: "stats", label: "Statistics", icon: BarChart3 },
];

export default function AdminSettingsPage() {
  const { content, loading, save } = useContent();
  const [tab, setTab] = useState<Tab>("hero");
  const [form, setForm] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (content?.settings) setForm({ ...content.settings });
  }, [content]);

  if (loading || !content || !form) return <AdminLoading />;

  const handleSave = async () => {
    if (!form || !content) return;
    await save({ ...content, settings: form });
  };

  return (
    <>
      <AdminHeader title="Site Settings" />
      <div className="p-6 lg:p-8">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors",
                tab === t.id
                  ? "bg-gold text-navy font-semibold"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <GlassCard className="p-8 max-w-2xl">
          {tab === "hero" && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">Hero Section</h3>
              <FormField label="Badge Text">
                <input className={inputClass} value={form.heroBadge} onChange={(e) => setForm({ ...form, heroBadge: e.target.value })} />
              </FormField>
              <FormField label="Main Title">
                <input className={inputClass} value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
              </FormField>
              <FormField label="Subtitle">
                <input className={inputClass} value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
              </FormField>
              <FormField label="Description">
                <textarea className={textareaClass} rows={3} value={form.heroDescription} onChange={(e) => setForm({ ...form, heroDescription: e.target.value })} />
              </FormField>
            </div>
          )}

          {tab === "about" && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">About Team</h3>
              <FormField label="About Text">
                <textarea className={textareaClass} rows={8} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
              </FormField>
            </div>
          )}

          {tab === "contact" && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">Contact Details</h3>
              <FormField label="WhatsApp Number">
                <input className={inputClass} value={form.contact.whatsapp} onChange={(e) => setForm({ ...form, contact: { ...form.contact, whatsapp: e.target.value } })} placeholder="+252612345678" />
              </FormField>
              <FormField label="Facebook URL">
                <input className={inputClass} value={form.contact.facebook} onChange={(e) => setForm({ ...form, contact: { ...form.contact, facebook: e.target.value } })} />
              </FormField>
              <FormField label="Email">
                <input type="email" className={inputClass} value={form.contact.email} onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Map Latitude">
                  <input type="number" step="0.0001" className={inputClass} value={form.contact.mapLat} onChange={(e) => setForm({ ...form, contact: { ...form.contact, mapLat: Number(e.target.value) } })} />
                </FormField>
                <FormField label="Map Longitude">
                  <input type="number" step="0.0001" className={inputClass} value={form.contact.mapLng} onChange={(e) => setForm({ ...form, contact: { ...form.contact, mapLng: Number(e.target.value) } })} />
                </FormField>
              </div>
            </div>
          )}

          {tab === "fundraising" && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">Fundraising Goal</h3>
              <FormField label="Fundraising Goal ($)">
                <input type="number" className={inputClass} value={form.fundraisingGoal} onChange={(e) => setForm({ ...form, fundraisingGoal: Number(e.target.value) })} />
              </FormField>
              <FormField label="Current Progress ($)">
                <input type="number" className={inputClass} value={form.fundraisingProgress} onChange={(e) => setForm({ ...form, fundraisingProgress: Number(e.target.value) })} />
              </FormField>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                    style={{ width: `${Math.min(100, (form.fundraisingProgress / form.fundraisingGoal) * 100)}%` }}
                  />
                </div>
                <p className="text-white/40 text-xs">
                  {Math.round((form.fundraisingProgress / form.fundraisingGoal) * 100)}% —
                  ${form.fundraisingProgress.toLocaleString()} / ${form.fundraisingGoal.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {tab === "stats" && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-4">Statistics Counters</h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-2">
                <input
                  type="checkbox"
                  id="autoSync"
                  checked={form.autoSyncStats ?? true}
                  onChange={(e) => setForm({ ...form, autoSyncStats: e.target.checked })}
                  className="w-4 h-4 accent-gold"
                />
                <label htmlFor="autoSync" className="text-white/70 text-sm">
                  Auto-sync from database (recommended)
                </label>
              </div>
              {[
                { key: "members" as const, label: "Members" },
                { key: "books" as const, label: "Books Read" },
                { key: "events" as const, label: "Events" },
                { key: "awards" as const, label: "Awards" },
              ].map(({ key, label }) => (
                <FormField key={key} label={label}>
                  <input
                    type="number"
                    className={inputClass}
                    value={form.stats[key]}
                    disabled={form.autoSyncStats ?? true}
                    onChange={(e) => setForm({ ...form, stats: { ...form.stats, [key]: Number(e.target.value) } })}
                  />
                </FormField>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
            <SaveButton onClick={handleSave} />
          </div>
        </GlassCard>
      </div>
    </>
  );
}
