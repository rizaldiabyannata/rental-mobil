"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Car,
  Save,
  ArrowLeft,
  Plus,
  X,
  ImageIcon,
  UploadCloud,
  Star,
  Trash2,
  ChevronUp,
  ChevronDown,
  CreditCard,
  Shield,
  Fuel,
  Snowflake,
  Luggage,
  Clock,
  Volume2,
  Wifi,
  Zap,
  Compass,
  Cog,
  Users,
  BadgeCheck,
  Gauge,
  Wrench,
  Sparkles,
  Armchair,
  Music,
  Camera,
  Navigation,
  Battery,
  Bluetooth,
  Smartphone,
  Wind,
  Sun,
  Lock,
  MapPin,
  Radio,
  Thermometer,
  Settings,
  Award,
  CheckCircle,
  Heart,
  Coffee,
  Briefcase,
} from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export default function AddCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
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
  // Flexible Specification Details: array of { label, value }
  const [specDetails, setSpecDetails] = useState([]);
  const [specDraft, setSpecDraft] = useState({ label: "", value: "" });
  // Structured feature blocks: { icon, title, description, order }
  const [featureBlocks, setFeatureBlocks] = useState([]);
  const [fbDraft, setFbDraft] = useState({
    icon: "",
    title: "",
    description: "",
  });
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
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name") {
        const base = String(value || "")
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        next.slug = base;
      }
      return next;
    });
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

  // Note: Image upload and Tariff builder removed to align with Edit page

  const { push: toast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (!formData.name.trim()) {
      setError("Nama mobil wajib diisi.");
      setLoading(false);
      return;
    }
    if (!formData.startingPrice || parseInt(formData.startingPrice, 10) <= 0) {
      setError("Harga mulai harus lebih dari 0.");
      setLoading(false);
      return;
    }
    if (featureBlocks.length % 2 !== 0) {
      setError("Jumlah fitur unggulan harus genap.");
      setLoading(false);
      return;
    }
    try {
      // Build specifications object and move featureBlocks into featureCards
      const specifications = {};
      if (specDetails.length) specifications.details = specDetails;
      if (featureBlocks.length) specifications.featureCards = featureBlocks;

      const payload = {
        ...formData,
        capacity: formData.capacity
          ? parseInt(formData.capacity, 10)
          : undefined,
        startingPrice: parseInt(formData.startingPrice, 10),
        specifications: Object.keys(specifications).length
          ? specifications
          : null,
        // Intentionally omit `features` because API expects array of strings.
      };
      // Ensure we don't send `features` key at all
      delete payload.features;
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.data?.id) {
        setError(data?.error || "Gagal menyimpan mobil. Coba lagi.");
        setLoading(false);
        return;
      }
      setSuccess("Mobil berhasil ditambahkan.");
      toast({ title: "Berhasil", description: "Mobil berhasil ditambahkan." });
      router.replace("/admin/cars");
    } catch (err) {
      setError("Kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
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
                    Manajemen Jenis Armada
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tambah Mobil</BreadcrumbPage>
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
                Tambah Jenis Armada
              </h1>
              <p className="text-muted-foreground">
                Tambahkan jenis armada yang tersedia (bukan unit per kendaraan)
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              type="button"
              onClick={() => router.push("/admin/cars")}
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {error}
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
                      className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60"
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
                      <SelectTrigger className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60 h-11">
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

                {/* Slug field for SEO-friendly URL */}
                <div className="space-y-1">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="otomatis dari nama, bisa disesuaikan"
                    className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60"
                  />
                  {formData.slug && (
                    <p className="text-xs text-muted-foreground">
                      URL: /armada/{formData.slug}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60 min-h-[120px]"
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
                      <SelectTrigger className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60 h-11">
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
                      <SelectTrigger className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60 h-11">
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
                    className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60"
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nilai (contoh: 2.4L Diesel / 2.0L Bensin)"
                      value={specDraft.value}
                      onChange={(e) =>
                        setSpecDraft({ ...specDraft, value: e.target.value })
                      }
                      className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60"
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
                          className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60"
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
                          className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60"
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
                      className={
                        featureBlocks.length % 2 === 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }
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
                            className={
                              fbDraft.icon === option.name
                                ? "flex flex-col items-center justify-center p-2 rounded-md border-2 transition-colors hover:bg-white border-emerald-500 bg-emerald-50 text-emerald-600"
                                : "flex flex-col items-center justify-center p-2 rounded-md border-2 transition-colors hover:bg-white border-gray-200 hover:border-gray-300"
                            }
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
                        className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60"
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
                        className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60"
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
                                <IconComponent className="h-5 w-5 text-emerald-600" />
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
                          className="flex items-center gap-3 p-3 border rounded-md bg-white"
                        >
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            {IconComponent ? (
                              <IconComponent className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <span className="text-emerald-600 text-sm font-semibold">
                                {fb.icon.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-foreground">
                              {fb.title}
                            </h4>
                            {fb.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {fb.description}
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
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

            {/* Feature Cards (Detailed) removed to match Edit page */}

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
                      className="bg-white border border-emerald-100 shadow-sm hover:border-emerald-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-200/60 pl-8"
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

            {featureBlocks.length % 2 !== 0 && (
              <div className="text-sm text-red-600 text-right">
                Jumlah fitur unggulan harus genap agar dapat disimpan.
              </div>
            )}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/cars")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                disabled={loading || featureBlocks.length % 2 !== 0}
              >
                <Save className="h-4 w-4" />
                {loading ? "Menyimpan..." : "Simpan Mobil"}
              </Button>
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
