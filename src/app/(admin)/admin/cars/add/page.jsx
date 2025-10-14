"use client";
import { AppSidebar } from "@/components/AppSidebar";
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
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [year, setYear] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");
  const [engineCapacity, setEngineCapacity] = useState("");
  const [mileage, setMileage] = useState("");
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");

  // Feature Cards (title + description + optional icon label)
  const [featureCards, setFeatureCards] = useState([]);
  const [newFeatureCard, setNewFeatureCard] = useState({
    icon: "",
    title: "",
    description: "",
  });

  // Images manager
  const [images, setImages] = useState([]); // Array<File>
  const [imagePreviews, setImagePreviews] = useState([]); // Array<objectURL>
  const [imageAlts, setImageAlts] = useState([]);
  const [coverIndex, setCoverIndex] = useState(null);

  // Tariff builder (categories with items)
  const [tariffCategories, setTariffCategories] = useState([]); // [{id, title, items:[{name, price, description, order}]}]
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newTariffItem, setNewTariffItem] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);

  // Lucide icon registry and options for Feature Unggulan icon
  const iconRegistry = {
    Star,
    Car,
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
  };
  const iconOptions = [
    { name: "Star", Icon: Star },
    { name: "Car", Icon: Car },
    { name: "Shield", Icon: Shield },
    { name: "Fuel", Icon: Fuel },
    { name: "Snowflake", Icon: Snowflake },
    { name: "Luggage", Icon: Luggage },
    { name: "Clock", Icon: Clock },
    { name: "Volume2", Icon: Volume2 },
    { name: "Wifi", Icon: Wifi },
    { name: "Zap", Icon: Zap },
    { name: "Compass", Icon: Compass },
    { name: "Cog", Icon: Cog },
    { name: "Users", Icon: Users },
    { name: "BadgeCheck", Icon: BadgeCheck },
    { name: "Gauge", Icon: Gauge },
    { name: "Wrench", Icon: Wrench },
    { name: "Sparkles", Icon: Sparkles },
    { name: "Armchair", Icon: Armchair },
  ];

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const addFeatureCard = () => {
    const { icon, title, description } = newFeatureCard;
    if (!title.trim() || !description.trim()) return;
    setFeatureCards([
      ...featureCards,
      {
        icon: icon.trim(),
        title: title.trim(),
        description: description.trim(),
      },
    ]);
    setNewFeatureCard({ icon: "", title: "", description: "" });
  };

  const removeFeatureCard = (idx) => {
    setFeatureCards(featureCards.filter((_, i) => i !== idx));
  };

  const onImagesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = [...images, ...files];
    setImages(next);
    setImageAlts((prev) => [...prev, ...files.map(() => "")]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
    if (coverIndex === null && next.length > 0) setCoverIndex(0);
  };

  const removeLocalImageAt = (idx) => {
    const nextImages = images.filter((_, i) => i !== idx);
    const nextPreviews = imagePreviews.filter((_, i) => i !== idx);
    const nextAlts = imageAlts.filter((_, i) => i !== idx);
    setImages(nextImages);
    setImagePreviews(nextPreviews);
    setImageAlts(nextAlts);
    if (coverIndex === idx) setCoverIndex(nextImages.length ? 0 : null);
    if (coverIndex > idx) setCoverIndex((c) => (c !== null ? c - 1 : c));
  };

  const moveImage = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const swap = (arr) => {
      const copy = [...arr];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    };
    setImages((arr) => swap(arr));
    setImagePreviews((arr) => swap(arr));
    setImageAlts((arr) => swap(arr));
    if (coverIndex === idx) setCoverIndex(target);
    else if (coverIndex === target) setCoverIndex(idx);
  };

  const addCategory = () => {
    if (!newCategoryTitle.trim()) return;
    setTariffCategories([
      ...tariffCategories,
      { id: Date.now().toString(), title: newCategoryTitle.trim(), items: [] },
    ]);
    setNewCategoryTitle("");
    setActiveCategoryIndex(tariffCategories.length);
  };

  const removeCategoryAt = (idx) => {
    setTariffCategories(tariffCategories.filter((_, i) => i !== idx));
    if (activeCategoryIndex === idx) setActiveCategoryIndex(null);
  };

  const addTariffItemToActive = () => {
    if (activeCategoryIndex === null) return;
    const { name, price, description } = newTariffItem;
    if (!name.trim() || !price) return;
    const list = [...tariffCategories];
    const items = list[activeCategoryIndex].items;
    items.push({
      name: name.trim(),
      price: parseInt(price, 10),
      description: description.trim(),
      order: items.length,
    });
    setTariffCategories(list);
    setNewTariffItem({ name: "", price: "", description: "" });
  };

  const removeTariffItem = (catIdx, itemIdx) => {
    const list = [...tariffCategories];
    list[catIdx].items = list[catIdx].items.filter((_, i) => i !== itemIdx);
    setTariffCategories(list);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    // Basic validations
    if (!name.trim()) {
      setError("Nama mobil wajib diisi.");
      return;
    }
    const priceNum = parseInt(startingPrice, 10);
    if (!priceNum || priceNum <= 0) {
      setError("Harga mulai harus lebih dari 0.");
      return;
    }
    const capacityNum = capacity ? parseInt(capacity, 10) : undefined;

    const specifications = {};
    if (year) specifications.year = parseInt(year, 10) || year;
    if (licensePlate) specifications.licensePlate = licensePlate.trim();
    if (color) specifications.color = color.trim();
    if (engineCapacity)
      specifications.engineCapacity =
        parseInt(engineCapacity, 10) || engineCapacity;
    if (mileage) specifications.mileage = parseInt(mileage, 10) || mileage;
    if (featureCards && featureCards.length)
      specifications.featureCards = featureCards;

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      startingPrice: priceNum,
      capacity: capacityNum,
      transmission: transmission || undefined,
      fuelType: fuelType || undefined,
      available,
      features,
      specifications: Object.keys(specifications).length
        ? specifications
        : null,
    };

    try {
      setLoading(true);
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

      const carId = data.data.id;

      // 1) Upload images if any
      if (images.length) {
        try {
          const form = new FormData();
          form.append("carId", carId);
          // Add cover file if selected
          if (coverIndex !== null && images[coverIndex]) {
            form.append("cover", images[coverIndex]);
          }
          // Add images & alt texts
          images.forEach((file, i) => {
            form.append("images", file);
            const alt = imageAlts[i] || "";
            form.append(`alt_${i}`, alt);
          });

          const upRes = await fetch("/api/cars/images/upload", {
            method: "POST",
            body: form,
            credentials: "include",
          });
          // Try reorder to match current UI order
          const upJson = await upRes.json().catch(() => null);
          if (upRes.ok && upJson?.data?.newImages?.length) {
            const created = upJson.data.newImages; // [{id, ...}] in same order as appended
            const orders = created.map((img, idx) => ({
              id: img.id,
              order: idx,
            }));
            await fetch("/api/cars/images/reorder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ carId, orders }),
            });
          }
          // If non-200, ignore to avoid blocking creation; user can manage images later
        } catch (e) {
          // Silent fail for images
          console.warn("Failed to upload images:", e);
        }
      }

      // 2) Create tariffs (TariffCategory + TariffItem per-car) if any
      try {
        if (tariffCategories.length) {
          // Load existing categories once
          const catRes = await fetch("/api/tariffs/categories", {
            method: "GET",
            credentials: "include",
          });
          const catJson = await catRes.json().catch(() => ({ data: [] }));
          const existing = Array.isArray(catJson?.data) ? catJson.data : [];
          const byName = new Map(
            existing.map((c) => [c.name?.trim()?.toLowerCase(), c])
          );

          // Ensure all categories exist (create missing)
          for (const cat of tariffCategories) {
            const key = (cat.title || "").trim().toLowerCase();
            if (!key) continue;
            if (!byName.has(key)) {
              const createRes = await fetch("/api/tariffs/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  name: cat.title,
                  description: "",
                  order: 0,
                }),
              });
              const createJson = await createRes.json().catch(() => ({}));
              if (createRes.ok && createJson?.data) {
                byName.set(key, createJson.data);
              }
            }
          }

          // Create items under their categories for this car
          const requests = [];
          for (const cat of tariffCategories) {
            const key = (cat.title || "").trim().toLowerCase();
            const catObj = byName.get(key);
            if (!catObj?.id) continue;
            (cat.items || []).forEach((it, idx) => {
              const body = {
                categoryId: catObj.id,
                carId,
                name: it.name,
                price: Number(it.price) || 0,
                serviceType: null,
                packageType: null,
                description: it.description || null,
                order: typeof it.order === "number" ? it.order : idx,
              };
              requests.push(
                fetch("/api/tariffs/items", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify(body),
                })
              );
            });
          }
          if (requests.length) await Promise.allSettled(requests);
        }
      } catch (e) {
        console.warn("Failed to create tariffs:", e);
      }

      router.replace("/admin/cars");
    } catch (err) {
      setError("Kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

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
                <CardTitle>Informasi Dasar Jenis Armada</CardTitle>
                <CardDescription>
                  Informasi umum tentang jenis armada (model/tipe)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Jenis Armada *</Label>
                    <Input
                      id="name"
                      placeholder="Contoh: MPV - Toyota Avanza"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Kapasitas Penumpang *</Label>
                    <Select value={capacity} onValueChange={setCapacity}>
                      <SelectTrigger
                        className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                        disabled={loading}
                      >
                        <SelectValue placeholder="Pilih kapasitas" />
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
                    placeholder="Deskripsi detail tentang jenis armada..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmisi *</Label>
                    <Select
                      value={transmission}
                      onValueChange={setTransmission}
                    >
                      <SelectTrigger
                        className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                        disabled={loading}
                      >
                        <SelectValue placeholder="Pilih transmisi" />
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
                    <Select value={fuelType} onValueChange={setFuelType}>
                      <SelectTrigger
                        className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                        disabled={loading}
                      >
                        <SelectValue placeholder="Pilih bahan bakar" />
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
                    <Label htmlFor="year">Tahun Rilis (opsional)</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2024"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Fitur & Fasilitas (Tags)</CardTitle>
                <CardDescription>
                  Tambahkan fitur yang tersedia pada kendaraan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Tambah fitur (AC, Audio, etc.)"
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    onClick={addFeature}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading}
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

            {/* Feature Cards (Detailed) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-emerald-600" />
                  Fitur Unggulan
                </CardTitle>
                <CardDescription>
                  Judul + deskripsi dan ikon opsional seperti pada screenshot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fc-icon">Ikon (lucide-react)</Label>
                    <Input
                      id="fc-icon"
                      value={newFeatureCard.icon}
                      onChange={(e) =>
                        setNewFeatureCard({
                          ...newFeatureCard,
                          icon: e.target.value,
                        })
                      }
                      placeholder="mis. Shield"
                      disabled={loading}
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    />
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-2">
                        Pilih ikon cepat:
                      </div>
                      <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
                        {iconOptions.map(({ name, Icon }) => (
                          <button
                            key={name}
                            type="button"
                            className={`h-8 w-8 rounded-md border flex items-center justify-center hover:bg-muted ${
                              newFeatureCard.icon === name
                                ? "border-emerald-500 ring-2 ring-emerald-500/50"
                                : "border-input"
                            }`}
                            onClick={() =>
                              setNewFeatureCard({
                                ...newFeatureCard,
                                icon: name,
                              })
                            }
                            disabled={loading}
                            aria-label={`Pilih ikon ${name}`}
                            title={name}
                          >
                            <Icon className="h-4 w-4" />
                          </button>
                        ))}
                        <button
                          type="button"
                          className="col-span-2 h-8 px-2 rounded-md border text-xs hover:bg-muted"
                          onClick={() =>
                            setNewFeatureCard({ ...newFeatureCard, icon: "" })
                          }
                          disabled={loading}
                        >
                          Bersihkan
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fc-title">Judul</Label>
                    <Input
                      id="fc-title"
                      value={newFeatureCard.title}
                      onChange={(e) =>
                        setNewFeatureCard({
                          ...newFeatureCard,
                          title: e.target.value,
                        })
                      }
                      placeholder="Kabin Super Luas"
                      disabled={loading}
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fc-desc">Deskripsi</Label>
                    <Input
                      id="fc-desc"
                      value={newFeatureCard.description}
                      onChange={(e) =>
                        setNewFeatureCard({
                          ...newFeatureCard,
                          description: e.target.value,
                        })
                      }
                      placeholder="Kapasitas hingga 7 penumpang..."
                      disabled={loading}
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    />
                  </div>
                </div>
                <div>
                  <Button
                    type="button"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={addFeatureCard}
                    disabled={
                      loading ||
                      !newFeatureCard.title ||
                      !newFeatureCard.description
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" /> Tambah Fitur Unggulan
                  </Button>
                </div>
                {featureCards.length > 0 && (
                  <div className="grid gap-3 md:grid-cols-3">
                    {featureCards.map((fc, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border p-4 bg-white shadow-sm"
                      >
                        <div className="flex items-start gap-2">
                          <div className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            {(() => {
                              const Ico = iconRegistry[fc.icon];
                              return Ico ? (
                                <Ico className="h-4 w-4" />
                              ) : (
                                <Star className="h-4 w-4" />
                              );
                            })()}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{fc.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {fc.description}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFeatureCard(idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Harga & Ketersediaan Jenis</CardTitle>
                <CardDescription>
                  Atur harga mulai untuk jenis ini dan status ketersediaan
                  disewakan
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
                      placeholder="300000"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      className="pl-8 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={available}
                    onCheckedChange={setAvailable}
                    disabled={loading}
                  />
                  <Label htmlFor="available">Tersedia untuk disewa</Label>
                </div>
              </CardContent>
            </Card>

            {/* Images Manager */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-emerald-600" />
                  Gambar Kendaraan
                </CardTitle>
                <CardDescription>
                  Upload beberapa gambar dan pilih salah satu sebagai cover
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImagesSelected}
                    disabled={loading}
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                  />
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((file, idx) => (
                      <div key={idx} className="rounded-xl border p-2">
                        <img
                          src={imagePreviews[idx]}
                          alt="preview"
                          className="w-full h-28 object-cover rounded-md"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="radio"
                              name="cover"
                              checked={coverIndex === idx}
                              onChange={() => setCoverIndex(idx)}
                              disabled={loading}
                            />
                            Cover
                          </label>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => moveImage(idx, -1)}
                              title="Up"
                              className="p-1 rounded hover:bg-muted"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(idx, 1)}
                              title="Down"
                              className="p-1 rounded hover:bg-muted"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeLocalImageAt(idx)}
                              title="Hapus"
                              className="p-1 text-red-600 rounded hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <Input
                          className="mt-2 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                          placeholder="Alt text"
                          value={imageAlts[idx] || ""}
                          onChange={(e) => {
                            const next = [...imageAlts];
                            next[idx] = e.target.value;
                            setImageAlts(next);
                          }}
                          disabled={loading}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Flexible Tariffs Builder (Categories) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Tarif Sewa Fleksibel
                </CardTitle>
                <CardDescription>
                  Buat kategori seperti “Sewa Per 12 Jam”, “Antar Jemput
                  Bandara”, lalu tambah item dengan harga.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nama kategori (contoh: Sewa Per 12 Jam)"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    disabled={loading}
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                  />
                  <Button
                    type="button"
                    onClick={addCategory}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading || !newCategoryTitle.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {tariffCategories.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {tariffCategories.map((cat, idx) => (
                        <button
                          key={cat.id}
                          type="button"
                          className={`px-3 py-1 rounded-full border ${
                            activeCategoryIndex === idx
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-white hover:bg-muted"
                          }`}
                          onClick={() => setActiveCategoryIndex(idx)}
                        >
                          {cat.title}
                        </button>
                      ))}
                    </div>

                    {activeCategoryIndex !== null && (
                      <div className="rounded-xl border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">
                            {tariffCategories[activeCategoryIndex].title}
                          </div>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                            onClick={() =>
                              removeCategoryAt(activeCategoryIndex)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus Kategori
                          </button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          <Input
                            placeholder="Nama item (contoh: Dengan Driver)"
                            value={newTariffItem.name}
                            onChange={(e) =>
                              setNewTariffItem({
                                ...newTariffItem,
                                name: e.target.value,
                              })
                            }
                            disabled={loading}
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                          />
                          <Input
                            type="number"
                            placeholder="Harga (contoh: 650000)"
                            value={newTariffItem.price}
                            onChange={(e) =>
                              setNewTariffItem({
                                ...newTariffItem,
                                price: e.target.value,
                              })
                            }
                            disabled={loading}
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                          />
                          <Input
                            placeholder="Deskripsi (opsional)"
                            value={newTariffItem.description}
                            onChange={(e) =>
                              setNewTariffItem({
                                ...newTariffItem,
                                description: e.target.value,
                              })
                            }
                            disabled={loading}
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={addTariffItemToActive}
                            disabled={
                              loading ||
                              !newTariffItem.name ||
                              !newTariffItem.price
                            }
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Tambah Item
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {tariffCategories[activeCategoryIndex].items
                            .length === 0 && (
                            <div className="text-sm text-muted-foreground">
                              Belum ada item. Tambahkan di atas.
                            </div>
                          )}
                          {tariffCategories[activeCategoryIndex].items.map(
                            (it, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between rounded-md border p-2"
                              >
                                <div>
                                  <div className="font-medium">{it.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Rp{" "}
                                    {Number(it.price).toLocaleString("id-ID")}{" "}
                                    {it.description
                                      ? `• ${it.description}`
                                      : ""}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeTariffItem(activeCategoryIndex, i)
                                    }
                                    className="text-red-600 hover:text-red-700 p-1 rounded"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vehicle Details (opsional untuk jenis, tanpa nomor polisi/km) */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Spesifikasi (Opsional)</CardTitle>
                <CardDescription>
                  Informasi teknis umum untuk jenis ini
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Warna</Label>
                    <Input
                      id="color"
                      placeholder="Putih"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineCapacity">Kapasitas Mesin (CC)</Label>
                    <Input
                      id="engineCapacity"
                      type="number"
                      placeholder="1500"
                      value={engineCapacity}
                      onChange={(e) => setEngineCapacity(e.target.value)}
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                      disabled={loading}
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
                onClick={() => router.push("/admin/cars")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                disabled={loading}
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
