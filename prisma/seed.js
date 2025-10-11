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

  // Re-query cars for ids
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

  // 5) Tour Packages
  const tourCount = await prisma.tourPackage.count();
  if (tourCount === 0) {
    await prisma.tourPackage.createMany({
      data: [
        {
          name: "Paket City Tour 1 Hari",
          description: "Jelajahi destinasi populer dalam 1 hari.",
          imageUrl: "/file.svg",
          itinerary: {
            schedule: [
              "08:00 Jemput",
              "09:00 Museum",
              "12:00 Kuliner",
              "15:00 Taman Kota",
              "18:00 Kembali",
            ],
          },
          price: 750000,
          duration: "1 Hari",
        },
        {
          name: "Paket Wisata Alam 2 Hari",
          description: "Menikmati alam dan pegunungan.",
          imageUrl: "/globe.svg",
          itinerary: {
            schedule: ["Hari 1: Air Terjun", "Hari 2: Danau & Perkebunan"],
          },
          price: 1500000,
          duration: "2 Hari",
        },
      ],
    });
  }

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

  console.log(
    "Seed complete: users, cars (+images +tariffs), tour packages, FAQ, terms, partners"
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
