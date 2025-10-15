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
import {
  Car,
  Save,
  ArrowLeft,
  Plus,
  X,
  Shield,
  Music,
  Snowflake,
  Wifi,
  Camera,
  Navigation,
  Battery,
  Bluetooth,
  Smartphone,
  Zap,
  Wind,
  Sun,
  Fuel,
  Users,
  Lock,
  MapPin,
  Radio,
  Volume2,
  Thermometer,
  Settings,
  Star,
  Award,
  CheckCircle,
  Heart,
  Coffee,
  Briefcase,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EditCarPage() {
  const params = useParams();
  const router = useRouter();
  const carId = useMemo(() => (params?.id ? String(params.id) : ""), [params]);

  // Icon options for features
  const iconOptions = [
    { name: "Shield", icon: Shield, label: "Keamanan" },
    { name: "Music", icon: Music, label: "Musik/Audio" },
    { name: "Snowflake", icon: Snowflake, label: "AC" },
    { name: "Wifi", icon: Wifi, label: "WiFi" },
    { name: "Camera", icon: Camera, label: "Kamera" },
    { name: "Navigation", icon: Navigation, label: "GPS/Navigasi" },
    { name: "Battery", icon: Battery, label: "Charger" },
    { name: "Bluetooth", icon: Bluetooth, label: "Bluetooth" },
    { name: "Smartphone", icon: Smartphone, label: "USB/Phone" },
    { name: "Zap", icon: Zap, label: "Power" },
    { name: "Wind", icon: Wind, label: "Ventilasi" },
    { name: "Sun", icon: Sun, label: "Sunroof" },
    { name: "Fuel", icon: Fuel, label: "Bahan Bakar" },
    { name: "Users", icon: Users, label: "Kapasitas" },
    { name: "Lock", icon: Lock, label: "Central Lock" },
    { name: "MapPin", icon: MapPin, label: "Tracking" },
    { name: "Radio", icon: Radio, label: "Radio" },
    { name: "Volume2", icon: Volume2, label: "Speaker" },
    { name: "Thermometer", icon: Thermometer, label: "Climate" },
    { name: "Settings", icon: Settings, label: "Otomatis" },
    { name: "Star", icon: Star, label: "Premium" },
    { name: "Award", icon: Award, label: "Berkualitas" },
    { name: "CheckCircle", icon: CheckCircle, label: "Terjamin" },
    { name: "Heart", icon: Heart, label: "Nyaman" },
    { name: "Coffee", icon: Coffee, label: "Refreshment" },
    { name: "Briefcase", icon: Briefcase, label: "Bisnis" },
  ];

  // Local states
  // Structured feature blocks: { id?, icon, title, description, order? }
  const [featureBlocks, setFeatureBlocks] = useState([]);
  const [fbDraft, setFbDraft] = useState({
    icon: "",
    title: "",
    description: "",
  });
  // Flexible Specification Details: array of { label, value }
  const [specDetails, setSpecDetails] = useState([]);
  const [specDraft, setSpecDraft] = useState({ label: "", value: "" });
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
    startingPrice: "",
    available: true,
    licensePlate: "",
    color: "",
    engineCapacity: "",
    mileage: "",
    engine: "",
    luggageCapacity: "",
    entertainment: "",
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
        setFeatureBlocks(
          Array.isArray(car.featureBlocks) ? car.featureBlocks : []
        );
        const details = Array.isArray(specs.details) ? specs.details : [];
        setSpecDetails(
          details.filter(
            (d) => d && typeof d === "object" && d.label && d.value
          )
        );
        setFormData({
          name: car.name || "",
          description: car.description || "",
          capacity: String(car.capacity ?? ""),
          transmission: car.transmission || "Manual",
          fuelType: car.fuelType || "Bensin",
          startingPrice:
            car.startingPrice != null ? String(car.startingPrice) : "",
          available: !!car.available,
          licensePlate: specs.licensePlate || "",
          color: specs.color || "",
          engineCapacity: specs.engineCapacity
            ? String(specs.engineCapacity)
            : "",
          mileage: specs.mileage ? String(specs.mileage) : "",
          engine: "",
          luggageCapacity: "",
          entertainment: "",
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

  const addSpecDetail = () => {
    if (!specDraft.label.trim() || !specDraft.value.trim()) return;
    setSpecDetails((prev) => [
      ...prev,
      { label: specDraft.label.trim(), value: specDraft.value.trim() },
    ]);
    setSpecDraft({ label: "", value: "" });
  };
  const removeSpecDetail = (idx) => {
    setSpecDetails((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFeatureBlock = () => {
    if (!fbDraft.icon || !fbDraft.title || !fbDraft.description) return;
    setFeatureBlocks((prev) => [
      ...prev,
      {
        icon: fbDraft.icon,
        title: fbDraft.title,
        description: fbDraft.description,
        order: prev.length,
      },
    ]);
    setFbDraft({ icon: "", title: "", description: "" });
  };
  const removeFeatureBlock = (idx) => {
    setFeatureBlocks((prev) =>
      prev.filter((_, i) => i !== idx).map((f, i) => ({ ...f, order: i }))
    );
  };

  const baseFieldClasses =
    "bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60";

  const { push: toast } = useToast();

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
        details:
          specDetails && specDetails.length
            ? specDetails.map((d) => ({ label: d.label, value: d.value }))
            : undefined,
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
        specifications: nextSpecs,
        featureBlocks: featureBlocks,
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
      toast({
        title: "Disimpan",
        description: "Perubahan kendaraan berhasil.",
      });
      // Update original specs snapshot with what we sent
      originalSpecsRef.current = payload.specifications || {};
    } catch (e) {
      console.error(e);
      setError(e.message || "Terjadi kesalahan saat menyimpan data");
      toast({
        title: "Gagal Menyimpan",
        description: e.message,
        variant: "destructive",
      });
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
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.back()}
            >
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
                </div>
              </CardContent>
            </Card>

            {/* Spesifikasi Lengkap (fleksibel) */}
            <Card>
              <CardHeader>
                <CardTitle>Spesifikasi Lengkap</CardTitle>
                <CardDescription>
                  Tambah detail spesifikasi secara bebas (label & nilai)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Label (contoh: Mesin)"
                    value={specDraft.label}
                    onChange={(e) =>
                      setSpecDraft({ ...specDraft, label: e.target.value })
                    }
                    className={cn(baseFieldClasses)}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nilai (contoh: 2.4L Diesel / 2.0L Bensin)"
                      value={specDraft.value}
                      onChange={(e) =>
                        setSpecDraft({ ...specDraft, value: e.target.value })
                      }
                      className={cn(baseFieldClasses)}
                    />
                    <Button
                      type="button"
                      onClick={addSpecDetail}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {specDetails.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {specDetails.map((d, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Input
                          value={d.label}
                          onChange={(e) =>
                            setSpecDetails((prev) =>
                              prev.map((p, i) =>
                                i === idx ? { ...p, label: e.target.value } : p
                              )
                            )
                          }
                          className={cn(baseFieldClasses)}
                        />
                        <Input
                          value={d.value}
                          onChange={(e) =>
                            setSpecDetails((prev) =>
                              prev.map((p, i) =>
                                i === idx ? { ...p, value: e.target.value } : p
                              )
                            )
                          }
                          className={cn(baseFieldClasses)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeSpecDetail(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Structured Feature Blocks */}
            <Card>
              <CardHeader>
                <CardTitle>Fitur Unggulan</CardTitle>
                <CardDescription>
                  Kelola fitur (icon, judul, deskripsi). Jumlah fitur harus
                  genap.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">
                      Fitur Unggulan (Icon, Judul, Deskripsi)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Jumlah fitur harus genap.
                    </p>
                  </div>
                  <div className="text-sm">
                    <span
                      className={cn(
                        featureBlocks.length % 2 === 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      )}
                    >
                      {featureBlocks.length} item
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Pilih Icon</Label>
                    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 p-3 border rounded-md bg-gray-50">
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.name}
                            type="button"
                            onClick={() =>
                              setFbDraft({ ...fbDraft, icon: option.name })
                            }
                            className={cn(
                              "flex flex-col items-center justify-center p-2 rounded-md border-2 transition-colors hover:bg-white",
                              fbDraft.icon === option.name
                                ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                            title={option.label}
                          >
                            <IconComponent className="h-4 w-4 mb-1" />
                            <span className="text-xs truncate w-full text-center">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="featureTitle">Judul Fitur</Label>
                      <Input
                        id="featureTitle"
                        placeholder="Judul fitur"
                        value={fbDraft.title}
                        onChange={(e) =>
                          setFbDraft({ ...fbDraft, title: e.target.value })
                        }
                        className={cn(baseFieldClasses)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="featureDescription">Deskripsi</Label>
                      <Input
                        id="featureDescription"
                        placeholder="Deskripsi singkat"
                        value={fbDraft.description}
                        onChange={(e) =>
                          setFbDraft({
                            ...fbDraft,
                            description: e.target.value,
                          })
                        }
                        className={cn(baseFieldClasses)}
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {fbDraft.icon && fbDraft.title && (
                    <div className="p-3 border rounded-md bg-white">
                      <p className="text-sm text-muted-foreground mb-2">
                        Preview:
                      </p>
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          {(() => {
                            const selectedIcon = iconOptions.find(
                              (opt) => opt.name === fbDraft.icon
                            );
                            if (selectedIcon) {
                              const IconComponent = selectedIcon.icon;
                              return (
                                <IconComponent className="h-4 w-4 text-emerald-600" />
                              );
                            }
                            return (
                              <span className="text-emerald-600 text-sm font-semibold">
                                {fbDraft.icon.charAt(0).toUpperCase()}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground">
                            {fbDraft.title}
                          </h4>
                          {fbDraft.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {fbDraft.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Button
                    type="button"
                    onClick={addFeatureBlock}
                    disabled={
                      !fbDraft.icon || !fbDraft.title || !fbDraft.description
                    }
                  >
                    Tambah Fitur Unggulan
                  </Button>
                </div>

                {featureBlocks.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {featureBlocks.map((fb, idx) => {
                      const selectedIcon = iconOptions.find(
                        (opt) => opt.name === fb.icon
                      );
                      const IconComponent = selectedIcon?.icon;

                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-md border border-emerald-100 bg-white p-4"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 text-center font-mono text-xs text-muted-foreground">
                              #{idx + 1}
                            </span>
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              {IconComponent ? (
                                <IconComponent className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <span className="text-emerald-600 text-sm font-semibold">
                                  {fb.icon.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Judul
                                </Label>
                                <Input
                                  value={fb.title}
                                  onChange={(e) =>
                                    setFeatureBlocks((prev) =>
                                      prev.map((p, i) =>
                                        i === idx
                                          ? { ...p, title: e.target.value }
                                          : p
                                      )
                                    )
                                  }
                                  className={cn(baseFieldClasses, "mt-1")}
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Deskripsi
                                </Label>
                                <Input
                                  value={fb.description}
                                  onChange={(e) =>
                                    setFeatureBlocks((prev) =>
                                      prev.map((p, i) =>
                                        i === idx
                                          ? {
                                              ...p,
                                              description: e.target.value,
                                            }
                                          : p
                                      )
                                    )
                                  }
                                  className={cn(baseFieldClasses, "mt-1")}
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Icon
                              </Label>
                              <Select
                                value={fb.icon}
                                onValueChange={(value) =>
                                  setFeatureBlocks((prev) =>
                                    prev.map((p, i) =>
                                      i === idx ? { ...p, icon: value } : p
                                    )
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={cn(baseFieldClasses, "mt-1")}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {iconOptions.map((option) => {
                                    const OptionIcon = option.icon;
                                    return (
                                      <SelectItem
                                        key={option.name}
                                        value={option.name}
                                      >
                                        <div className="flex items-center gap-2">
                                          <OptionIcon className="h-4 w-4" />
                                          <span>{option.label}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => removeFeatureBlock(idx)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
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

            {/* Vehicle Details removed per request */}

            {/* Action Buttons */}
            {featureBlocks.length % 2 !== 0 && (
              <div className="text-sm text-red-600 text-right">
                Jumlah fitur unggulan harus genap agar dapat disimpan.
              </div>
            )}
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
                disabled={saving || featureBlocks.length % 2 !== 0}
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
