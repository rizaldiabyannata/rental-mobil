"use client";

import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
const EditorJs = dynamic(() => import("./EditorJs"), { ssr: false });
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import ItineraryDayCard from "./ItineraryDayCard";
//tambahan
// import { useFieldArray } from "react-hook-form";
import ImageUploader from "./ImageUploader";
// import {
//   FormField,
//   FormItem,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";

function toArrayFromComma(text) {
  if (!text) return [];
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toCommaFromArray(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.join(", ");
}

export function TourPackageForm({ isEditing = false, initialData = null }) {
  // Handler for inclusions
  const handleAddInclusion = () => {
    if (inclusionInput.trim()) {
      setInclusions([...inclusions, inclusionInput.trim()]);
      setInclusionInput("");
    }
  };
  const handleDeleteInclusion = (idx) => {
    setInclusions(inclusions.filter((_, i) => i !== idx));
  };
  // Handler for gallery images
  const handleAddGalleryImage = () => {
    if (galleryImageInput.trim()) {
      setGalleryImages([...galleryImages, galleryImageInput.trim()]);
      setGalleryImageInput("");
    }
  };
  const handleDeleteGalleryImage = (idx) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [duration, setDuration] = useState(initialData?.duration || "");
  // Editor.js expects JSON object, parse if string
  const [description, setDescription] = useState(() => {
    if (initialData?.description) {
      if (typeof initialData.description === "string") {
        try {
          return JSON.parse(initialData.description);
        } catch {
          return {};
        }
      }
      if (typeof initialData.description === "object") {
        return initialData.description;
      }
    }
    return {};
  });
  // Improved: use array state for inclusions and gallery images
  const [inclusions, setInclusions] = useState(
    Array.isArray(initialData?.inclusions)
      ? initialData.inclusions
      : toArrayFromComma(initialData?.inclusions)
  );
  const [inclusionInput, setInclusionInput] = useState("");
  const [galleryImages, setGalleryImages] = useState(
    Array.isArray(initialData?.galleryImages)
      ? initialData.galleryImages
      : toArrayFromComma(initialData?.galleryImages)
  );
  const [galleryImageInput, setGalleryImageInput] = useState("");
  const [showHotels, setShowHotels] = useState(initialData?.showHotels ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [itinerary, setItinerary] = useState(initialData?.itinerary || []);
  // Hotel tiers (bintang & nama hotel per tier) + harga per pax
  const [hotelTiers, setHotelTiers] = useState(() => {
    const tiers = initialData?.hotelTiers || [];
    return tiers.map((t, idx) => ({
      name: t.name || "",
      starRating: typeof t.starRating === "number" ? t.starRating : undefined,
      hotels: Array.isArray(t.hotels) ? t.hotels : [],
      // Keep a raw text buffer so spaces don't get trimmed while typing
      hotelsText: Array.isArray(t.hotels) ? t.hotels.join(", ") : "",
      order: typeof t.order === "number" ? t.order : idx,
      priceTiers: Array.isArray(t.priceTiers)
        ? t.priceTiers.map((p) => ({
            paxRange: p.paxRange || "",
            price: p.price || 0,
          }))
        : [],
    }));
  });
  //tambahan
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "itinerary",
  // });
  const handleItineraryChange = (index, updatedDayData) => {
    const newItinerary = itinerary.map((day, i) => {
      if (i === index) {
        return updatedDayData;
      }
      return day;
    });
    setItinerary(newItinerary);
  };
  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      {
        day: itinerary.length + 1,
        title: "",
        description: "",
        activities: [],
        images: [],
      },
    ]);
  };

  const removeItineraryDay = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  // Auto-generate slug from name if not editing or slug empty
  useEffect(() => {
    if (!isEditing && name && !slug) {
      const s = name
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(s);
    }
  }, [name, slug, isEditing]);

  const canSubmit = useMemo(() => {
    return name.trim() && slug.trim() && duration.trim();
  }, [name, slug, duration]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        duration: duration.trim(),
        description,
        inclusions,
        galleryImages,
        showHotels: Boolean(showHotels),
        itinerary: itinerary,
        hotelTiers: hotelTiers.map((t, i) => ({
          name: t.name?.trim() || undefined,
          starRating:
            typeof t.starRating === "number" ? t.starRating : undefined,
          hotels:
            typeof t.hotelsText === "string"
              ? t.hotelsText
                  .split(",")
                  .map((h) => String(h).trim())
                  .filter(Boolean)
              : Array.isArray(t.hotels)
              ? t.hotels.map((h) => String(h).trim()).filter(Boolean)
              : [],
          order: typeof t.order === "number" ? t.order : i,
          priceTiers: Array.isArray(t.priceTiers)
            ? t.priceTiers.map((p) => ({
                paxRange: String(p.paxRange || "").trim(),
                price: Number(p.price || 0),
              }))
            : [],
        })),
      };

      const url =
        isEditing && initialData?.id
          ? `/api/admin/tour-packages/${initialData.id}`
          : "/api/admin/tour-packages";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Gagal menyimpan paket tour");
      }
      // redirect back to list
      router.push("/admin/tour-packages");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUploadFiles() {
    if (!selectedFiles?.length) {
      setError("Pilih file gambar terlebih dahulu");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      for (const f of selectedFiles) {
        console.log("Adding file to FormData:", f.name, f.type, f.size);
        form.append("images", f);
      }
      console.log("Uploading to /api/tours/images/upload...");
      const res = await fetch("/api/tours/images/upload", {
        method: "POST",
        body: form,
      });
      console.log("Upload response status:", res.status);
      if (!res.ok) {
        const txt = await res.text();
        console.error("Upload failed:", txt);
        throw new Error(txt || "Upload gagal");
      }
      const json = await res.json();
      console.log("Upload success:", json);
      const urls = Array.isArray(json?.urls) ? json.urls : [];
      console.log("Extracted URLs:", urls);
      if (!urls.length) {
        throw new Error("Tidak ada URL gambar yang dikembalikan dari server");
      }
      const current = toArrayFromComma(galleryImagesText);
      const next = [...current, ...urls];
      console.log("Current gallery:", current);
      console.log("New gallery:", next);
      setGalleryImagesText(toCommaFromArray(next));
      setSelectedFiles([]);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-emerald-700">
              Nama Paket
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Paket Lombok 3H2M"
              className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug" className="text-emerald-700">
              Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="paket-lombok-3h2m"
              className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration" className="text-emerald-700">
              Durasi
            </Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="3 Hari 2 Malam"
              className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-emerald-700">
              Deskripsi
            </Label>
            <EditorJs value={description} onChange={setDescription} />
            <span className="text-xs text-emerald-700/80">
              Gunakan editor di atas untuk menulis deskripsi paket wisata.
            </span>
          </div>

          <Separator />

          <div className="mb-6">
            <Label htmlFor="inclusions" className="text-emerald-700">
              Termasuk (pisahkan dengan koma)
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="inclusionInput"
                value={inclusionInput}
                onChange={(e) => setInclusionInput(e.target.value)}
                placeholder="Tambah item termasuk..."
                className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500 flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddInclusion();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddInclusion}
              >
                Tambah
              </Button>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {inclusions.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span>{item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 px-2"
                    onClick={() => handleDeleteInclusion(idx)}
                  >
                    Hapus
                  </Button>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-xs text-muted-foreground">
              Atau masukkan beberapa item sekaligus, pisahkan dengan koma:
            </div>
            <Textarea
              className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500 w-full mt-1"
              rows={2}
              value={inclusions.join(", ")}
              onChange={(e) => setInclusions(toArrayFromComma(e.target.value))}
              placeholder="hotel (sesuai pilihan), mobil full ac, bbm driver, ..."
            />
          </div>
          <div className="mb-6">
            <Label
              htmlFor="gallery"
              className="text-emerald-700 font-semibold mb-2 block"
            >
              Galeri Gambar
            </Label>
            <ImageUploader
              uploaderId="gallery-image-uploader"
              value={galleryImages}
              onChange={setGalleryImages}
            />
          </div>

          <Separator />
          <div>
            <h3 className="text-lg font-medium text-emerald-800">
              Itinerary (Rencana Perjalanan)
            </h3>
            {itinerary.map((day, index) => (
              <ItineraryDayCard
                key={index}
                index={index}
                dayData={day}
                onDayChange={handleItineraryChange}
                onRemoveDay={removeItineraryDay}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addItineraryDay}
              className="border-emerald-600 text-emerald-600 hover:text-white hover:bg-emerald-700"
            >
              Tambah Hari
            </Button>
          </div>

          {/* Hotel Tiers */}
          <Separator />
          <div className="grid gap-3">
            <h3 className="text-lg font-semibold text-emerald-800">
              Pilihan Hotel per Bintang
            </h3>
            {hotelTiers.map((tier, idx) => (
              <div
                key={idx}
                className="rounded-md border border-emerald-200 p-4 grid gap-3 bg-white/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="grid gap-1">
                    <Label className="text-emerald-700">Nama Tier</Label>
                    <Input
                      value={tier.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHotelTiers((prev) =>
                          prev.map((t, i) =>
                            i === idx ? { ...t, name: val } : t
                          )
                        );
                      }}
                      placeholder="Contoh: Hotel Bintang 3"
                      className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-emerald-700">Bintang</Label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={tier.starRating ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                          ? Number(e.target.value)
                          : undefined;
                        setHotelTiers((prev) =>
                          prev.map((t, i) =>
                            i === idx ? { ...t, starRating: val } : t
                          )
                        );
                      }}
                      placeholder="3"
                      className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-emerald-700">Urutan</Label>
                    <Input
                      type="number"
                      value={tier.order ?? idx}
                      onChange={(e) => {
                        const val = Number(e.target.value || 0);
                        setHotelTiers((prev) =>
                          prev.map((t, i) =>
                            i === idx ? { ...t, order: val } : t
                          )
                        );
                      }}
                      className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label className="text-emerald-700">
                    Nama Hotel (pisahkan dengan koma)
                  </Label>
                  <Input
                    value={tier.hotelsText ?? (tier.hotels || []).join(", ")}
                    onChange={(e) => {
                      const text = e.target.value;
                      setHotelTiers((prev) =>
                        prev.map((t, i) =>
                          i === idx ? { ...t, hotelsText: text } : t
                        )
                      );
                    }}
                    onBlur={(e) => {
                      const list = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setHotelTiers((prev) =>
                        prev.map((t, i) =>
                          i === idx
                            ? {
                                ...t,
                                hotels: list,
                                hotelsText: list.join(", "),
                              }
                            : t
                        )
                      );
                    }}
                    placeholder="M Hotel, Mayura, Heart Premium, ..."
                    className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-emerald-700">
                    Harga per Pax (Pax Range : Harga)
                  </Label>
                  {(tier.priceTiers || []).map((p, pi) => (
                    <div
                      key={pi}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      <Input
                        value={p.paxRange}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHotelTiers((prev) =>
                            prev.map((t, i) =>
                              i === idx
                                ? {
                                    ...t,
                                    priceTiers: t.priceTiers.map((pp, ppi) =>
                                      ppi === pi ? { ...pp, paxRange: val } : pp
                                    ),
                                  }
                                : t
                            )
                          );
                        }}
                        placeholder="Contoh: 2-3 PAX"
                        className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500"
                      />
                      <Input
                        type="number"
                        value={p.price}
                        onChange={(e) => {
                          const val = Number(e.target.value || 0);
                          setHotelTiers((prev) =>
                            prev.map((t, i) =>
                              i === idx
                                ? {
                                    ...t,
                                    priceTiers: t.priceTiers.map((pp, ppi) =>
                                      ppi === pi ? { ...pp, price: val } : pp
                                    ),
                                  }
                                : t
                            )
                          );
                        }}
                        placeholder="Contoh: 2100000"
                        className="border-emerald-300 focus-visible:ring-emerald-500 focus-visible:ring-2 focus-visible:border-emerald-500"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setHotelTiers((prev) =>
                          prev.map((t, i) =>
                            i === idx
                              ? {
                                  ...t,
                                  priceTiers: [
                                    ...(t.priceTiers || []),
                                    { paxRange: "", price: 0 },
                                  ],
                                }
                              : t
                          )
                        )
                      }
                      className="border-emerald-600 text-emerald-600 hover:text-white hover:bg-emerald-700"
                    >
                      Tambah Harga Pax
                    </Button>
                    {tier.priceTiers?.length ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setHotelTiers((prev) =>
                            prev.map((t, i) =>
                              i === idx
                                ? {
                                    ...t,
                                    priceTiers: t.priceTiers.slice(0, -1),
                                  }
                                : t
                            )
                          )
                        }
                      >
                        Hapus Terakhir
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setHotelTiers((prev) => {
                        const copy = [...prev];
                        copy.splice(idx + 1, 0, {
                          name: "",
                          starRating: undefined,
                          hotels: [],
                          order: (tier.order ?? idx) + 1,
                          priceTiers: [],
                        });
                        return copy;
                      })
                    }
                    className="border-emerald-600 text-emerald-600 hover:text-white hover:bg-emerald-700"
                  >
                    Tambah Tier di Bawah
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setHotelTiers((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    Hapus Tier
                  </Button>
                </div>
              </div>
            ))}
            <div>
              <Button
                type="button"
                onClick={() =>
                  setHotelTiers((prev) => [
                    ...prev,
                    {
                      name: "",
                      starRating: undefined,
                      hotels: [],
                      order: prev?.length || 0,
                      priceTiers: [],
                    },
                  ])
                }
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Tambah Tier Hotel
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Switch
              id="showHotels"
              checked={showHotels}
              onCheckedChange={setShowHotels}
              className="data-[state=checked]:bg-emerald-600"
            />
            <Label htmlFor="showHotels" className="text-emerald-700">
              Tampilkan nama hotel
            </Label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                </span>
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Simpan"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/tour-packages")}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
