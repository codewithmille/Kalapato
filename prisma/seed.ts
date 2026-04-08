import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@kalapato.ph" },
    update: {},
    create: {
      email: "admin@kalapato.ph",
      name: "Kalapato Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create Member User
  const memberPassword = await bcrypt.hash("member123", 10);
  const member = await prisma.user.upsert({
    where: { email: "fancier@kalapato.ph" },
    update: {},
    create: {
      email: "fancier@kalapato.ph",
      name: "Juan Dela Cruz",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  // Create Club
  let club = await prisma.club.findFirst({
    where: { name: "Pili Pigeon Fancier's Club Inc." },
  });

  if (!club) {
    club = await prisma.club.create({
      data: {
        name: "Pili Pigeon Fancier's Club Inc.",
        description: "Premier pigeon racing club in Pili, Camarines Sur.",
      },
    });
  }

  // Create Events
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
      poolingAmounts: "20, 50, 100",
    },
  });

  await prisma.event.create({
    data: {
      name: "PEPITA PARK SDR 2026",
      clubId: club.id,
      description: "Short Distance Race from Pepita Park.",
      releaseLocationName: "Pepita Park Sorsogon",
      releaseLat: 12.9734,
      releaseLon: 124.0044,
      releaseDateTime: new Date("2026-04-05T06:00:00"),
      registrationDeadline: new Date("2026-04-04T18:00:00"),
      minSpeed: 700,
      status: "DONE",
      lapType: "Sprint",
    },
  });

  // Create Birds for Member
  await prisma.bird.create({
    data: {
      bandNumber: "PHI-2025-123456",
      color: "Blue Bar",
      sex: "Cock",
      ownerId: member.id,
      loftLat: 13.5941,
      loftLon: 123.2977, // Pili, CamSur
    },
  });

  await prisma.bird.create({
    data: {
      bandNumber: "PHI-2025-789012",
      color: "Red Checker",
      sex: "Hen",
      ownerId: member.id,
      loftLat: 13.5941,
      loftLon: 123.2977,
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
