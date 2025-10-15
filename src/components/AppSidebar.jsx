"use client";

import * as React from "react";
import {
  Car,
  Users,
  FileText,
  Handshake,
  BarChart3,
  Package,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data (used as placeholder before auth loads).
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/logo.png",
  },
  teams: [
    {
      name: "Reborn Lombok Trans",
      logo: Car,
      plan: "Admin Panel",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Manajemen Armada",
      url: "/admin/cars",
      icon: Car,
    },
    {
      title: "Tarif",
      url: "/admin/tariffs",
      icon: Package,
    },
    // {
    //   title: "Paket Tour",
    //   url: "/admin/tour-packages",
    //   icon: MapPin,
    // },
    {
      title: "Konten",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "FAQ",
          url: "/admin/faqs",
        },
        {
          title: "Syarat & Ketentuan",
          url: "/admin/terms-conditions",
        },
      ],
    },
    {
      title: "Mitra",
      url: "/admin/partners",
      icon: Handshake,
    },
    {
      title: "Pengguna",
      url: "/admin/users",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const [mounted, setMounted] = React.useState(false);
  const [authUser, setAuthUser] = React.useState(null);
  React.useEffect(() => setMounted(true), []);

  // Fetch current authenticated user to reflect real name/email/role
  React.useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return; // keep placeholder
        const json = await res.json();
        if (!canceled && json?.data) {
          setAuthUser(json.data);
        }
      } catch {
        // ignore, keep placeholder
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  const uiUser = React.useMemo(() => {
    if (authUser) {
      return {
        name: authUser.name || authUser.email || "User",
        email: authUser.email || "",
        avatar: null,
      };
    }
    return data.user;
  }, [authUser]);

  // Hide "Pengguna" menu if role is not ADMIN
  const navItems = React.useMemo(() => {
    if (!authUser) return data.navMain;
    const isAdmin = (authUser.role || "").toUpperCase() === "ADMIN";
    if (isAdmin) return data.navMain;
    return data.navMain.filter((item) => item.title !== "Pengguna");
  }, [authUser]);

  // Render nothing on server and until mounted on client to avoid
  // hydration id mismatches from Radix primitives (Dropdown/Collapsible).
  if (!mounted) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={uiUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
