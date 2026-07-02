"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Image,
  FileText,
  Heart,
  Settings,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContent } from "./ContentProvider";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leaders", label: "Leaders", icon: Users },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/donations", label: "Support & Donations", icon: Heart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const nav = (
    <>
      <div className="p-6 border-b border-white/5">
        <h2 className="font-display text-lg font-bold text-gold">Admin Panel</h2>
        <p className="text-white/40 text-xs mt-1">Waqooyi Bari Team</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors",
                active
                  ? "bg-gold/15 text-gold border border-gold/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:text-gold hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-gold text-navy shadow-lg flex items-center justify-center"
        aria-label="Open admin menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 bg-navy-dark border-r border-white/5 min-h-screen flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-navy-dark min-h-screen hidden lg:flex flex-col">
        {nav}
      </aside>
    </>
  );
}

export function AdminHeader({ title }: { title: string }) {
  const { saving } = useContent();

  return (
    <header className="border-b border-white/5 bg-navy-light/50 sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {saving && (
          <span className="flex items-center gap-2 text-gold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </span>
        )}
      </div>
    </header>
  );
}

export function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-8 h-8 text-gold animate-spin" />
    </div>
  );
}
