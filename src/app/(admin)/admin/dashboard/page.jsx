"use client";

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
import { useEffect, useState, useCallback } from "react";
import {
  Car,
  CheckCircle2,
  Handshake,
  Wallet,
  HelpCircle,
  FileText,
  AlertTriangle,
  Plus,
  Users,
} from "lucide-react";

function StatSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-7 bg-muted rounded w-1/4" />
      <div className="h-3 bg-muted rounded w-2/5" />
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!res.ok) {
        setError(`Status ${res.status}`);
      } else {
        const json = await res.json();
        setStats(json?.data || null);
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const carsTotal = stats?.cars?.total ?? 0;
  const carsAvailable = stats?.cars?.available ?? 0;
  const carsUnavailable =
    stats?.cars?.unavailable ?? Math.max(carsTotal - carsAvailable, 0);
  const partnersTotal = stats?.partners?.total ?? 0;
  const tariffCategories = stats?.tariffs?.categories ?? 0;
  const tariffItems = stats?.tariffs?.items ?? 0;
  const faqsTotal = stats?.faqs?.total ?? 0;
  const activeTerms = stats?.terms?.active ?? 0;

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

        {/* Stats Cards (Client fetch with useEffect) */}
        {error && !loading && (
          <div className="rounded-md border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Gagal memuat statistik ({error}).
            <button
              onClick={load}
              className="ml-4 inline-flex items-center rounded border px-2 py-1 text-xs font-medium hover:bg-red-100"
            >
              Coba Lagi
            </button>
          </div>
        )}
        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <StatSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">
                  Total Jenis Armada
                </h3>
                <Car className="h-4 w-4 text-muted-foreground" />
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
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
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
                <h3 className="tracking-tight text-sm font-medium">Mitra</h3>
                <Handshake className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{partnersTotal}</div>
                <p className="text-xs text-muted-foreground">
                  Partner terdaftar
                </p>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">
                  Item Tarif
                </h3>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{tariffItems}</div>
                <p className="text-xs text-muted-foreground">
                  Detail harga aktif
                </p>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">FAQ</h3>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{faqsTotal}</div>
                <p className="text-xs text-muted-foreground">
                  Pertanyaan aktif
                </p>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">
                  S&K Aktif
                </h3>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{activeTerms}</div>
                <p className="text-xs text-muted-foreground">Poin aktif</p>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">
                  Armada Non-Aktif
                </h3>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{carsUnavailable}</div>
                <p className="text-xs text-muted-foreground">Perlu review</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 md:grid-cols-1">
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
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Tambah Mobil Baru</p>
                  <p className="text-sm text-muted-foreground">
                    Daftarkan kendaraan ke armada
                  </p>
                </div>
              </a>

              <a
                href="/admin/partners"
                className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                  <Users className="h-4 w-4" />
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
        </div>
      </div>
    </>
  );
}
