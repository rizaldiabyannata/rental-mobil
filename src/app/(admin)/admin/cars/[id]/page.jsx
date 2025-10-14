"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car as CarIcon,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Fuel,
  Settings,
  Users,
  MapPin,
  Gauge,
  Palette,
  Image as ImageIcon,
  CreditCard,
  FileText,
  Loader2,
  AlertCircle,
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

function formatNumber(value) {
  if (typeof value !== "number") return value ?? "-";
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params?.id;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!carId) return;
    const controller = new AbortController();

    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/cars/${carId}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Gagal memuat detail kendaraan");
        }
        const json = await res.json();
        setCar(json.data);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Fetch car detail error", err);
        setError(err.message || "Tidak dapat memuat data kendaraan");
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
    return () => controller.abort();
  }, [carId]);

  const handleDelete = async () => {
    if (!carId) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/cars/${carId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Gagal menghapus (status ${res.status})`
        );
      }

      // Redirect to cars list after successful deletion
      router.push("/admin/cars");
    } catch (err) {
      console.error("Delete car error:", err);
      setError(err.message || "Terjadi kesalahan saat menghapus mobil");
    } finally {
      setDeleting(false);
    }
  };

  const specifications = useMemo(() => {
    if (!car?.specifications || typeof car.specifications !== "object")
      return {};
    return car.specifications;
  }, [car]);

  const coverImage = useMemo(() => {
    if (car?.coverImage) return car.coverImage;
    if (!car?.images || !car.images.length) return null;
    return car.images[0]?.imageUrl ?? null;
  }, [car]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat detail
              kendaraan...
            </div>
          </div>
        </header>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex flex-1 flex-col">
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
                  <BreadcrumbLink href="/admin/cars">
                    Manajemen Armada
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail Mobil</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center p-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-base font-semibold">
              {error || "Data mobil tidak ditemukan"}
            </p>
            <Button
              onClick={() => router.push("/admin/cars")}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke daftar mobil
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                <BreadcrumbLink href="/admin/cars">
                  Manajemen Armada
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{car.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <CarIcon className="h-8 w-8 text-emerald-600" />
                {car.name}
              </h1>
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
            </div>
            <p className="text-muted-foreground">
              Detail lengkap informasi kendaraan
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              <Link href={`/admin/cars/${car.id}/edit`}>
                <Edit className="h-4 w-4" /> Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="gap-2"
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {deleting ? "Menghapus..." : "Hapus"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Kendaraan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus kendaraan "{car.name}"?
                    Tindakan ini tidak dapat dibatalkan dan akan menghapus semua
                    data terkait termasuk gambar, tarif, dan riwayat pemesanan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Kapasitas</p>
                      <p className="font-semibold">
                        {car.capacity || "-"} Orang
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Transmisi</p>
                      <p className="font-semibold">{car.transmission || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Bahan Bakar
                      </p>
                      <p className="font-semibold">{car.fuelType || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tahun</p>
                      <p className="font-semibold">
                        {formatNumber(specifications.year)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Deskripsi
                  </p>
                  <p className="text-sm leading-relaxed">
                    {car.description || "Belum ada deskripsi kendaraan."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detail Kendaraan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Warna</p>
                      <p className="font-semibold">
                        {specifications.color || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Kapasitas Mesin
                      </p>
                      <p className="font-semibold">
                        {specifications.engineCapacity
                          ? `${formatNumber(specifications.engineCapacity)} CC`
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dibuat</p>
                      <p className="font-semibold">
                        {new Date(car.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Terakhir Update
                      </p>
                      <p className="font-semibold">
                        {new Date(car.updatedAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fitur & Fasilitas</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Show new featureBlocks if available */}
                {car.featureBlocks && car.featureBlocks.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {car.featureBlocks.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50"
                      >
                        <div className="flex-shrink-0">
                          {feature.icon && (
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="text-emerald-600 text-sm font-semibold">
                                {feature.icon.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground">
                            {feature.title}
                          </h4>
                          {feature.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Fallback to legacy features array */
                  <div className="flex flex-wrap gap-2">
                    {(car.features || []).length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        Belum ada fitur yang ditambahkan.
                      </span>
                    )}
                    {(car.features || []).map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Galeri Foto</CardTitle>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href={`/admin/cars/${car.id}/images`}>
                      <ImageIcon className="h-4 w-4" />
                      Kelola Foto
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {(car.images || []).map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-video overflow-hidden rounded-lg border bg-muted"
                    >
                      {image.imageUrl ? (
                        <img
                          src={image.imageUrl}
                          alt={image.alt || car.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {(!car.images || car.images.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Belum ada foto yang diupload</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Harga Sewa</CardTitle>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href={`/admin/cars/${car.id}/tariffs`}>
                      <CreditCard className="h-4 w-4" />
                      Edit Tarif
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
                  <p className="text-sm font-medium text-emerald-600">
                    Harga Mulai
                  </p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {formatCurrency(car.startingPrice)}
                  </p>
                  <p className="text-sm text-emerald-600">per hari</p>
                </div>
                <div className="space-y-3">
                  {(car.tariffs || []).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Belum ada data tarif yang ditambahkan.
                    </p>
                  )}
                  {(car.tariffs || []).map((tariff) => (
                    <div
                      key={tariff.id}
                      className="flex items-center justify-between gap-3 border-b border-muted py-2"
                    >
                      <div>
                        <p className="font-medium">{tariff.name}</p>
                        {tariff.description && (
                          <p className="text-xs text-muted-foreground">
                            {tariff.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(tariff.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Link href={`/admin/cars/${car.id}/edit`}>
                    <Edit className="h-4 w-4" /> Edit Informasi
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Link href={`/admin/cars/${car.id}/images`}>
                    <ImageIcon className="h-4 w-4" /> Kelola Foto
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Link href={`/admin/cars/${car.id}/tariffs`}>
                    <CreditCard className="h-4 w-4" /> Atur Tarif
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
