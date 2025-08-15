"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteRoundAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") return;

  const deleted = await prisma.round.delete({
    where: { id },
    select: { seasonId: true },
  });

  revalidatePath(`/dashboard/admin/seasons/${deleted.seasonId}`);
}
