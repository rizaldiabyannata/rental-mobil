import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";

async function getStats() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/stats`,
      {
        cache: "no-store",
        credentials: "include",
        // In app router server components, cookies are forwarded automatically; using absolute/relative accordingly
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch {
    return null;
  }
}

async function StatsCards() {
  const stats = await getStats();
  const carsTotal = stats?.cars?.total ?? 0;
  const carsAvailable = stats?.cars?.available ?? 0;
  const tourTotal = stats?.tourPackages?.total ?? 0;
  const partnersTotal = stats?.partners?.total ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">
            Total Jenis Armada
          </h3>
          <span className="h-4 w-4 text-muted-foreground">🚗</span>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{carsTotal}</div>
          <p className="text-xs text-muted-foreground">
            Data sinkron dari database
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">
            Armada Tersedia
          </h3>
          <span className="h-4 w-4 text-muted-foreground">✅</span>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{carsAvailable}</div>
          <p className="text-xs text-muted-foreground">
            Jenis yang aktif disewakan
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Paket Tour</h3>
          <span className="h-4 w-4 text-muted-foreground">🧭</span>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{tourTotal}</div>
          <p className="text-xs text-muted-foreground">Paket aktif</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Mitra</h3>
          <span className="h-4 w-4 text-muted-foreground">🤝</span>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{partnersTotal}</div>
          <p className="text-xs text-muted-foreground">Partner terdaftar</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang di panel admin Reborn Lombok Trans
          </p>
        </div>

        {/* Stats Cards (Server render, real data) */}
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <StatsCards />
        </Suspense>

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 pb-4">
              <h3 className="text-lg font-semibold">Aksi Cepat</h3>
            </div>
            <div className="p-6 pt-0 space-y-3">
              <a
                href="/admin/cars"
                className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Tambah Mobil Baru</p>
                  <p className="text-sm text-muted-foreground">
                    Daftarkan kendaraan ke armada
                  </p>
                </div>
              </a>

              <a
                href="/admin/tour-packages"
                className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Buat Paket Tour</p>
                  <p className="text-sm text-muted-foreground">
                    Rancang paket wisata baru
                  </p>
                </div>
              </a>

              <a
                href="/admin/partners"
                className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Kelola Mitra</p>
                  <p className="text-sm text-muted-foreground">
                    Tambah atau edit partner
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 pb-4">
              <h3 className="text-lg font-semibold">Status Sistem</h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Services</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">Aktif</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Upload System</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">Siap</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Backup</span>
                <span className="text-xs text-muted-foreground">
                  2 jam lalu
                </span>
              </div>

              <div className="pt-2">
                <a
                  href="/admin/health"
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Lihat detail status sistem →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
