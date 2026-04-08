import { prisma } from "./prisma";

async function test() {
  try {
    console.log("Fetching events...");
    const events = await prisma.event.findMany({
      include: { club: true }
    });
    console.log("Success! Events found:", events.length);
    process.exit(0);
  } catch (error) {
    console.error("DEBUG_ERROR:", error);
    process.exit(1);
  }
}

test();
