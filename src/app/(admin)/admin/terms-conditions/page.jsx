"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, RefreshCcw, GripVertical, Trash2 } from "lucide-react";

export default function AdminTermsPage() {
  const [items, setItems] = useState([]);
  const [localItems, setLocalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [reorderMode, setReorderMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (status) params.set("isActive", status);
      params.set("limit", "50");
      const res = await fetch(`/api/terms-conditions?${params.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal memuat data");
      const list = Array.isArray(json.data) ? json.data : [];
      setItems(list);
      setLocalItems(list);
    } catch (e) {
      setError(e.message || "Tidak dapat memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e) => {
    if (!reorderMode) return;
    e.preventDefault();
  };
  const onDrop = (e, overId) => {
    if (!reorderMode) return;
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === overId) return;
    const fromIdx = localItems.findIndex((x) => x.id === draggedId);
    const toIdx = localItems.findIndex((x) => x.id === overId);
    if (fromIdx === -1 || toIdx === -1) return;
    const next = [...localItems];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setLocalItems(next);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      const updates = localItems.map((it, idx) => ({ id: it.id, order: idx }));
      await Promise.all(
        updates.map((u) =>
          fetch(`/api/terms-conditions/${u.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: u.order }),
          })
        )
      );
      setItems(localItems);
      setReorderMode(false);
    } catch (e) {
      alert(e.message || "Gagal menyimpan urutan");
    } finally {
      setSavingOrder(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/terms-conditions/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Gagal menghapus poin");
      setItems((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      setLocalItems((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      alert(e.message || "Tidak dapat menghapus");
    }
  };

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
                <BreadcrumbPage>Syarat & Ketentuan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Syarat & Ketentuan
            </h1>
            <p className="text-muted-foreground">
              Kelola poin syarat dan ketentuan layanan
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button
              variant={reorderMode ? "secondary" : "outline"}
              onClick={() => setReorderMode((v) => !v)}
            >
              <GripVertical className="h-4 w-4" />{" "}
              {reorderMode ? "Selesai" : "Urutkan"}
            </Button>
            {reorderMode && (
              <Button
                onClick={saveOrder}
                disabled={savingOrder}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {savingOrder ? "Menyimpan..." : "Simpan Urutan"}
              </Button>
            )}
            <Link href="/admin/terms-conditions/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" /> Tambah Poin
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Poin</CardTitle>
            <CardDescription>
              Filter, cari, dan kelola poin syarat & ketentuan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                placeholder="Cari judul/konten..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
              />
              <Input
                placeholder="Kategori (opsional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
              />
              <div className="flex gap-2">
                <select
                  className="border rounded-md px-3 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
                <Button onClick={load}>Terapkan</Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Memuat data...
              </div>
            ) : error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Urutan</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Judul</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[160px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(reorderMode ? localItems : items).map((t) => (
                      <TableRow
                        key={t.id}
                        draggable={reorderMode}
                        onDragStart={(e) => onDragStart(e, t.id)}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, t.id)}
                        className={reorderMode ? "cursor-move" : undefined}
                      >
                        <TableCell>{t.order}</TableCell>
                        <TableCell>{t.category}</TableCell>
                        <TableCell className="font-medium">{t.title}</TableCell>
                        <TableCell>
                          {t.isActive ? (
                            <Badge>Aktif</Badge>
                          ) : (
                            <Badge variant="secondary">Nonaktif</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/admin/terms-conditions/${t.id}/edit`}>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </Link>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setDeleteTarget(t)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Hapus Poin?</DialogTitle>
                                  <DialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Poin "
                                    {deleteTarget?.title}" akan dihapus.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setDeleteTarget(null)}
                                  >
                                    Batal
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={confirmDelete}
                                  >
                                    Hapus
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
