// Minimal seed script: only create admin and owner users
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function hashPassword(pwd) {
  const SALT_ROUNDS = 12;
  return await bcrypt.hash(pwd, SALT_ROUNDS);
}

async function main() {
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

  console.log("Seed complete: users created/updated");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
