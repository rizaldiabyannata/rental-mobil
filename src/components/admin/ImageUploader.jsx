"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Upload } from "lucide-react";

const ImageUploader = ({ value = [], onChange, uploaderId }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch("/api/admin/images/upload", {
        // <-- Ganti dengan endpoint API-mu
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengupload gambar");
      }

      onChange([...value, ...result.urls]);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <Label>Galeri Foto</Label>
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {value
            .filter(
              (url) =>
                typeof url === "string" &&
                url.trim() &&
                /^https?:\/\//.test(url)
            )
            .map((url, index) => (
              <div key={index} className="relative group aspect-video">
                <Image
                  src={url}
                  alt={`Gambar galeri ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" asChild>
            <label
              htmlFor={uploaderId}
              className="cursor-pointer flex items-center gap-2"
            >
              <Upload className="size-4" />
              <span>Upload Foto</span>
              <input
                id={uploaderId}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </Button>
          {uploading && <Loader2 className="size-5 animate-spin" />}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
