"use client";

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
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Car, Save, ArrowLeft, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EditCarPage() {
  const params = useParams();
  const router = useRouter();
  const carId = useMemo(() => (params?.id ? String(params.id) : ""), [params]);

  // Local states
  const [features, setFeatures] = useState([
    "AC",
    "Audio System",
    "USB Charger",
    "Bluetooth",
  ]);
  const [newFeature, setNewFeature] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const originalSpecsRef = useRef({});

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    transmission: "Manual",
    fuelType: "Bensin",
    year: "",
    startingPrice: "",
    available: true,
    licensePlate: "",
    color: "",
    engineCapacity: "",
    mileage: "",
  });

  // Fetch car by id
  useEffect(() => {
    let aborted = false;
    async function load() {
      if (!carId) return;
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const res = await fetch(`/api/cars/${carId}`);
        if (!res.ok) {
          const msg = await res.json().catch(() => ({}));
          throw new Error(
            msg?.error || `Gagal memuat data (status ${res.status})`
          );
        }
        const json = await res.json();
        const car = json?.data || {};
        if (aborted) return;
        const specs = car.specifications || {};
        originalSpecsRef.current = specs;
        setFeatures(Array.isArray(car.features) ? car.features : []);
        setFormData({
          name: car.name || "",
          description: car.description || "",
          capacity: String(car.capacity ?? ""),
          transmission: car.transmission || "Manual",
          fuelType: car.fuelType || "Bensin",
          year: specs.year ? String(specs.year) : "",
          startingPrice:
            car.startingPrice != null ? String(car.startingPrice) : "",
          available: !!car.available,
          licensePlate: specs.licensePlate || "",
          color: specs.color || "",
          engineCapacity: specs.engineCapacity
            ? String(specs.engineCapacity)
            : "",
          mileage: specs.mileage ? String(specs.mileage) : "",
        });
      } catch (e) {
        console.error(e);
        setError(e.message || "Terjadi kesalahan saat memuat data");
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    load();
    return () => {
      aborted = true;
    };
  }, [carId]);

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const baseFieldClasses =
    "bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carId) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Merge custom specifications while preserving unknown keys
      const nextSpecs = {
        ...originalSpecsRef.current,
        year: formData.year ? parseInt(formData.year) : undefined,
        licensePlate: formData.licensePlate || undefined,
        color: formData.color || undefined,
        engineCapacity: formData.engineCapacity
          ? parseInt(formData.engineCapacity)
          : undefined,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
      };

      // Remove undefined keys from specs
      Object.keys(nextSpecs).forEach(
        (k) => nextSpecs[k] === undefined && delete nextSpecs[k]
      );

      const payload = {
        name: formData.name,
        description: formData.description,
        startingPrice: formData.startingPrice
          ? parseInt(formData.startingPrice)
          : 0,
        capacity: formData.capacity ? parseInt(formData.capacity) : 0,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        available: !!formData.available,
        features: features,
        specifications: nextSpecs,
      };

      const res = await fetch(`/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Gagal menyimpan perubahan");
      }
      setSuccess("Perubahan berhasil disimpan.");
      // Update original specs snapshot with what we sent
      originalSpecsRef.current = payload.specifications || {};
    } catch (e) {
      console.error(e);
      setError(e.message || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SidebarProvider>
      <SidebarInset>
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
                  <BreadcrumbLink href="/admin/cars/1">
                    {formData.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Car className="h-8 w-8 text-emerald-600" />
                Edit {formData.name}
              </h1>
              <p className="text-muted-foreground">
                Ubah informasi kendaraan dalam armada rental
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {loading && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                Memuat data kendaraan...
              </div>
            )}
            {!loading && error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {!loading && success && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                {success}
              </div>
            )}
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
                <CardDescription>
                  Informasi umum tentang kendaraan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Mobil *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={cn(baseFieldClasses)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Kapasitas Penumpang *</Label>
                    <Select
                      value={formData.capacity}
                      onValueChange={(value) =>
                        handleInputChange("capacity", value)
                      }
                    >
                      <SelectTrigger className={cn(baseFieldClasses, "h-11")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Orang</SelectItem>
                        <SelectItem value="4">4 Orang</SelectItem>
                        <SelectItem value="5">5 Orang</SelectItem>
                        <SelectItem value="7">7 Orang</SelectItem>
                        <SelectItem value="8">8 Orang</SelectItem>
                        <SelectItem value="12">12 Orang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className={cn(baseFieldClasses, "min-h-[120px]")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmisi *</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) =>
                        handleInputChange("transmission", value)
                      }
                    >
                      <SelectTrigger className={cn(baseFieldClasses, "h-11")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Bahan Bakar *</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) =>
                        handleInputChange("fuelType", value)
                      }
                    >
                      <SelectTrigger className={cn(baseFieldClasses, "h-11")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bensin">Bensin</SelectItem>
                        <SelectItem value="Solar">Solar</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Listrik">Listrik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Tahun Kendaraan</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        handleInputChange("year", e.target.value)
                      }
                      className={cn(baseFieldClasses)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Fitur & Fasilitas</CardTitle>
                <CardDescription>
                  Kelola fitur yang tersedia pada kendaraan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Tambah fitur baru"
                    className={cn(baseFieldClasses)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addFeature}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Harga & Ketersediaan</CardTitle>
                <CardDescription>
                  Atur harga sewa dan status ketersediaan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startingPrice">
                    Harga Mulai (per hari) *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="startingPrice"
                      type="number"
                      value={formData.startingPrice}
                      onChange={(e) =>
                        handleInputChange("startingPrice", e.target.value)
                      }
                      className={cn(baseFieldClasses, "pl-8")}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) =>
                      handleInputChange("available", checked)
                    }
                  />
                  <Label htmlFor="available">Tersedia untuk disewa</Label>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Kendaraan</CardTitle>
                <CardDescription>
                  Informasi teknis dan identitas kendaraan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">Nomor Polisi</Label>
                    <Input
                      id="licensePlate"
                      value={formData.licensePlate}
                      onChange={(e) =>
                        handleInputChange("licensePlate", e.target.value)
                      }
                      className={cn(baseFieldClasses)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Warna</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                      className={cn(baseFieldClasses)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineCapacity">Kapasitas Mesin (CC)</Label>
                    <Input
                      id="engineCapacity"
                      type="number"
                      value={formData.engineCapacity}
                      onChange={(e) =>
                        handleInputChange("engineCapacity", e.target.value)
                      }
                      className={cn(baseFieldClasses)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Kilometer (KM)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) =>
                        handleInputChange("mileage", e.target.value)
                      }
                      className={cn(baseFieldClasses)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                disabled={saving}
              >
                <Save className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
