"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { teamSchema } from "../schemas/teamSchema";

export type TeamActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const updateSchema = teamSchema.extend({
  id: z.string().cuid(),
});

// Convert Zod issues -> { [field]: string[] }
function toFieldErrors(err: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && key.length > 0) {
      (out[key] ??= []).push(issue.message);
    } else {
      (out["_form"] ??= []).push(issue.message);
    }
  }
  return out;
}

export async function updateTeamAction(
  _prev: TeamActionState | undefined,
  formData: FormData
): Promise<TeamActionState> {
  try {
    const parsed = updateSchema.parse({
      id: formData.get("id"),
      code: formData.get("code"),
      name: formData.get("name"),
      shortName: formData.get("shortName") || undefined,
      homeVenue: formData.get("homeVenue") || undefined,
    });

    await prisma.team.update({
      where: { id: parsed.id },
      data: {
        code: parsed.code,
        name: parsed.name,
        shortName: parsed.shortName ?? null,
        homeVenue: parsed.homeVenue ?? null,
      },
    });

    revalidatePath("/dashboard/admin/teams");
    revalidatePath(`/dashboard/admin/teams/${parsed.id}`);
    return { ok: true, message: "Team updated" };
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
        const target = (err.meta?.target as string[] | undefined) ?? [];
        const fieldErrors: Record<string, string[]> = {};
        if (target.includes("code")) fieldErrors.code = ["Code must be unique"];
        return { ok: false, message: "Unique constraint failed", fieldErrors };
      }
      if (err.code === "P2025") {
        return { ok: false, message: "Team not found" };
      }
    }

    console.error(err);
    return { ok: false, message: "Unexpected error" };
  }
}
