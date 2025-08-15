"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteFixtureAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") return;

  const deleted = await prisma.fixture.delete({
    where: { id },
    select: { roundId: true, seasonId: true },
  });

  revalidatePath(`/dashboard/admin/rounds/${deleted.roundId}/fixtures`);
  revalidatePath(`/dashboard/admin/seasons/${deleted.seasonId}`);
}
