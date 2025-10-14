"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatIDR } from "@/lib/utils";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import {
  Select as CarSelect,
  SelectContent as CarSelectContent,
  SelectItem as CarSelectItem,
  SelectTrigger as CarSelectTrigger,
  SelectValue as CarSelectValue,
} from "@/components/ui/select";

export default function EditTariffCategoryPage() {
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState({
    id: id,
    name: "",
    description: "",
    order: 0,
  });
  const [items, setItems] = useState([]);
  const [savingCat, setSavingCat] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState("-");
  // New item helpers
  const [newItemCarId, setNewItemCarId] = useState("-");
  const [newItemServiceType, setNewItemServiceType] = useState("");
  const [newItemPackageType, setNewItemPackageType] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [catRes, itemsRes] = await Promise.all([
        fetch(`/api/tariffs/categories/${id}`),
        fetch(`/api/tariffs/items?categoryId=${id}`),
      ]);
      const catData = await catRes.json();
      const itemsData = await itemsRes.json();
      if (!catRes.ok)
        throw new Error(catData.error || "Gagal mengambil kategori");
      if (!itemsRes.ok)
        throw new Error(itemsData.error || "Gagal mengambil item");
      setCategory(catData.data);
      setItems(itemsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAll();
  }, [id]);

  // Load cars for quick jump to per-armada tariffs
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/cars?page=1&limit=50`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setCars(Array.isArray(json.data) ? json.data : []);
      } catch (_) {
        // ignore
      }
    })();
    return () => controller.abort();
  }, []);

  const saveCategory = async () => {
    setSavingCat(true);
    setError("");
    try {
      const res = await fetch(`/api/tariffs/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          order: category.order,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan kategori");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingCat(false);
    }
  };

  const addItem = async () => {
    setAddingItem(true);
    setError("");
    try {
      const res = await fetch(`/api/tariffs/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: id,
          name: "Item Baru",
          price: 0,
          carId: newItemCarId && newItemCarId !== "-" ? newItemCarId : null,
          serviceType: newItemServiceType || null,
          packageType: newItemPackageType || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah item");
      setItems((prev) => [...prev, data.data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingItem(false);
    }
  };

  const saveItem = async (item) => {
    const res = await fetch(`/api/tariffs/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal menyimpan item");
  };

  const deleteItem = async (item) => {
    if (!confirm(`Hapus item "${item.name}"?`)) return;
    const res = await fetch(`/api/tariffs/items/${item.id}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Gagal menghapus item");
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  if (!id) return <div>Invalid ID</div>;

  return (
    <>
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
                <BreadcrumbLink href="/admin/tariffs">Tarif</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Kategori</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Edit Kategori</h1>
            <p className="text-muted-foreground">
              {category.name || "Memuat..."}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <CarSelect value={selectedCarId} onValueChange={setSelectedCarId}>
              <CarSelectTrigger className="w-[260px] border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60">
                <CarSelectValue placeholder="Pilih armada untuk override" />
              </CarSelectTrigger>
              <CarSelectContent>
                <CarSelectItem value="-">Pilih Armada…</CarSelectItem>
                {cars.map((car) => (
                  <CarSelectItem key={car.id} value={car.id}>
                    {car.name}
                  </CarSelectItem>
                ))}
              </CarSelectContent>
            </CarSelect>
            <Button variant="outline" asChild>
              <Link href="/admin/tariffs">Kembali</Link>
            </Button>
            <Button
              onClick={saveCategory}
              disabled={savingCat}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {savingCat ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                </span>
              ) : (
                "Simpan Kategori"
              )}
            </Button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}

        <Card>
          <CardHeader>
            <CardTitle>Informasi Kategori</CardTitle>
            <CardDescription>Atur nama, deskripsi, dan urutan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">Memuat...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Nama</label>
                  <Input
                    value={category.name}
                    onChange={(e) =>
                      setCategory({ ...category, name: e.target.value })
                    }
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Urutan</label>
                  <Input
                    type="number"
                    value={category.order ?? 0}
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        order: parseInt(e.target.value || 0),
                      })
                    }
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm font-medium">Deskripsi</label>
                  <Textarea
                    value={category.description || ""}
                    onChange={(e) =>
                      setCategory({ ...category, description: e.target.value })
                    }
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <CardTitle>Item Tarif</CardTitle>
                <CardDescription>Kelola item dan harga</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={newItemServiceType}
                  onChange={(e) => setNewItemServiceType(e.target.value)}
                  placeholder="Service Type (opsional)"
                  className="w-[220px] border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                />
                <Input
                  value={newItemPackageType}
                  onChange={(e) => setNewItemPackageType(e.target.value)}
                  placeholder="Package Type (opsional)"
                  className="w-[220px] border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                />
                <div className="hidden sm:block text-sm text-muted-foreground">
                  Armada untuk item baru:
                </div>
                <Select value={newItemCarId} onValueChange={setNewItemCarId}>
                  <SelectTrigger className="w-[220px] border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500">
                    <SelectValue placeholder="Pilih armada (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">General (tanpa armada)</SelectItem>
                    {cars.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addItem} disabled={addingItem}>
                  {addingItem ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Menambah...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Tambah Item
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Belum ada item.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead className="w-[220px]">Service Type</TableHead>
                      <TableHead className="w-[220px]">Package Type</TableHead>
                      <TableHead className="w-[220px]">Armada</TableHead>
                      <TableHead className="w-[180px]">Harga (Rp)</TableHead>
                      <TableHead className="text-right w-[140px]">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it) => (
                      <TableRow key={it.id}>
                        <TableCell className="align-top">
                          <Input
                            value={it.name}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === it.id
                                    ? { ...p, name: e.target.value }
                                    : p
                                )
                              )
                            }
                            placeholder="Nama item"
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Input
                            value={it.serviceType || ""}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === it.id
                                    ? { ...p, serviceType: e.target.value }
                                    : p
                                )
                              )
                            }
                            placeholder="Service Type"
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Input
                            value={it.packageType || ""}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === it.id
                                    ? { ...p, packageType: e.target.value }
                                    : p
                                )
                              )
                            }
                            placeholder="Package Type"
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <Select
                            value={it.carId || "-"}
                            onValueChange={(val) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === it.id
                                    ? { ...p, carId: val === "-" ? null : val }
                                    : p
                                )
                              )
                            }
                          >
                            <SelectTrigger className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="-">
                                General (tanpa armada)
                              </SelectItem>
                              {cars.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="align-top">
                          <Input
                            type="number"
                            value={it.price}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === it.id
                                    ? {
                                        ...p,
                                        price: parseInt(e.target.value || 0),
                                      }
                                    : p
                                )
                              )
                            }
                            placeholder="0"
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatIDR(it.price || 0)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                saveItem({
                                  ...it,
                                  carId: it.carId ?? null,
                                  serviceType: it.serviceType || null,
                                  packageType: it.packageType || null,
                                })
                              }
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Simpan
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-white hover:bg-red-700"
                              onClick={() => {
                                setDeleteTarget(it);
                                setIsDeleteOpen(true);
                              }}
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
            )}
          </CardContent>
        </Card>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Item</DialogTitle>
              <DialogDescription>
                Tindakan ini akan menghapus item
                {deleteTarget ? ` "${deleteTarget.name}"` : ""}. Tidak dapat
                dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                onClick={async () => {
                  if (!deleteTarget) return;
                  try {
                    setIsDeleting(true);
                    await deleteItem(deleteTarget);
                    setIsDeleteOpen(false);
                    setDeleteTarget(null);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
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
