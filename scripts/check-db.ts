import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- USERS ---");
  const users = await prisma.user.findMany();
  console.log(JSON.stringify(users, null, 2));

  console.log("\n--- REGISTRATIONS ---");
  const registrations = await prisma.registration.findMany({
    include: {
      user: true,
      bird: true
    }
  });
  console.log(JSON.stringify(registrations, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
