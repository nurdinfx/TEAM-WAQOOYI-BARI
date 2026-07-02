"use client";

import { usePathname } from "next/navigation";
import { ContentProvider } from "@/components/admin/ContentProvider";
import { AdminSidebar } from "@/components/admin/AdminLayout";
import { ToastProvider } from "@/components/admin/Toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      <ContentProvider>
        <div className="min-h-screen bg-navy flex">
          <AdminSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </ContentProvider>
    </ToastProvider>
  );
}
