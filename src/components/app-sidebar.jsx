"use client";

import * as React from "react";
import {
  Car,
  Users,
  MapPin,
  HelpCircle,
  FileText,
  Handshake,
  BarChart3,
  Settings2,
  Package,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
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
  React.useEffect(() => setMounted(true), []);

  // Render nothing on server and until mounted on client to avoid
  // hydration id mismatches from Radix primitives (Dropdown/Collapsible).
  if (!mounted) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
