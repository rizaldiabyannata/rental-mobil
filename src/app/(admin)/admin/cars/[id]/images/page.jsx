// MinIO integration
const MINIO_PUBLIC_URL = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
const MINIO_BUCKET = process.env.NEXT_PUBLIC_MINIO_BUCKET || "uploads";
function getImageUrl(src) {
  if (!src) return "/InnovaReborn.png";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) src = src.slice(1);
  if (src.startsWith(MINIO_BUCKET + "/")) {
    return `${MINIO_PUBLIC_URL}/${src}`;
  }
  return `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${src}`;
}
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Image as ImageIcon,
  ArrowLeft,
  Upload,
  Edit,
  Trash2,
  Eye,
  Download,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "-";
  }
}

export default function CarImagesPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params?.id;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [car, setCar] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!carId) return undefined;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/cars/${carId}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Gagal memuat data mobil");
        }
        const json = await res.json();
        setCar(json.data);
        setImages(Array.isArray(json.data?.images) ? json.data.images : []);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Fetch car images error", err);
        setError(err.message || "Tidak dapat memuat data mobil");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [carId]);

  const sortedImages = useMemo(
    () => [...images].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [images]
  );

  const primaryImage = sortedImages[0] || null;
  const secondaryImages = sortedImages.slice(1);

  const handleFileSelect = (event) => {
    setSelectedFiles(Array.from(event.target.files || []));
  };

  const handleUpload = async () => {
    if (!car) return;
    const formData = new FormData();
    formData.append("carId", car.id);
    selectedFiles.forEach((file, idx) => {
      formData.append("images", file);
      formData.append(`alt_${idx}`, `${car.name} - ${file.name}`);
    });

    try {
      const res = await fetch("/api/cars/images/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Upload gambar gagal");
      }
      setImages(Array.isArray(json.data?.images) ? json.data.images : []);
      setSelectedFiles([]);
      setIsUploadDialogOpen(false);
    } catch (err) {
      console.error("Upload images error", err);
      alert(err.message || "Upload gagal");
    }
  };

  const handleSetPrimary = async (imageId) => {
    if (!car) return;
    const orders = sortedImages.map((image, index) => ({
      id: image.id,
      order: image.id === imageId ? 0 : index + 1,
    }));

    try {
      const res = await fetch("/api/cars/images/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: car.id, orders }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengubah urutan gambar");
      }
      setImages(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Set primary image error", err);
      alert(err.message || "Tidak dapat mengatur foto utama");
    }
  };

  const handleDelete = async (imageId) => {
    if (!car) return;
    const formData = new FormData();
    formData.append("carId", car.id);
    formData.append("removeImageIds", JSON.stringify([imageId]));

    try {
      const res = await fetch("/api/cars/images/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus gambar");
      }
      setImages(Array.isArray(json.data?.images) ? json.data.images : []);
    } catch (err) {
      console.error("Delete image error", err);
      alert(err.message || "Tidak dapat menghapus gambar");
    }
  };

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
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat galeri
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
                  <BreadcrumbPage>Galeri Foto</BreadcrumbPage>
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
                <BreadcrumbLink href={`/admin/cars/${car.id}`}>
                  {car.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Galeri Foto</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <ImageIcon className="h-8 w-8 text-emerald-600" />
              Galeri Foto - {car.name}
            </h1>
            <p className="text-muted-foreground">
              Kelola foto dan gambar untuk kendaraan ini
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="gap-2">
              <Link href={`/admin/cars/${car.id}`}>
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <Dialog
              open={isUploadDialogOpen}
              onOpenChange={setIsUploadDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Upload className="h-4 w-4" />
                  Upload Foto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Foto Baru</DialogTitle>
                  <DialogDescription>
                    Pilih file gambar untuk diupload ke galeri kendaraan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageFiles">Pilih File Gambar</Label>
                    <Input
                      id="imageFiles"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>File Terpilih:</Label>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {selectedFiles.map((file, index) => (
                          <div key={index}>
                            • {file.name} (
                            {(file.size / 1024 / 1024).toFixed(1)} MB)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Upload {selectedFiles.length} File
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Foto</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{images.length}</div>
              <p className="text-xs text-muted-foreground">Gambar tersedia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Foto Utama</CardTitle>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{primaryImage ? 1 : 0}</div>
              <p className="text-xs text-muted-foreground">
                {primaryImage?.alt || "Belum diset"}
              </p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Ukuran
              </CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Storage terpakai</p>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upload Terakhir
              </CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {images.length > 0
                  ? formatDate(
                      images.reduce((latest, image) => {
                        const createdAt = image.createdAt || image.updatedAt;
                        if (!latest) return createdAt;
                        return new Date(createdAt) > new Date(latest)
                          ? createdAt
                          : latest;
                      }, null)
                    )
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground">Foto terbaru</p>
            </CardContent>
          </Card>
        </div>

        {primaryImage && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Foto Utama
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    Primary
                  </Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex items-center justify-center rounded-lg border-2 border-emerald-200 bg-muted lg:col-span-1">
                  {primaryImage.imageUrl ? (
                    <img
                      src={getImageUrl(primaryImage.imageUrl)}
                      alt={primaryImage.alt || car.name}
                      className="h-full max-h-48 w-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Alt Text</Label>
                      <p className="text-sm text-muted-foreground">
                        {primaryImage.alt || "-"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Diunggah</Label>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(primaryImage.createdAt)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">URL</Label>
                      <p className="truncate text-sm text-muted-foreground">
                        {primaryImage.imageUrl}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-600 hover:bg-red-700"
                      onClick={() => {
                        if (!primaryImage?.id) return;
                        const ok = window.confirm(
                          "Hapus foto utama ini? Tindakan ini tidak dapat dibatalkan."
                        );
                        if (ok) handleDelete(primaryImage.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 hover:text-white" /> Hapus
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Foto Lainnya</CardTitle>
            <CardDescription>
              Galeri foto pendukung untuk kendaraan ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {secondaryImages.map((image) => (
                <div key={image.id} className="space-y-3">
                  <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-muted">
                    {image.imageUrl ? (
                      <img
                        src={getImageUrl(image.imageUrl)}
                        alt={image.alt || car.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {image.alt || "Tanpa keterangan"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order: {image.order ?? "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Diunggah: {formatDate(image.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleSetPrimary(image.id)}
                      >
                        <RotateCcw className="h-3 w-3" /> Set Utama
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {secondaryImages.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <ImageIcon className="mx-auto mb-4 h-12 w-12" />
                <p>Belum ada foto lain yang diupload</p>
                <p className="text-sm">
                  Upload foto untuk melengkapi galeri kendaraan
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
