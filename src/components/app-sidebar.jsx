"use client"

import * as React from "react"
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
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
      url: "#",
      icon: Car,
      items: [
        {
          title: "Daftar Mobil",
          url: "/admin/cars",
        },
        {
          title: "Galeri & Upload",
          url: "/admin/cars/images",
        },
        {
          title: "Tarif Sewa",
          url: "/admin/car-tariffs",
        },
      ],
    },
    {
      title: "Paket Tour",
      url: "/admin/tour-packages",
      icon: MapPin,
    },
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
        {
          title: "Kategori S&K",
          url: "/admin/terms-conditions/categories",
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
  projects: [
    {
      name: "Status Sistem",
      url: "/admin/health",
      icon: Package,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
