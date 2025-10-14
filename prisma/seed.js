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
          name: "Toyota Avanza",
          description: "MPV nyaman untuk keluarga, irit dan luas.",
          startingPrice: 350000,
          capacity: 7,
          transmission: "Automatic",
          fuelType: "Bensin",
          available: true,
          features: ["AC", "Audio", "USB Charger"],
          specifications: { coverImage: "/vercel.svg", color: "Silver" },
        },
        {
          name: "Honda Brio",
          description: "City car kompak dan lincah untuk dalam kota.",
          startingPrice: 300000,
          capacity: 5,
          transmission: "Manual",
          fuelType: "Bensin",
          available: true,
          features: ["AC", "Audio"],
          specifications: { coverImage: "/next.svg", color: "Yellow" },
        },
        {
          name: "Suzuki Ertiga",
          description: "MPV dengan kabin lega dan nyaman.",
          startingPrice: 400000,
          capacity: 7,
          transmission: "Automatic",
          fuelType: "Bensin",
          available: true,
          features: ["AC", "Audio", "Bluetooth"],
          specifications: { coverImage: "/globe.svg", color: "White" },
        },
      ],
    });
  }

  // Ensure required armada exist based on provided tariff data
  async function ensureCarByName(name, defaults = {}) {
    let car = await prisma.car.findFirst({ where: { name } });
    if (!car) {
      car = await prisma.car.create({
        data: {
          name,
          description: defaults.description || null,
          startingPrice: defaults.startingPrice ?? 0,
          capacity: defaults.capacity ?? 7,
          transmission: defaults.transmission || "Automatic",
          fuelType: defaults.fuelType || "Bensin",
          available: true,
          features: defaults.features || ["AC", "Audio"],
          specifications: defaults.specifications || {},
        },
      });
    }
    return car;
  }

  const innova = await ensureCarByName("INNOVA REBORN", {
    description: "Toyota Innova Reborn, MPV nyaman dan bertenaga.",
    startingPrice: 650000,
    capacity: 7,
  });
  const hiace = await ensureCarByName("TOYOTA HIACE", {
    description: "Toyota Hiace, kapasitas besar untuk rombongan.",
    startingPrice: 1200000,
    capacity: 14,
  });

  // Re-query cars for ids (includes the newly ensured cars)
  const cars = await prisma.car.findMany({ orderBy: { createdAt: "asc" } });

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

  // 4) Car Tariffs
  const tariffCount = await prisma.carTariff.count();
  if (tariffCount === 0 && cars.length > 0) {
    for (const car of cars) {
      await prisma.carTariff.createMany({
        data: [
          {
            carId: car.id,
            name: "12 Jam",
            price: 250000,
            description: "Termasuk sopir, belum termasuk BBM",
          },
          {
            carId: car.id,
            name: "24 Jam",
            price: 450000,
            description: "Termasuk sopir, belum termasuk BBM",
          },
          {
            carId: car.id,
            name: "Antar-Jemput",
            price: 150000,
            description: "Dalam kota",
          },
        ],
      });
    }
  }

  // 5) Tour Packages (removed)

  // 6) FAQ
  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    await prisma.fAQ.createMany({
      data: [
        {
          question: "Bagaimana cara memesan?",
          answer: "Hubungi kami via WhatsApp atau form kontak.",
          order: 1,
        },
        {
          question: "Apakah harga sudah termasuk sopir?",
          answer: "Tergantung paket, detail tertera di tarif.",
          order: 2,
        },
        {
          question: "Metode pembayaran apa saja?",
          answer: "Transfer bank dan tunai.",
          order: 3,
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
          category: "Umum",
          title: "KTP Wajib",
          content: "Penyewa wajib menunjukkan KTP saat penjemputan.",
          order: 1,
          isActive: true,
        },
        {
          category: "Sewa Mobil",
          title: "BBM",
          content: "BBM ditanggung penyewa kecuali paket all-in.",
          order: 2,
          isActive: true,
        },
        {
          category: "Pembayaran",
          title: "DP",
          content: "DP minimal 30% untuk konfirmasi pemesanan.",
          order: 3,
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
