import CarDetailSection from "@/components/detail-armada/CarDetailSection";
import KeyFeatureSection from "@/components/detail-armada/KeyFeatureSection";
import SpecsSection from "@/components/detail-armada/SpecsSection";
import TariffDetailSection from "@/components/detail-armada/TariffDetailSection";
import WhatsAppCtaSection from "@/components/shared/WhatsAppCtaSection";
import { prisma } from "@/lib/prisma";

async function getCarBySlug(slug) {
  try {
    const car = await prisma.car.findUnique({
      where: { slug, available: true },
      select: {
        name: true,
        description: true,
        startingPrice: true,
        capacity: true,
        transmission: true,
        fuelType: true,
        specifications: true, // For coverImage
        images: {
          select: { id: true, imageUrl: true, alt: true, order: true },
          orderBy: { order: "asc" },
        },
        featureBlocks: {
          select: { title: true, description: true, icon: true, order: true },
          orderBy: { order: "asc" },
        },
        details: {
          select: { label: true, value: true },
        },
        tariffs: {
          select: {
            name: true,
            description: true,
            price: true,
            category: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!car) return null;

    // Map a few fields to match the old structure for compatibility
    return {
      ...car,
      coverImage: car.specifications?.coverImage || null,
      gallery: car.images.map((img) => ({
        id: img.id,
        url: img.imageUrl,
        alt: img.alt,
        order: img.order,
      })),
    };
  } catch (error) {
    console.error(`Failed to fetch car by slug ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const car = await getCarBySlug(slug);

  if (!car) {
    return {
      title: "Armada Tidak Ditemukan",
      description: "Mobil yang Anda cari tidak tersedia atau tidak ada.",
    };
  }

  const siteName = "Reborn Trans Lombok";
  const title = `Sewa Mobil ${car.name} di Lombok - ${siteName}`;
  const description =
    car.description ||
    `Sewa mobil ${car.name} di Lombok dengan harga terjangkau. Kapasitas ${car.capacity} penumpang, transmisi ${car.transmission}. Pesan sekarang!`;
  const images = car.coverImage
    ? [car.coverImage]
    : car.gallery?.map((g) => g.url).filter(Boolean) || [];
  const siteUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.rentalmobil.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: car.name,
    description: description,
    image: images,
    brand: {
      "@type": "Brand",
      name: car.name.split(" ")[0], // Simple brand extraction
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/armada/${slug}`,
      priceCurrency: "IDR",
      price: car.startingPrice,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: siteName,
      },
    },
    vehicleEngine: {
      "@type": "EngineSpecification",
      fuelType: car.fuelType,
    },
    vehicleTransmission: car.transmission,
    seatingCapacity: car.capacity.toString(),
  };

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: `/armada/${slug}`,
    },
    openGraph: {
      title,
      description,
      images,
      type: "website", // 'article' is more for blog posts
      url: `/armada/${slug}`,
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    "script[type='application/ld+json']": JSON.stringify(jsonLd),
  };
}

export default async function ArmadaDetailPage({ params }) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

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