"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCcw,
  Package,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatIDR } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function TariffsPage() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  // season removed
  const [carOptions, setCarOptions] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Set initial carId from URL parameter
  useEffect(() => {
    const carIdFromUrl = searchParams.get("carId");
    if (carIdFromUrl) {
      setSelectedCarId(carIdFromUrl);
    }
  }, [searchParams]);
  const [deleteError, setDeleteError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (selectedCarId !== "all") params.set("carId", selectedCarId);
      const res = await fetch(`/api/tariffs?${params.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal memuat tarif");
      setCategories(Array.isArray(json.data) ? json.data : []);
      setPagination(
        json.pagination || {
          page: 1,
          limit,
          total: (json.data || []).length,
          totalPages: 1,
        }
      );
    } catch (e) {
      setError(e.message || "Tidak dapat memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, selectedCarId]);

  // Load cars for car filter
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/cars?page=1&limit=50`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        setCarOptions(list);
      } catch (_) {
        // ignore
      }
    })();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return categories
      .filter((c) =>
        selectedCategory === "all" ? true : c.id === selectedCategory
      )
      .map((c) => {
        // filter items by search only
        const items = (c.items || []).filter((it) => {
          const searchOk = !s
            ? true
            : c.name?.toLowerCase().includes(s) ||
              c.description?.toLowerCase().includes(s) ||
              it.name?.toLowerCase().includes(s);
          return searchOk;
        });
        return { ...c, items };
      })
      .filter((c) => (c.items && c.items.length > 0) || !search); // if searching, hide empty; if not searching, show all
  }, [categories, search, selectedCategory]);
  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const requestDelete = (cat) => {
    setDeleteTarget(cat);
    setDeleteError("");
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/tariffs/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Gagal menghapus kategori");
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    } catch (e) {
      setDeleteError(e.message || "Tidak dapat menghapus kategori");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard">
                  Admin Panel
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tarif Penyewaan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Manajemen Tarif Penyewaan
            </h1>
            <p className="text-muted-foreground">
              Kelola semua kategori dan item tarif (umum & per-kendaraan).
              Gunakan filter mobil untuk melihat atau mengatur tarif khusus
              kendaraan tertentu.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onRefresh} disabled={refreshing}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link
                href="/admin/tariffs/new"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Kategori Baru
              </Link>
            </Button>
          </div>
        </div>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-100 p-2">
                <Package className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-emerald-800">
                  Sistem Manajemen Tarif Terpusat
                </h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Halaman ini adalah pusat kendali untuk semua tarif penyewaan.
                  Anda dapat mengelola tarif umum (berlaku untuk semua
                  kendaraan) dan tarif khusus per kendaraan. Gunakan filter
                  "Mobil" untuk melihat atau mengatur tarif spesifik suatu
                  kendaraan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Tarif (Kategori & Item)</CardTitle>
            <CardDescription>
              Tampilan lengkap dengan pencarian dan filter per mobil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari kategori atau item..."
                  className="pl-10 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                />
              </div>
              <div className="flex gap-3">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                >
                  <SelectTrigger className="w-[220px] border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedCarId}
                  onValueChange={(val) => {
                    setSelectedCarId(val);
                    setPage(1);
                  }}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                >
                  <SelectTrigger className="w-[260px] border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60">
                    <SelectValue placeholder="Filter Mobil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Armada</SelectItem>
                    {carOptions.map((car) => (
                      <SelectItem key={car.id} value={car.id}>
                        {car.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* season filter removed */}
              </div>
              {selectedCarId !== "all" && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  >
                    📋 Menampilkan tarif untuk:{" "}
                    {carOptions.find((c) => c.id === selectedCarId)?.name ||
                      "Kendaraan"}
                  </Badge>
                </div>
              )}
            </div>

            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Memuat data...
                </span>
              </div>
            )}
            {!loading && error && (
              <div className="py-6 text-center text-sm text-red-600">
                {error}
              </div>
            )}
            {!loading && !error && filtered.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Tidak ada data
              </div>
            )}

            {!loading &&
              !error &&
              filtered.map((c) => (
                <Card key={c.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{c.name}</CardTitle>
                        {c.description && (
                          <CardDescription className="mt-1 max-w-3xl">
                            {c.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/admin/tariffs/${c.id}/edit`}
                            className="inline-flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => requestDelete(c)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(c.items || []).length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Belum ada item untuk kategori ini.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item Name</TableHead>
                              <TableHead>Service Type</TableHead>
                              <TableHead>Package Type</TableHead>
                              <TableHead className="w-[160px]">Price</TableHead>
                              <TableHead className="w-[200px]">
                                Armada
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {c.items.map((it) => (
                              <TableRow key={it.id}>
                                <TableCell className="font-medium">
                                  {it.name}
                                </TableCell>
                                <TableCell>{it.serviceType || "-"}</TableCell>
                                <TableCell>{it.packageType || "-"}</TableCell>
                                <TableCell>
                                  {formatIDR(it.price || 0)}
                                </TableCell>
                                {/* Season cell removed */}
                                <TableCell>
                                  {it.carId ? (
                                    <Link
                                      className="underline"
                                      href={`/admin/cars/${it.carId}`}
                                    >
                                      {carOptions.find(
                                        (co) => co.id === it.carId
                                      )?.name || "Lihat Detail Mobil"}
                                    </Link>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      General
                                    </span>
                                  )}
                                </TableCell>
                                {/* Order removed */}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

            {!loading && !error && (
              <div className="flex items-center justify-between border-t pt-4 text-sm">
                <span className="text-muted-foreground">
                  Halaman {pagination.page} dari {pagination.totalPages} • Total{" "}
                  {pagination.total} kategori
                </span>
                <div className="flex gap-2">
                  <Select
                    value={String(limit)}
                    onValueChange={(v) => {
                      setLimit(parseInt(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Per halaman" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.page <= 1}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) =>
                          Math.min(pagination.totalPages || 1, p + 1)
                        )
                      }
                      disabled={pagination.page >= (pagination.totalPages || 1)}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Kategori</DialogTitle>
              <DialogDescription>
                Tindakan ini akan menghapus kategori
                {deleteTarget ? ` "${deleteTarget.name}"` : ""}. Data item di
                dalamnya juga akan terhapus. Lanjutkan?
              </DialogDescription>
            </DialogHeader>
            {deleteError && (
              <p className="text-sm text-red-600">{deleteError}</p>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Menghapus...
                  </span>
                ) : (
                  "Hapus"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
