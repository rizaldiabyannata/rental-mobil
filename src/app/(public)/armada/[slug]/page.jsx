import Image from "next/image";
import CarDetailSection from "@/components/detail-armada/CarDetailSection";
import KeyFeatureSection from "@/components/detail-armada/KeyFeatureSection";
import SpecsSection from "@/components/detail-armada/SpecsSection";
import TariffDetailSection from "@/components/detail-armada/TariffDetailSection";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";

async function fetchCarBySlug(slug) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || ""
    }/api/public/cars/slug/${encodeURIComponent(slug)}`,
    {
      // disable caching to always get fresh availability/prices
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const json = await res.json().catch(() => ({}));
  return json?.data || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = await fetchCarBySlug(slug);
  if (!car) {
    return { title: "Armada tidak ditemukan" };
  }
  const title = `${car.name} – Sewa Mobil Lombok`;
  const description =
    car.description ||
    `Sewa ${car.name} dengan harga mulai ${car.startingPrice}`;
  const images = car.coverImage ? [{ url: car.coverImage }] : [];
  return {
    title,
    description,
    alternates: { canonical: `/armada/${slug}` },
    openGraph: {
      title,
      description,
      images,
      type: "article",
    },
  };
}

export default async function ArmadaDetailPage({ params }) {
  const { slug } = params;
  const car = await fetchCarBySlug(slug);

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold">Armada tidak ditemukan</h1>
        <p className="text-muted-foreground mt-2">
          Periksa kembali tautan atau pilih armada lain.
        </p>
      </div>
    );
  }

  // Map API data to component props shape
  const carForHero = {
    name: car.name,
    description: car.description,
    price: new Intl.NumberFormat("id-ID").format(car.startingPrice),
    priceUnit: "/ 12 Jam (Termasuk Driver)", // optional: bisa diambil dari kategori tarif jika ada
    longDescription: car.description, // bisa diperluas jika ada field khusus
    images: Array.isArray(car.gallery)
      ? car.gallery.map((g) => {
          const raw = g.url || "";
          const src = /^https?:\/\//i.test(raw)
            ? raw
            : raw.startsWith("/")
            ? raw
            : `/${raw}`;
          return { id: g.id, src, alt: g.alt || car.name };
        })
      : car.coverImage
      ? [{ id: "cover", src: car.coverImage, alt: car.name }]
      : [],
  };

  // Key features map: gunakan featureBlocks sebagai daftar, jatuhkan ke 3 item jika ingin tampilan rapih
  const keyFeatures = (car.featureBlocks || [])
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((f, idx) => ({
      key: `${f.title}-${idx}`,
      icon: (f.icon || "").toString().trim().toLowerCase(),
      title: f.title,
      description: f.description,
    }));

  const specItems = [];
  specItems.push({ label: "Transmisi", value: car.transmission });
  specItems.push({
    label: "Kapasitas Penumpang",
    value: `${car.capacity} orang`,
  });
  specItems.push({ label: "Bahan Bakar", value: car.fuelType });
  // Tambahkan detail fleksibel jika ada
  if (Array.isArray(car.details)) {
    for (const d of car.details) {
      if (d && d.label && d.value)
        specItems.push({ label: d.label, value: d.value });
    }
  }

  // Map tariff items from API into cards grouped by category
  let tariffCards = [];
  if (Array.isArray(car.tariffs) && car.tariffs.length > 0) {
    const groups = new Map();
    for (const t of car.tariffs) {
      const cat = t.category || "Tarif";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(t);
    }
    tariffCards = Array.from(groups.entries()).map(
      ([category, items], idx) => ({
        key: `tariff-${category}-${idx}`,
        title: category,
        items: items
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((it) => ({
            label: it.name || it.description || "Tarif",
            price: it.price,
          })),
      })
    );
  }

  // Fallback: jika tidak ada tariff dari API, tampilkan kartu default dengan startingPrice
  if (tariffCards.length === 0 && typeof car.startingPrice === "number") {
    tariffCards = [
      {
        key: "tariff-default",
        title: "Tarif Sewa",
        items: [
          { label: "Harga mulai", price: car.startingPrice },
          { label: "Detail tarif", price: "Hubungi admin" },
        ],
      },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CarDetailSection car={carForHero} />
      <KeyFeatureSection features={keyFeatures} />
      <SpecsSection
        title="Spesifikasi Lengkap"
        align="left"
        items={specItems}
        className="bg-white"
      />
      {tariffCards.length > 0 && <TariffDetailSection cards={tariffCards} />}
      <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl px-4 md:px-6 lg:px-8 pb-12">
        <WhatsAppCtaSection
          carName={car.name}
          waUrlBase="https://wa.me/6287741861681"
          imageSrc="/imageforctasection.png"
          imageAlt={`${car.name} - Gallery`}
        />
      </div>
    </div>
  );
}
