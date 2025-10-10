"use client";
import { AppSidebar } from "@/components/app-sidebar";
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
import { useState } from "react";

export default function AddCarPage() {
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
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
                Tambah Mobil Baru
              </h1>
              <p className="text-muted-foreground">
                Tambahkan kendaraan baru ke dalam armada rental
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </div>

          <form className="space-y-6">
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
                      placeholder="Contoh: Toyota Avanza"
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Kapasitas Penumpang *</Label>
                    <Select>
                      <SelectTrigger className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60">
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
                    placeholder="Deskripsi detail tentang mobil..."
                    className="min-h-[100px] border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmisi *</Label>
                    <Select>
                      <SelectTrigger className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60">
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
                    <Select>
                      <SelectTrigger className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60">
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
                    <Label htmlFor="year">Tahun Kendaraan</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2024"
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
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
                      placeholder="300000"
                      className="pl-8 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="available" />
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
                      placeholder="B 1234 ABC"
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Warna</Label>
                    <Input
                      id="color"
                      placeholder="Putih"
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
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
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Kilometer (KM)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="50000"
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline">
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <Save className="h-4 w-4" />
                Simpan Mobil
              </Button>
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
