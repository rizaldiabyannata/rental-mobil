"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function AdminFaqsPage() {
  const [items, setItems] = useState([]);
  const [localItems, setLocalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [reorderMode, setReorderMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("limit", "50");
      const res = await fetch(`/api/faqs?${params.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal memuat FAQ");
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

  // Drag & drop reorder helpers
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e) => {
    if (!reorderMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
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
      // Issue PUT per item with new order = index (starting from 0 or 1).
      const updates = localItems.map((it, idx) => ({ id: it.id, order: idx }));
      await Promise.all(
        updates.map((u) =>
          fetch(`/api/faqs/${u.id}`, {
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
      const res = await fetch(`/api/faqs/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Gagal menghapus FAQ");
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
                <BreadcrumbPage>FAQ</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">FAQ</h1>
            <p className="text-muted-foreground">
              Kelola pertanyaan yang sering diajukan
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
            <Link href="/admin/faqs/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" /> Tambah FAQ
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar FAQ</CardTitle>
            <CardDescription>
              Cari, urutkan, dan kelola entri FAQ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Cari pertanyaan/jawaban..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
              />
              <Button onClick={load}>Cari</Button>
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
                      <TableHead className="w-[70px]">Urutan</TableHead>
                      <TableHead>Pertanyaan</TableHead>
                      <TableHead>Jawaban</TableHead>
                      <TableHead className="w-[160px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(reorderMode ? localItems : items).map((f) => (
                      <TableRow
                        key={f.id}
                        draggable={reorderMode}
                        onDragStart={(e) => onDragStart(e, f.id)}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, f.id)}
                        className={reorderMode ? "cursor-move" : undefined}
                      >
                        <TableCell>{f.order}</TableCell>
                        <TableCell className="font-medium">
                          {f.question}
                        </TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-[500px]">
                          {f.answer}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/admin/faqs/${f.id}/edit`}>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </Link>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setDeleteTarget(f)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Hapus FAQ?</DialogTitle>
                                  <DialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. FAQ "
                                    {deleteTarget?.question}" akan dihapus.
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
                          colSpan={4}
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
