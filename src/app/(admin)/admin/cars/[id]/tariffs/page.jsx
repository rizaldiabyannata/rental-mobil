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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  Calendar,
  DollarSign,
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
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { formatIDR } from "@/lib/utils";

export default function CarTariffsPage() {
  const params = useParams();
  const carId = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [car, setCar] = useState(null);
  const [generalCategories, setGeneralCategories] = useState([]); // TariffCategory + items (general)
  const [effectiveCategories, setEffectiveCategories] = useState([]); // TariffCategory + items (per-car when overridden else general)

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [carRes, generalRes, effectiveRes] = await Promise.all([
        fetch(`/api/cars/${carId}`),
        fetch(`/api/tariffs`),
        fetch(`/api/tariffs?carId=${carId}`),
      ]);
      const carData = await carRes.json();
      const genData = await generalRes.json();
      const effData = await effectiveRes.json();
      if (!carRes.ok)
        throw new Error(carData.error || "Gagal mengambil data mobil");
      if (!generalRes.ok)
        throw new Error(genData.error || "Gagal mengambil tarif umum");
      if (!effectiveRes.ok)
        throw new Error(effData.error || "Gagal mengambil tarif armada");
      setCar(carData.data);
      setGeneralCategories(genData.data || []);
      setEffectiveCategories(effData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (carId) fetchAll();
  }, [carId]);

  // Map effective categories by id for quick lookup
  const effectiveById = useMemo(() => {
    const m = new Map();
    (effectiveCategories || []).forEach((c) => m.set(c.id, c));
    return m;
  }, [effectiveCategories]);

  const isOverridden = (category) => {
    const eff = effectiveById.get(category.id);
    if (!eff) return false;
    const items = eff.items || [];
    return items.some((it) => it.carId === carId);
  };

  const createTariffItem = async (payload) => {
    const res = await fetch(`/api/tariffs/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal membuat item tarif");
    await fetchAll();
    return data.data;
  };

  const updateTariffItem = async (id, payload) => {
    const res = await fetch(`/api/tariffs/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal memperbarui item");
    await fetchAll();
    return data.data;
  };

  const deleteTariffItem = async (id) => {
    const res = await fetch(`/api/tariffs/items/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Gagal menghapus item");
    await fetchAll();
  };

  const overrideFromGeneral = async (category) => {
    const items = category.items || [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      await createTariffItem({
        categoryId: category.id,
        carId,
        name: it.name,
        price: it.price,
        serviceType: it.serviceType || null,
        packageType: it.packageType || null,
        order: it.order ?? i,
      });
    }
  };

  const removeOverrideCategory = async (category) => {
    const eff = effectiveById.get(category.id);
    const rows = (eff?.items || []).filter((it) => it.carId === carId);
    for (const r of rows) {
      await deleteTariffItem(r.id);
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
                  <BreadcrumbLink href={`/admin/cars/${carId}`}>
                    {car?.name || "..."}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tarif Sewa</BreadcrumbPage>
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
                <CreditCard className="h-8 w-8 text-emerald-600" />
                Tarif Sewa - {car?.name || "..."}
              </h1>
              <p className="text-muted-foreground">
                Kelola tarif per kategori, aktifkan override per-armada atau
                fallback ke tarif umum
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
            </div>
          </div>
          {loading ? (
            <div>Memuat...</div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            <div className="space-y-6">
              {generalCategories.map((cat) => {
                const overridden = isOverridden(cat);
                const eff = effectiveById.get(cat.id);
                const rows = overridden
                  ? (eff?.items || []).filter((it) => it.carId === carId)
                  : (cat.items || []).filter((it) => it.carId == null);
                return (
                  <Card key={cat.id}>
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <CardTitle>{cat.name}</CardTitle>
                        <CardDescription>
                          {overridden ? (
                            <span className="text-emerald-700">
                              Override aktif untuk armada ini
                            </span>
                          ) : (
                            <span className="text-neutral-600">
                              Menggunakan tarif umum (fallback)
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {!overridden ? (
                          <Button
                            onClick={() => overrideFromGeneral(cat)}
                            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                          >
                            <Plus className="h-4 w-4" /> Override kategori ini
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => removeOverrideCategory(cat)}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" /> Hapus override
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {rows && rows.length ? (
                          rows.map((row, idx) => (
                            <div
                              key={row.id || idx}
                              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center"
                            >
                              <div className="md:col-span-6">
                                <Label className="text-xs text-neutral-600">
                                  Nama
                                </Label>
                                <Input
                                  value={row.name}
                                  disabled={!overridden}
                                  onChange={(e) =>
                                    updateTariffItem(row.id, {
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="md:col-span-3">
                                <Label className="text-xs text-neutral-600">
                                  Harga
                                </Label>
                                <Input
                                  type="number"
                                  value={row.price}
                                  disabled={!overridden}
                                  onChange={(e) =>
                                    updateTariffItem(row.id, {
                                      price: parseInt(e.target.value || 0),
                                    })
                                  }
                                />
                                <div className="text-xs text-neutral-500 mt-1">
                                  {formatIDR(row.price || 0)}
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-xs text-neutral-600">
                                  Urutan
                                </Label>
                                <Input
                                  type="number"
                                  value={row.order ?? 0}
                                  disabled={!overridden}
                                  onChange={(e) =>
                                    updateTariffItem(row.id, {
                                      order: parseInt(e.target.value || 0),
                                    })
                                  }
                                />
                              </div>
                              <div className="md:col-span-1 flex justify-end gap-2">
                                {overridden ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() =>
                                        updateTariffItem(row.id, {})
                                      }
                                    >
                                      Simpan
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => deleteTariffItem(row.id)}
                                    >
                                      Hapus
                                    </Button>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-neutral-600">
                            Belum ada item.
                          </div>
                        )}
                        {overridden ? (
                          <div className="pt-2">
                            <Button
                              variant="outline"
                              className="gap-2"
                              onClick={() =>
                                createTariffItem({
                                  categoryId: cat.id,
                                  carId,
                                  name: "Item Baru",
                                  price: 0,
                                  order:
                                    (eff?.items || []).filter(
                                      (it) => it.carId === carId
                                    ).length || 0,
                                })
                              }
                            >
                              <Plus className="h-4 w-4" /> Tambah Item
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
