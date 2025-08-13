"use server";

import { prisma } from "@/lib/prisma";
import {
  profileSchema,
  type ProfileInput,
} from "@/features/profile/schemas/profileSchema";
import { z } from "zod";

/**
 * Creates a Profile row linked to the auth user.
 * - Auto-generates `username` if not provided
 * - Omits truly optional fields
 */
export async function createProfile(data: ProfileInput) {
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: z.treeifyError(parsed.error) };
  }

  const d = parsed.data;

  try {
    const profile = await prisma.profile.create({
      data: {
        userId: d.userId,
        email: d.email, // Prisma requires non-null string
        username: d.username ?? `user_${d.userId.slice(0, 8)}`,
        firstName: d.firstName ?? undefined,
        lastName: d.lastName ?? undefined,
        bio: d.bio ?? undefined,
        avatarUrl: d.avatarUrl ?? undefined,
        role: d.role ?? "USER",
      },
    });

    return { success: true, data: profile };
  } catch (err) {
    console.error(err);
    return { success: false, errors: { _form: ["Failed to create profile"] } };
  }
}
