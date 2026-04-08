"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEventAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const clubName = formData.get("clubName") as string;
    const description = formData.get("description") as string;
    const releaseLocationName = formData.get("releaseLocationName") as string;
    const releaseLat = parseFloat(formData.get("releaseLat") as string);
    const releaseLon = parseFloat(formData.get("releaseLon") as string);
    const releaseDateTime = new Date(formData.get("releaseDateTime") as string);
    const registrationDeadline = new Date(formData.get("registrationDeadline") as string);
    const minSpeed = parseFloat(formData.get("minSpeed") as string || "700");
    const lapType = formData.get("lapType") as string;
    const poolingAmounts = formData.get("poolingAmounts") as string;

    // 1. Find or create club
    const club = await prisma.club.upsert({
      where: { name: clubName }, // Assuming club names are unique for this demo
      update: {},
      create: {
        name: clubName
      }
    });

    // 2. Create Event
    await prisma.event.create({
      data: {
        name,
        clubId: club.id,
        description,
        releaseLocationName,
        releaseLat,
        releaseLon,
        releaseDateTime,
        registrationDeadline,
        minSpeed,
        lapType,
        status: "ACTIVE",
        poolingAmounts
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/events");
  } catch (error) {
    console.error("Event creation error:", error);
    return { error: "Failed to create event." };
  }
  
  redirect("/dashboard");
}
