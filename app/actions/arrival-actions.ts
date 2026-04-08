"use server";

import { prisma } from "@/lib/prisma";
import { calculateSpeed } from "@/lib/calculator";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function logArrivalAction(
  formData: FormData,
  registrationId: string,
  eventId: string
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Personnel clearance required.");

    const arrivalTimeStr = formData.get("arrivalTime") as string;
    const arrivalTime = new Date(arrivalTimeStr);

    // 1. Get Registration and Event info, verified by userId
    const registration = await prisma.registration.findFirst({
      where: { 
        id: registrationId,
        userId: (session.user as any).id
      },
      include: {
        event: true,
      },
    });

    if (!registration) throw new Error("Registration not found or unauthorized access.");

    if (!registration.distance) throw new Error("Distance not calculated for this bird");

    const releaseTime = new Date(registration.event.releaseDateTime);

    // 2. Calculate Speed
    const speed = calculateSpeed(
      registration.distance,
      releaseTime,
      arrivalTime
    );

    // 3. Calculate flight time in minutes
    const flightTime = (arrivalTime.getTime() - releaseTime.getTime()) / 60000;

    // 4. Determine status
    const status = speed >= registration.event.minSpeed ? "QUALIFIED" : "DISQUALIFIED";

    // 5. Create Arrival Log
    await prisma.arrivalLog.upsert({
      where: { registrationId },
      update: {
        arrivalTime,
        speed,
        flightTime,
        status,
      },
      create: {
        registrationId,
        arrivalTime,
        speed,
        flightTime,
        status,
      },
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Arrival logging error:", error);
    return { success: false, error: error.message };
  }
}
