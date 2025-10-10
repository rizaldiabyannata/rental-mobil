"use client";
import { useEffect, useState } from "react";
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
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditPartnerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    order: "0",
    logo: null,
    logoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/partners/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Gagal memuat partner");
        if (cancelled) return;
        setForm({
          name: json.data?.name || "",
          order: String(json.data?.order ?? 0),
          logo: null,
          logoUrl: json.data?.logoUrl || "",
        });
      } catch (e) {
        alert(e.message || "Tidak dapat memuat data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let res, json;
      if (form.logo) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("order", String(parseInt(form.order || "0")));
        fd.append("logo", form.logo);
        res = await fetch(`/api/partners/${id}`, { method: "PUT", body: fd });
      } else {
        res = await fetch(`/api/partners/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            order: parseInt(form.order || "0"),
          }),
        });
      }
      json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Gagal menyimpan partner");
      router.push("/admin/partners");
    } catch (e) {
      alert(e.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
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
                <BreadcrumbLink href="/admin/partners">Mitra</BreadcrumbLink>
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
        <Card>
          <CardHeader>
            <CardTitle>Edit Partner</CardTitle>
            <CardDescription>Perbarui nama, urutan, dan logo</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Memuat...</div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Urutan</Label>
                  <Input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: e.target.value })
                    }
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  {form.logoUrl ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={form.logoUrl}
                        alt="Logo"
                        className="h-12 w-auto rounded border bg-white"
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            logo: e.target.files?.[0] || null,
                          })
                        }
                        className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                    </div>
                  ) : (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setForm({ ...form, logo: e.target.files?.[0] || null })
                      }
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {saving ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
