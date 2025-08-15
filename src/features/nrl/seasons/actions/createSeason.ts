"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { seasonSchema } from "../schemas/seasonSchema";

export type SeasonActionState = {
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

export async function createSeasonAction(
  _prev: SeasonActionState | undefined,
  formData: FormData
): Promise<SeasonActionState> {
  try {
    const { year } = seasonSchema.parse({ year: formData.get("year") });

    // Ensure the NRL league exists (key "NRL")
    const league = await prisma.league.upsert({
      where: { key: "NRL" },
      update: {},
      create: { key: "NRL", name: "National Rugby League" },
    });

    await prisma.season.create({
      data: {
        leagueId: league.id,
        year,
      },
    });

    revalidatePath("/dashboard/admin/seasons");
    return { ok: true, message: "Season created" };
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
        // unique([leagueId, year])
        return { ok: false, message: "Season for this year already exists" };
      }
    }
    console.error(err);
    return { ok: false, message: "Unexpected error" };
  }
}
