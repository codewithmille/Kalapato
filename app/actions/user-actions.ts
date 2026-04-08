"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfileCoordinates(lat: number, lon: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Authentication required" };
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        latitude: lat,
        longitude: lon,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update pilot coordinates." };
  }
}
