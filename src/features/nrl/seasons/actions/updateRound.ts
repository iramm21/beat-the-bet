"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { roundUpdateSchema } from "../schemas/seasonSchema";

export type RoundActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

function toFieldErrors(err: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && key.length > 0)
      (out[key] ??= []).push(issue.message);
    else (out["_form"] ??= []).push(issue.message);
  }
  return out;
}

export async function updateRoundAction(
  _prev: RoundActionState | undefined,
  formData: FormData
): Promise<RoundActionState> {
  try {
    const parsed = roundUpdateSchema.parse({
      id: formData.get("id"),
      number: formData.get("number"),
      name: formData.get("name") || undefined,
    });

    const updated = await prisma.round.update({
      where: { id: parsed.id },
      data: {
        number: parsed.number,
        name: parsed.name ?? null,
      },
      select: { seasonId: true },
    });

    revalidatePath(`/dashboard/admin/seasons/${updated.seasonId}`);
    return { ok: true, message: "Round updated" };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return {
        ok: false,
        message: "Validation error",
        fieldErrors: toFieldErrors(err),
      };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        // unique([seasonId, number]) conflict
        return { ok: false, message: "Another round already has this number" };
      }
      if (err.code === "P2025") {
        return { ok: false, message: "Round not found" };
      }
    }

    console.error(err);
    return { ok: false, message: "Unexpected error" };
  }
}
