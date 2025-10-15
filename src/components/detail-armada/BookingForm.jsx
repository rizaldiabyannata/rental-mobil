"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * BookingForm (mobile-first)
 * - Fields: Nama, Nomor WhatsApp, Tanggal (date), Titik Jemput, Catatan
 * - On submit: open wa.me/<number> with encoded message
 *
 * Props:
 * - carName?: string (included in message)
 * - waUrlBase: string (e.g. "https://wa.me/129129120")
 * - buildMessage?: (data) => string (custom template builder)
 * - className?: string
 */
export default function BookingForm({
  carName,
  waUrlBase,
  buildMessage,
  className,
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    pickup: "",
    notes: "",
  });
  const [messageText, setMessageText] = useState("");
  const [messageDirty, setMessageDirty] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const defaultBuilder = (f) => {
    const lines = [
      `Halo Admin, saya ingin memesan${carName ? ` ${carName}` : ""}.`,
      `Nama: ${f.name || "-"}`,
      `Nomor WA: ${f.phone || "-"}`,
      `Tanggal: ${f.date || "-"}`,
      `Titik Jemput: ${f.pickup || "-"}`,
      f.notes ? `Catatan: ${f.notes}` : undefined,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const built = useMemo(() => {
    const builder = buildMessage || defaultBuilder;
    return builder(form);
  }, [form, buildMessage]);

  useEffect(() => {
    if (!messageDirty) {
      setMessageText(built);
    }
  }, [built, messageDirty]);

  const href = useMemo(() => {
    const base = waUrlBase?.trim() || "";
    const url = new URL(base);
    url.searchParams.set("text", messageText || built);
    return url.toString();
  }, [waUrlBase, messageText, built]);

  const onSubmit = (e) => {
    e.preventDefault();
    // open in new tab so user stays on the page
    window.open(href, "_blank");
  };

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Nama lengkap"
          value={form.name}
          onChange={handleChange}
          className="h-12 rounded-md border border-neutral-300 bg-neutral-100 px-4 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Nomor WhatsApp"
          value={form.phone}
          onChange={handleChange}
          className="h-12 rounded-md border border-neutral-300 bg-neutral-100 px-4 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="h-12 rounded-md border border-neutral-300 bg-neutral-100 px-4 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        <input
          type="text"
          name="pickup"
          placeholder="Titik jemput"
          value={form.pickup}
          onChange={handleChange}
          className="h-12 rounded-md border border-neutral-300 bg-neutral-100 px-4 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        <textarea
          name="notes"
          placeholder="Catatan tambahan"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          className="rounded-md border border-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        {/* Custom WhatsApp message (editable) */}
        <div className="mt-2">
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            Pesan WhatsApp
          </label>
          <textarea
            name="waMessage"
            rows={4}
            value={messageText}
            onChange={(e) => {
              setMessageDirty(true);
              setMessageText(e.target.value);
            }}
            className="w-full rounded-md border border-neutral-300 bg-neutral-100 px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="Pesan yang akan dikirim ke WhatsApp..."
          />
          <p className="mt-1 text-xs text-neutral-500">
            Pesan di atas akan dikirim ke WhatsApp. Kamu bisa mengubahnya
            sebelum menekan Kirim.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          className="bg-emerald-700 hover:bg-emerald-800 px-6 rounded-full"
        >
          Kirim
        </Button>
      </div>
    </form>
  );
}
