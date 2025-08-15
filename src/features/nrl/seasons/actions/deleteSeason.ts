"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSeasonAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") return;

  await prisma.season.delete({ where: { id } });
  revalidatePath("/dashboard/admin/seasons");
}
