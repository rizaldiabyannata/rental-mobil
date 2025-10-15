"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Car as CarIcon,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

function formatCurrency(value) {
  if (typeof value !== "number") return "-";
  return currencyFormatter.format(value);
}

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedSearch(searchTerm.trim()),
      300
    );
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchCars = useCallback(
    async (controller) => {
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (statusFilter !== "all")
          params.set("available", statusFilter === "available");

        setLoading(true);
        const res = await fetch(
          `/api/cars${params.toString() ? `?${params}` : ""}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || "Gagal memuat data kendaraan");
        }
        const json = await res.json();
        setCars(Array.isArray(json.data) ? json.data : []);
        setPagination(json.pagination || { total: 0, page: 1, limit });
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Fetch cars error", err);
        setError(err.message || "Tidak dapat memuat data kendaraan");
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, statusFilter, page, limit]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCars(controller);
    return () => controller.abort();
  }, [fetchCars]);

  const transmissions = useMemo(() => {
    const set = new Set();
    cars.forEach((car) => {
      if (car?.transmission) {
        set.add(car.transmission);
      }
    });
    return Array.from(set);
  }, [cars]);

  const filteredCars = useMemo(() => {
    if (transmissionFilter === "all") return cars;
    return cars.filter((car) => car.transmission === transmissionFilter);
  }, [cars, transmissionFilter]);

  const availableCount = useMemo(
    () => cars.filter((car) => car.available).length,
    [cars]
  );
  const unavailableCount = useMemo(
    () => cars.filter((car) => !car.available).length,
    [cars]
  );
  const averagePrice = useMemo(() => {
    if (!cars.length) return 0;
    const total = cars.reduce((sum, car) => sum + (car.startingPrice || 0), 0);
    return total / cars.length;
  }, [cars]);

  const totalPages =
    pagination.totalPages ||
    Math.max(
      1,
      Math.ceil((pagination.total || filteredCars.length || 1) / limit)
    );

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const openDeleteDialog = (car) => {
    setCarToDelete(car);
    setDeleteError(null);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!carToDelete) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const res = await fetch(`/api/cars/${carToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Gagal menghapus kendaraan");
      }
      // Optimistically remove from list
      setCars((prev) => prev.filter((c) => c.id !== carToDelete.id));
      // Adjust pagination.total if present
      setPagination((p) => ({ ...p, total: Math.max(0, (p.total || 0) - 1) }));
      setIsDeleteDialogOpen(false);
      setCarToDelete(null);
    } catch (err) {
      console.error("Delete car failed", err);
      setDeleteError(err.message || "Terjadi kesalahan saat menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

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
                <BreadcrumbLink href="/admin/dashboard">
                  Admin Panel
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Manajemen Armada</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <CarIcon className="h-8 w-8 text-emerald-600" />
              Manajemen Armada
            </h1>
            <p className="text-muted-foreground">
              Kelola data mobil dan kendaraan dalam armada rental
            </p>
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/admin/cars/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Mobil
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mobil</CardTitle>
              <CarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cars.length}</div>
              <p className="text-xs text-muted-foreground">
                Kendaraan terdaftar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tersedia</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {availableCount}
              </div>
              <p className="text-xs text-muted-foreground">Siap disewakan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tidak Tersedia
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {unavailableCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Sedang disewa / maintenance
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama mobil atau deskripsi..."
                className="pl-10 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter("all");
                  setPage(1);
                }}
              >
                Semua Status
              </Button>
              <Button
                variant={statusFilter === "available" ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter("available");
                  setPage(1);
                }}
              >
                Tersedia
              </Button>
              <Button
                variant={statusFilter === "unavailable" ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter("unavailable");
                  setPage(1);
                }}
              >
                Tidak Tersedia
              </Button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">
                  Transmisi:
                </label>
                <select
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={transmissionFilter}
                  onChange={(event) =>
                    setTransmissionFilter(event.target.value)
                  }
                >
                  <option value="all">Semua</option>
                  {transmissions.map((transmission) => (
                    <option key={transmission} value={transmission}>
                      {transmission}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Kendaraan</CardTitle>
            <CardDescription>
              Kelola informasi detail setiap kendaraan dalam armada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mobil</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Transmisi</TableHead>
                    <TableHead>Harga Mulai</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-6 text-center text-sm text-muted-foreground"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Memuat data kendaraan...
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && error && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-6 text-center text-sm text-red-600"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && filteredCars.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-6 text-center text-sm text-muted-foreground"
                      >
                        Tidak ada data kendaraan yang sesuai.
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    !error &&
                    filteredCars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <div className="font-semibold">{car.name}</div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {car.description || "-"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {car.capacity || "-"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              orang
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {car.transmission || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">
                            {formatCurrency(car.startingPrice)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            per hari
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={car.available ? "default" : "destructive"}
                            className={
                              car.available
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : ""
                            }
                          >
                            {car.available ? "Tersedia" : "Tidak Tersedia"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/cars/${car.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/cars/${car.id}/images`}>
                                <ImageIcon className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/cars/${car.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => openDeleteDialog(car)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-4 text-sm">
                <span className="text-muted-foreground">
                  Halaman {page} dari {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Kendaraan</DialogTitle>
              <DialogDescription>
                Tindakan ini akan menghapus kendaraan
                {carToDelete ? ` "${carToDelete.name}" ` : " "}dari armada.
                Tindakan tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            {deleteError && (
              <p className="text-sm text-red-600">{deleteError}</p>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                onClick={handleConfirmDelete}
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
