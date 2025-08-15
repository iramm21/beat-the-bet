"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { roundsBulkSchema } from "../schemas/seasonSchema";

export type RoundsBulkState = {
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

export async function createRoundsBulkAction(
  _prev: RoundsBulkState | undefined,
  formData: FormData
): Promise<RoundsBulkState> {
  try {
    const { seasonId, count, baseName } = roundsBulkSchema.parse({
      seasonId: formData.get("seasonId"),
      count: formData.get("count"),
      baseName: (formData.get("baseName") || "Round").toString(),
    });

    const data = Array.from({ length: count }, (_, i) => ({
      seasonId,
      number: i + 1,
      name: `${baseName} ${i + 1}`,
    }));

    // createMany with skipDuplicates avoids crashing if some rounds already exist
    await prisma.round.createMany({
      data,
      skipDuplicates: true,
    });

    revalidatePath(`/dashboard/admin/seasons/${seasonId}`);
    return { ok: true, message: `Created up to ${count} rounds` };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return {
        ok: false,
        message: "Validation error",
        fieldErrors: toFieldErrors(err),
      };
    }

    console.error(err);
    return { ok: false, message: "Unexpected error" };
  }
}
