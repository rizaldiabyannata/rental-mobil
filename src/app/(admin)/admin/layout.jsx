// Layout untuk halaman admin

import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/jwt";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({ children }) {
  // Server component guard: if not logged-in ADMIN, redirect to login
  const user = getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-50 flex">
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
