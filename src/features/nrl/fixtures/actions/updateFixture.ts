"use server";

import { z } from "zod";
import { Prisma, FixtureStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { fixtureUpdateSchema } from "../schemas/fixtureSchema";

export type UpdateFixtureState = {
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

export async function updateFixtureAction(
  _prev: UpdateFixtureState | undefined,
  formData: FormData
): Promise<UpdateFixtureState> {
  try {
    const input = fixtureUpdateSchema.parse({
      id: formData.get("id"),
      roundId: formData.get("roundId"),
      seasonId: formData.get("seasonId"),
      homeTeamId: formData.get("homeTeamId"),
      awayTeamId: formData.get("awayTeamId"),
      startsAtISO: formData.get("startsAtISO"),
      venue: (formData.get("venue") as string) || undefined,
      status:
        (formData.get("status") as FixtureStatus) || FixtureStatus.SCHEDULED,
    });

    const startsAt = new Date(input.startsAtISO);

    await prisma.fixture.update({
      where: { id: input.id },
      data: {
        seasonId: input.seasonId,
        roundId: input.roundId,
        startsAt,
        status: input.status,
        homeTeamId: input.homeTeamId,
        awayTeamId: input.awayTeamId,
        venue: input.venue ?? null,
      },
    });

    revalidatePath(`/dashboard/admin/rounds/${input.roundId}/fixtures`);
    revalidatePath(`/dashboard/admin/seasons/${input.seasonId}`);
    return { ok: true, message: "Fixture updated" };
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
        return {
          ok: false,
          message:
            "Another fixture already has these teams and kickoff this season",
          fieldErrors: { _form: ["Duplicate fixture"] },
        };
      }
      if (err.code === "P2025") {
        return { ok: false, message: "Fixture not found" };
      }
    }

    console.error(err);
    return { ok: false, message: "Unexpected error" };
  }
}
