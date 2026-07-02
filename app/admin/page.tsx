"use client";

import Link from "next/link";
import {
  BookOpen,
  Users,
  Calendar,
  Image,
  FileText,
  Heart,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { useContent } from "@/components/admin/ContentProvider";

const adminLinks = [
  { href: "/admin/leaders", label: "Leaders", icon: Users, key: "leaders" as const },
  { href: "/admin/members", label: "Members", icon: Users, key: "members" as const },
  { href: "/admin/books", label: "Books", icon: BookOpen, key: "books" as const },
  { href: "/admin/gallery", label: "Gallery", icon: Image, key: "galleryItems" as const },
  { href: "/admin/events", label: "Events", icon: Calendar, key: "events" as const },
  { href: "/admin/articles", label: "Articles", icon: FileText, key: "articles" as const },
  { href: "/admin/donations", label: "Support & Donations", icon: Heart, key: "donations" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings, key: "subscribers" as const },
];

export default function AdminDashboard() {
  const { content, loading } = useContent();

  if (loading || !content) return <AdminLoading />;

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {adminLinks.slice(0, 4).map((link) => {
            const count = link.key ? (content[link.key] as unknown[]).length : null;
            return (
              <GlassCard key={link.href} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <link.icon className="w-5 h-5 text-gold" />
                  {count !== null && (
                    <span className="text-2xl font-bold text-white">{count}</span>
                  )}
                </div>
                <p className="text-white/60 text-sm">{link.label}</p>
              </GlassCard>
            );
          })}
        </div>

        <h2 className="text-white font-bold text-lg mb-6">Manage Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <GlassCard className="p-6 hover:border-gold/30 transition-colors h-full">
                <link.icon className="w-6 h-6 text-gold mb-3" />
                <p className="text-white font-medium">{link.label}</p>
                {link.key && link.key !== "subscribers" && (
                  <p className="text-white/40 text-sm mt-1">
                    {(content[link.key] as unknown[]).length} items
                  </p>
                )}
                {link.key === "subscribers" && (
                  <p className="text-white/40 text-sm mt-1">Site config</p>
                )}
              </GlassCard>
            </Link>
          ))}
        </div>

        <div className="mt-10 p-4 rounded-xl bg-gold/5 border border-gold/20">
          <div className="flex items-center gap-2 text-gold text-sm">
            <LayoutDashboard className="w-4 h-4" />
            <span>
              Fundraising: ${content.settings.fundraisingProgress.toLocaleString()} / $
              {content.settings.fundraisingGoal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
