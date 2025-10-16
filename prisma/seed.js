// Seed script to populate data for all schema models
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function hashPassword(pwd) {
  const SALT_ROUNDS = 12;
  return await bcrypt.hash(pwd, SALT_ROUNDS);
}

async function main() {
  // 1) Users
  const adminPwd = await hashPassword("admin123");
  const ownerPwd = await hashPassword("owner123");

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { password: adminPwd },
    create: {
      email: "admin@example.com",
      name: "Admin",
      role: "ADMIN",
      password: adminPwd,
    },
  });
  await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: { password: ownerPwd },
    create: {
      email: "owner@example.com",
      name: "Owner",
      role: "ADMIN",
      password: ownerPwd,
    },
  });

  // 2) Cars
  const carCount = await prisma.car.count();
  if (carCount === 0) {
    await prisma.car.createMany({
      data: [
        {
          name: "INNOVA REBORN",
          slug: "innova-reborn",
          description: "Toyota Innova Reborn, MPV nyaman dan bertenaga.",
          startingPrice: 650000,
          capacity: 7,
          transmission: "Automatic",
          fuelType: "Bensin",
          available: true,
          specifications: { coverImage: "/vercel.svg", color: "Silver" },
        },
        {
          name: "TOYOTA HIACE",
          slug: "toyota-hiace",
          description: "Toyota Hiace, kapasitas besar untuk rombongan.",
          startingPrice: 1200000,
          capacity: 14,
          transmission: "Automatic",
          fuelType: "Bensin",
          available: true,
          specifications: { coverImage: "/next.svg", color: "White" },
        },
      ],
    });
  }

  // Armada hanya Innova Reborn dan Toyota HiAce, sudah dibuat di atas

  // Re-query cars for ids (includes the newly ensured cars)
  const cars = await prisma.car.findMany({ orderBy: { createdAt: "asc" } });

  // 2b) Backfill slugs for existing cars without slug
  function slugify(input) {
    const base = String(input || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return base || "car";
  }

  const existing = await prisma.car.findMany({
    select: { id: true, name: true, slug: true },
  });
  const taken = new Set(existing.map((c) => c.slug).filter(Boolean));
  const toAssign = [];
  for (const c of existing) {
    if (!c.slug) {
      const base = slugify(c.name);
      let candidate = base;
      let i = 1;
      while (taken.has(candidate)) {
        candidate = `${base}-${i++}`;
      }
      taken.add(candidate);
      toAssign.push({ id: c.id, slug: candidate });
    }
  }
  if (toAssign.length) {
    await prisma.$transaction(
      toAssign.map((u) =>
        prisma.car.update({ where: { id: u.id }, data: { slug: u.slug } })
      )
    );
  }

  // 2c) Car Features
  const featureCount = await prisma.carFeature.count();
  if (featureCount === 0 && cars.length > 0) {
    const featuresData = [];
    for (const car of cars) {
      featuresData.push(
        {
          carId: car.id,
          icon: "ac-unit", // Material Icons name
          title: "Full AC",
          description: "Kabin sejuk dengan pendingin udara di setiap baris.",
          order: 1,
        },
        {
          carId: car.id,
          icon: "music-note", // Material Icons name
          title: "Audio System",
          description: "Nikmati perjalanan dengan sistem audio berkualitas.",
          order: 2,
        }
      );
    }
    await prisma.carFeature.createMany({ data: featuresData });
  }

  // 3) Car Images
  const imageCount = await prisma.carImage.count();
  if (imageCount === 0 && cars.length > 0) {
    const imagesData = [];
    const placeholders = ["/vercel.svg", "/next.svg", "/window.svg"]; // existing public assets
    cars.forEach((car) => {
      imagesData.push(
        {
          carId: car.id,
          imageUrl: placeholders[0],
          alt: `${car.name} 1`,
          order: 0,
        },
        {
          carId: car.id,
          imageUrl: placeholders[1],
          alt: `${car.name} 2`,
          order: 1,
        },
        {
          carId: car.id,
          imageUrl: placeholders[2],
          alt: `${car.name} 3`,
          order: 2,
        }
      );
    });
    // createMany for images
    await prisma.carImage.createMany({ data: imagesData });
  }

  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    await prisma.fAQ.createMany({
      data: [
        {
          question: "Apa saja syarat untuk menyewa mobil?",
          answer:
            "Untuk menyewa mobil, Anda hanya perlu menyiapkan KTP/Paspor dan SIM A yang masih berlaku. Untuk beberapa paket, mungkin diperlukan jaminan tambahan yang akan kami informasikan lebih lanjut.",
          order: 1,
        },
        {
          question: "Apakah harga sewa sudah termasuk bensin dan supir?",
          answer:
            "Ya, sebagian besar paket kami adalah 'All-in-one' yang sudah termasuk mobil, supir profesional, dan BBM. Namun, kami juga menyediakan paket sewa mobil lepas kunci (tanpa supir) sesuai permintaan.",
          order: 2,
        },
        {
          question: "Bagaimana jika terjadi kerusakan atau ban bocor di jalan?",
          answer:
            "Jangan khawatir. Tim kami siaga 24/7. Segera hubungi nomor darurat yang kami berikan, dan kami akan mengirimkan bantuan atau mobil pengganti secepatnya.",
          order: 3,
        },
        {
          question: "Apakah mobil bisa dibawa keluar kota Lombok?",
          answer:
            "Bisa, namun wajib dengan konfirmasi terlebih dahulu kepada kami saat proses pemesanan untuk penyesuaian syarat dan ketentuan perjalanan luar pulau.",
          order: 4,
        },
        {
          question: "Bagaimana sistem pembayarannya?",
          answer:
            "Kami memerlukan uang muka (DP) minimal 30% saat pemesanan untuk mengunci jadwal. Sisa pembayaran bisa dilunasi saat serah terima mobil di lokasi penjemputan.",
          order: 5,
        },
      ],
    });
  }

  // 7) Terms & Conditions
  const termsCount = await prisma.termsAndConditions.count();
  if (termsCount === 0) {
    await prisma.termsAndConditions.createMany({
      data: [
        {
          category: "Syarat dan Ketentuan",
          title: "Ketentuan Umum",
          content:
            "Penyewa wajib menunjukkan identitas diri yang valid (KTP/Paspor, SIM A). Kendaraan hanya boleh dikemudikan oleh penyewa atau supir yang terdaftar. Penggunaan kendaraan untuk aktivitas ilegal dilarang keras.",
          order: 1,
          isActive: true,
        },
        {
          category: "Syarat dan Ketentuan",
          title: "Pemesanan & Pembayaran",
          content:
            "Pemesanan dianggap sah setelah pembayaran uang muka (DP) sebesar 30%. Pelunasan dilakukan saat serah terima kendaraan. Pembatalan H-3 akan dikenakan potongan 50% dari DP, pembatalan H-1 atau kurang akan membuat DP hangus.",
          order: 2,
          isActive: true,
        },
        {
          category: "Syarat dan Ketentuan",
          title: "Penggunaan Kendaraan",
          content:
            "Harga sewa tidak termasuk BBM (kecuali paket All-in-one). Kendaraan harus dikembalikan dengan level BBM yang sama seperti saat diterima. Penggunaan kendaraan di luar wilayah Lombok harus dengan persetujuan terlebih dahulu.",
          order: 3,
          isActive: true,
        },
        {
          category: "Syarat dan Ketentuan",
          title: "Biaya Overtime",
          content:
            "Kelebihan waktu penggunaan akan dikenakan biaya overtime sebesar 10% dari harga sewa per jam. Keterlambatan lebih dari 6 jam akan dihitung sebagai biaya sewa satu hari penuh.",
          order: 4,
          isActive: true,
        },
        {
          category: "Syarat dan Ketentuan",
          title: "Kerusakan & Asuransi",
          content:
            "Penyewa bertanggung jawab penuh atas segala kerusakan, kehilangan, atau kecelakaan yang disebabkan oleh kelalaian. Kendaraan kami dilindungi asuransi All Risk, namun klaim tunduk pada syarat dan ketentuan dari pihak asuransi.",
          order: 5,
          isActive: true,
        },
      ],
    });
  }

  // 8) Partners
  const partnerCount = await prisma.partner.count();
  if (partnerCount === 0) {
    await prisma.partner.createMany({
      data: [
        { name: "Partner A", logoUrl: "/vercel.svg", order: 1 },
        { name: "Partner B", logoUrl: "/next.svg", order: 2 },
        { name: "Partner C", logoUrl: "/globe.svg", order: 3 },
      ],
    });
  }

  // 9) Tariff Penyewaan sesuai data (Service Type, Package Type, Car, Price)
  // Helpers
  const parsePrices = (str) => {
    if (typeof str !== "string") return [];
    const matches = [...str.matchAll(/(\d[\d\.]*)/g)].map((m) =>
      parseInt(m[1].replace(/\D/g, ""))
    );
    return matches.filter((n) => Number.isFinite(n));
  };
  // season removed; just clean package parentheses if any
  const cleanPackage = (pkg) =>
    typeof pkg === "string" ? pkg.replace(/\s*\(.*?\)\s*/g, "").trim() : pkg;

  const CATEGORY_DEFS = [
    {
      name: "Sewa Per 12 Jam",
      serviceType: "Tarif sewa per 12 jam",
      description: "Tarif sewa durasi 12 jam",
      order: 1,
      rows: [
        {
          car: "INNOVA REBORN",
          packageType: "Dengan driver",
          price: "Rp.650.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Dengan Driver+BBM (Normal)",
          price: "Rp.800.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Dengan Driver+BBM (Highseason)",
          price: "Rp. 1.200.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Over Time/per jam",
          price: "Rp.60.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Penambahan biaya diluar rute (Mataram, Senggi, Kute)",
          price: "Rp.125.000",
        },
      ],
    },
    {
      name: "Antar Jemput Bandara",
      serviceType: "Tarif Antar Jemput Bandara",
      description: "Tarif point-to-point dari/ke bandara",
      order: 2,
      rows: [
        { car: "INNOVA REBORN", packageType: "Mataram", price: "Rp.450.000" },
        { car: "INNOVA REBORN", packageType: "Senggigi", price: "Rp.550.000" },
        { car: "INNOVA REBORN", packageType: "Bangsal", price: "Rp. 750.000" },
        { car: "INNOVA REBORN", packageType: "Kute", price: "Rp.500.000" },
      ],
    },
    {
      name: "Paket Tour Mataram, Lombok",
      serviceType: "Paket Tour Mataram, Lombok",
      description: "Paket tour dari Mataram ke berbagai destinasi",
      order: 3,
      rows: [
        // Innova Reborn
        {
          car: "INNOVA REBORN",
          packageType: "Mataram- Sembalun",
          price: "Rp.850.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram-Kute",
          price: "Rp.700.000/ Drop Rp.500.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram-Gili",
          price: "Rp.650.000/ Drop Rp.400.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram Sekotong",
          price: "Rp.750.000/ Drop Rp.550.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram-Tete Batu",
          price: "Rp.800.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram- Benang Stukel",
          price: "Rp.600.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram- Bandara",
          price: "Rp.400.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram- Selong Belanak",
          price: "Rp.700.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram- Senaru",
          price: "Rp.850.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram- Senggigi",
          price: "Rp.200.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram- Bangsal",
          price: "Rp.400.000",
        },
        {
          car: "INNOVA REBORN",
          packageType: "Mataram- Pantai Pink",
          price: "Rp. 850.000",
        },
        // Toyota Hiace
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram- Sembalun",
          price: "Rp.1.200.000",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram-Kute",
          price: "Rp.1.000.000",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram-Gili",
          price: "Rp.900.000",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram Sekotong",
          price: "Rp.1.000.000",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram-Tete Batu",
          price: "Rp.900.000",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram- Benang Stukel",
          price: "Rp.900.000",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram- Bandara",
          price: "Rp.600.000",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram- Selong Belanak",
          price: "Rp.1.000.000",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram- Senaru",
          price: "Rp.1.200.000",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram- Senggigi",
          price: "Rp.300.000 Drop",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram- Bangsal",
          price: "Rp.500.000 Drop",
        },
        {
          car: "TOYOTA HIACE",
          packageType: "Mataram- Pantai Pink",
          price: "Rp.1.000.000",
        },
      ],
    },
  ];

  const resetTariffs =
    (process.env.SEED_TARIFF_RESET || "").toLowerCase() === "1";

  if (resetTariffs) {
    await prisma.tariffItem.deleteMany({});
    await prisma.tariffCategory.deleteMany({});
  }

  for (const cat of CATEGORY_DEFS) {
    // upsert/find category by name
    let category = await prisma.tariffCategory.findFirst({
      where: { name: cat.name },
    });
    if (!category) {
      category = await prisma.tariffCategory.create({
        data: {
          name: cat.name,
          description: cat.description || null,
          order: cat.order || 0,
        },
      });
    } else {
      // update basic fields if changed
      if (
        category.description !== (cat.description || null) ||
        category.order !== (cat.order || 0)
      ) {
        category = await prisma.tariffCategory.update({
          where: { id: category.id },
          data: {
            description: cat.description || null,
            order: cat.order || 0,
          },
        });
      }
    }

    let orderCounter = 1;
    for (const row of cat.rows) {
      // resolve carId
      const car = await prisma.car.findFirst({ where: { name: row.car } });
      if (!car) continue;

      // remove any parenthetical hints; seasons not stored anymore
      const basePackage = cleanPackage(row.packageType);

      const nums = parsePrices(row.price);
      const isDropVariant = /drop/i.test(row.price) || /\//.test(row.price);
      const itemsToCreate = [];
      if (nums.length >= 2 && isDropVariant) {
        itemsToCreate.push({ label: basePackage, amount: nums[0] });
        itemsToCreate.push({ label: `${basePackage} (Drop)`, amount: nums[1] });
      } else if (nums.length >= 1) {
        const label = /drop/i.test(row.price)
          ? `${basePackage} (Drop)`
          : basePackage;
        itemsToCreate.push({ label, amount: nums[0] });
      } else {
        continue;
      }

      for (const it of itemsToCreate) {
        const uniqueWhere = {
          categoryId: category.id,
          carId: car.id,
          name: it.label,
          serviceType: cat.serviceType || null,
          packageType: basePackage,
        };
        const existing = await prisma.tariffItem.findFirst({
          where: uniqueWhere,
        });
        if (!existing) {
          await prisma.tariffItem.create({
            data: {
              ...uniqueWhere,
              price: it.amount,
              order: orderCounter++,
            },
          });
        } else {
          if (existing.price !== it.amount || existing.order !== orderCounter) {
            await prisma.tariffItem.update({
              where: { id: existing.id },
              data: { price: it.amount, order: orderCounter },
            });
          }
          orderCounter++;
        }
      }
    }
  }

  console.log(
    "Seed complete: users, cars (+images +tariffs), tour packages, FAQ, terms, partners, tariff categories/items (from CSV, idempotent)"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
