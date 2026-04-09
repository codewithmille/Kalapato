"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Calculates the Haversine distance between two points on the Earth.
 * Returns distance in kilometers.
 */
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function recordArrival(registrationId: string, arrivalTime: Date) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Authentication required" };
  }

  try {
    // 1. Fetch Registration and related Event/Bird/User data
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        bird: true,
        user: true,
      },
    });

    if (!registration) {
      return { error: "Registration record not found." };
    }

    // 2. Determine Distance (Use saved distance or calculate it)
    let distance = registration.distance;
    if (!distance) {
      // Release point coordinates
      const releaseLat = registration.event.releaseLat;
      const releaseLon = registration.event.releaseLon;
      
      // Loft coordinates (Priority: Bird's loft coordinates, Fallback: User's profile coordinates)
      const loftLat = registration.bird.loftLat || registration.user.latitude;
      const loftLon = registration.bird.loftLon || registration.user.longitude;

      if (loftLat === null || loftLon === null) {
        return { error: "Loft coordinates missing. Please update profile or bird data." };
      }

      distance = calculateHaversineDistance(releaseLat, releaseLon, loftLat, loftLon);
      
      // Update registration with calculated distance
      await prisma.registration.update({
        where: { id: registrationId },
        data: { distance },
      });
    }

    // 3. Calculate Performance Metrics
    const releaseTime = new Date(registration.event.releaseDateTime);
    const arrival = new Date(arrivalTime);
    
    // Flight time in minutes
    const flightTimeMs = arrival.getTime() - releaseTime.getTime();
    if (flightTimeMs <= 0) {
      return { error: "Arrival time cannot be before or at release time." };
    }
    
    const flightTimeMinutes = flightTimeMs / (1000 * 60);
    
    // Speed in m/min: (Distance in KM * 1000) / Time in Minutes
    const speed = (distance * 1000) / flightTimeMinutes;

    // 4. Create Arrival Log
    const log = await prisma.arrivalLog.create({
      data: {
        registrationId,
        arrivalTime: arrival,
        speed,
        flightTime: flightTimeMinutes,
        status: speed >= (registration.event.minSpeed || 0) ? "QUALIFIED" : "OUT_OF_TIME",
      },
    });

    revalidatePath("/ronda");
    revalidatePath("/dashboard");
    revalidatePath(`/events/${registration.eventId}`);

    return { success: true, log };
  } catch (error) {
    console.error("Arrival record error:", error);
    return { error: "Failed to log arrival telemetry." };
  }
}

export async function getUserRegistrations() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Authentication required" };
  }

  try {
    const registrations = await prisma.registration.findMany({
      where: {
        user: { email: session.user.email },
        event: { status: "ACTIVE" },
      },
      include: {
        event: true,
        bird: true,
        arrivalLog: true,
      },
    });

    return { success: true, registrations: JSON.parse(JSON.stringify(registrations)) };
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return { error: "Failed to retrieve unit registrations." };
  }
}

export async function getRecentArrivalLogs() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Authentication required" };
  }

  try {
    const logs = await prisma.arrivalLog.findMany({
      where: {
        registration: {
          user: { email: session.user.email }
        }
      },
      include: {
        registration: {
          include: {
            bird: true,
            event: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    return { success: true, logs: JSON.parse(JSON.stringify(logs)) };
  } catch (error) {
    console.error("Fetch logs error:", error);
    return { error: "Failed to retrieve recent mission telemetry." };
  }
}

export async function updateArrivalLog(logId: string, newArrivalTime: Date) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Authentication required" };
  }

  try {
    const log = await prisma.arrivalLog.findUnique({
      where: { id: logId },
      include: {
        registration: {
          include: {
            event: true,
            bird: true,
            user: true
          }
        }
      }
    });

    if (!log) return { error: "Log record not found." };

    const distance = log.registration.distance || 0;
    const releaseTime = new Date(log.registration.event.releaseDateTime);
    const arrival = new Date(newArrivalTime);
    
    const flightTimeMs = arrival.getTime() - releaseTime.getTime();
    if (flightTimeMs <= 0) return { error: "Arrival time invalid." };
    
    const flightTimeMinutes = flightTimeMs / (1000 * 60);
    const speed = (distance * 1000) / flightTimeMinutes;

    const updatedLog = await prisma.arrivalLog.update({
      where: { id: logId },
      data: {
        arrivalTime: arrival,
        speed,
        flightTime: flightTimeMinutes,
        status: speed >= (log.registration.event.minSpeed || 0) ? "QUALIFIED" : "OUT_OF_TIME",
      }
    });

    revalidatePath("/ronda");
    return { success: true, log: JSON.parse(JSON.stringify(updatedLog)) };
  } catch (error) {
    console.error("Update log error:", error);
    return { error: "Failed to override mission data." };
  }
}

export async function deleteArrivalLog(logId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Authentication required" };
  }

  try {
    await prisma.arrivalLog.delete({
      where: { id: logId }
    });

    revalidatePath("/ronda");
    return { success: true };
  } catch (error) {
    console.error("Delete log error:", error);
    return { error: "Failed to abort telemetry log." };
  }
}
