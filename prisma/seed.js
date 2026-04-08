const { PrismaClient } = require("@prisma/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const libsql = createClient({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@antigravity.ph" },
    update: {},
    create: {
      email: "admin@antigravity.ph",
      name: "Club Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const club = await prisma.club.create({
    data: {
      name: "Pili Pigeon Fancier's Club Inc.",
      description: "Premier pigeon racing club in Pili, Camarines Sur.",
    },
  });

  await prisma.event.create({
    data: {
      name: "CASIGURAN SDR 2026",
      clubId: club.id,
      description: "Short Distance Race from Casiguran.",
      releaseLocationName: "Casiguran Sorsogon",
      releaseLat: 12.8719,
      releaseLon: 124.0133,
      releaseDateTime: new Date("2026-04-10T06:00:00"),
      registrationDeadline: new Date("2026-04-09T18:00:00"),
      minSpeed: 700,
      status: "ACTIVE",
      lapType: "Open",
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
