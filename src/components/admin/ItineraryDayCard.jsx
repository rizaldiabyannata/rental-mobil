"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "./ImageUploader";

const ItineraryDayCard = ({ dayData, index, onDayChange, onRemoveDay }) => {
  const handleChange = (field, value) => {
    onDayChange(index, { ...dayData, [field]: value });
  };

  const uploaderId = `image-upload-${index}`;

  return (
    <div className="border p-4 rounded-md my-4 space-y-4 bg-white/50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Hari ke-{index + 1}</h4>
        <Button
          variant="destructive"
          size="sm"
          type="button"
          onClick={() => onRemoveDay(index)}
        >
          Hapus Hari
        </Button>
      </div>

      <div className="grid gap-1">
        <Label>Judul Hari</Label>
        <Input
          placeholder="Contoh: Gili Trawangan & Sunset"
          value={dayData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className="grid gap-1">
        <Label>Deskripsi Kegiatan</Label>
        <Textarea
          placeholder="Jelaskan kegiatan hari ini..."
          value={dayData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="grid gap-1">
        <Label>Daftar Kegiatan (satu per baris)</Label>
        <Textarea
          placeholder="- Mengunjungi Pantai Kuta..."
          value={(dayData.activities || []).join("\n")}
          onChange={(e) =>
            handleChange("activities", e.target.value.split("\n"))
          }
          rows={4}
        />
      </div>

      <ImageUploader
        uploaderId={uploaderId}
        value={dayData.images || []}
        onChange={(newImages) => handleChange("images", newImages)}
      />
    </div>
  );
};

export default ItineraryDayCard;
