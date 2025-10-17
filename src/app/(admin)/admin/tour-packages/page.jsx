"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  Plus,
  Edit,
  Trash2,
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

// Function to find the lowest price among all tiers for a package
const getStartingPrice = (tourPackage) => {
    if (!tourPackage.hotelTiers || tourPackage.hotelTiers.length === 0) {
        return 0;
    }
    let minPrice = Infinity;
    tourPackage.hotelTiers.forEach(tier => {
        tier.priceTiers.forEach(priceTier => {
            if (priceTier.price < minPrice) {
                minPrice = priceTier.price;
            }
        });
    });
    return minPrice === Infinity ? 0 : minPrice;
};

export default function TourPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchPackages = useCallback(async (controller) => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/tour-packages", {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Gagal memuat data paket tour");
      }
      const json = await res.json();
      setPackages(Array.isArray(json) ? json : []);
      setError(null);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Fetch packages error", err);
      setError(err.message || "Tidak dapat memuat data paket tour");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPackages(controller);
    return () => controller.abort();
  }, [fetchPackages]);

  const openDeleteDialog = (pkg) => {
    setPackageToDelete(pkg);
    setDeleteError(null);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!packageToDelete) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const res = await fetch(`/api/admin/tour-packages/${packageToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Gagal menghapus paket tour");
      }
      setPackages((prev) => prev.filter((p) => p.id !== packageToDelete.id));
      setIsDeleteDialogOpen(false);
      setPackageToDelete(null);
    } catch (err) {
      console.error("Delete package failed", err);
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
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Paket Tour</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Package className="h-8 w-8 text-emerald-600" />
              Manajemen Paket Tour
            </h1>
            <p className="text-muted-foreground">
              Kelola paket wisata yang ditawarkan
            </p>
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/admin/tour-packages/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Paket
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Paket Tour</CardTitle>
            <CardDescription>
              Kelola informasi detail setiap paket wisata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Paket</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Harga Mulai</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Memuat data paket...
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && error && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-sm text-red-600">
                        {error}
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && packages.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                        Belum ada paket tour yang ditambahkan.
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pkg.duration}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(getStartingPrice(pkg))}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/tour-packages/edit/${pkg.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => openDeleteDialog(pkg)}
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
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Paket Tour</DialogTitle>
            <DialogDescription>
              Tindakan ini akan menghapus paket tour "{packageToDelete?.name}". Tindakan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Batal
            </Button>
            <Button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Menghapus...
                </span>
              ) : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}