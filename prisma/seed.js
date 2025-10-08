// Simple seed script to populate minimal data
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Upsert a demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { email: "demo@example.com", name: "Demo User" },
  });

  // Create some cars if none
  const existingCars = await prisma.car.count();
  if (existingCars === 0) {
    await prisma.car.createMany({
      data: [
        {
          make: "Toyota",
          model: "Avanza",
          plateNumber: "B 1234 ABC",
          dailyRateCents: 3500000,
        },
        {
          make: "Honda",
          model: "Brio",
          plateNumber: "B 5678 DEF",
          dailyRateCents: 3000000,
        },
        {
          make: "Suzuki",
          model: "Ertiga",
          plateNumber: "B 9012 GHI",
          dailyRateCents: 4000000,
        },
      ],
    });
  }

  // Create a sample booking if none
  const existingBookings = await prisma.booking.count();
  if (existingBookings === 0) {
    const car = await prisma.car.findFirst();
    if (car) {
      await prisma.booking.create({
        data: {
          userId: user.id,
          carId: car.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          totalCents: car.dailyRateCents * 2,
          status: "CONFIRMED",
        },
      });
    }
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
