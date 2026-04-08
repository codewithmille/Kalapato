"use server";

import { prisma } from "@/lib/prisma";
import { haversineDistance } from "@/lib/calculator";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function registerBirdAction(formData: FormData, eventId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Personnel authentication required for unit registration.");

    const bandNumber = formData.get("bandNumber") as string;
    const color = formData.get("color") as string;
    const sex = formData.get("sex") as string;
    const loftLat = parseFloat(formData.get("loftLat") as string);
    const loftLon = parseFloat(formData.get("loftLon") as string);
    
    // 1. Get Event to get release coordinates
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new Error("Event not found");

    // 2. Use the actual logged-in user from the session
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (!user) throw new Error("User profile not found in database.");

    // 3. Create or find Bird
    const bird = await prisma.bird.upsert({
      where: { bandNumber },
      update: {
        color,
        sex,
        loftLat,
        loftLon,
      },
      create: {
        bandNumber,
        color,
        sex,
        loftLat,
        loftLon,
        ownerId: user.id,
      },
    });

    // 4. Calculate Distance
    const distance = haversineDistance(
      event.releaseLat,
      event.releaseLon,
      loftLat,
      loftLon
    );

    // 5. Create Registration
    await prisma.registration.create({
      data: {
        eventId,
        birdId: bird.id,
        userId: user.id,
        distance,
      },
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
}
