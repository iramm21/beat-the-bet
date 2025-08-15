"use server";

import { z } from "zod";
import { Prisma, FixtureStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { fixtureCreateSchema } from "../schemas/fixtureSchema";

export type CreateFixtureState = {
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

export async function createGameAction(
  _prev: CreateFixtureState | undefined,
  formData: FormData
): Promise<CreateFixtureState> {
  try {
    const input = fixtureCreateSchema.parse({
      roundId: formData.get("roundId"),
      seasonId: formData.get("seasonId") || undefined,
      homeTeamId: formData.get("homeTeamId"),
      awayTeamId: formData.get("awayTeamId"),
      startsAtISO: formData.get("startsAtISO"),
      venue: formData.get("venue") || undefined,
      status: (formData.get("status") as FixtureStatus | null) ?? undefined,
    });

    // Derive seasonId from round if not provided
    const round = await prisma.round.findUnique({
      where: { id: input.roundId },
      select: { seasonId: true },
    });
    if (!round) {
      return {
        ok: false,
        message: "Round not found",
        fieldErrors: { roundId: ["Invalid round"] },
      };
    }
    const seasonId = input.seasonId ?? round.seasonId;

    const startsAt = new Date(input.startsAtISO);

    await prisma.fixture.create({
      data: {
        seasonId,
        roundId: input.roundId,
        startsAt,
        status: input.status ?? FixtureStatus.SCHEDULED,
        homeTeamId: input.homeTeamId,
        awayTeamId: input.awayTeamId,
        venue: input.venue ?? null,
      },
    });

    revalidatePath(`/dashboard/admin/rounds/${input.roundId}/fixtures`);
    revalidatePath(`/dashboard/admin/seasons/${seasonId}`);
    return { ok: true, message: "Fixture created" };
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
        // unique([seasonId, homeTeamId, awayTeamId, startsAt])
        return {
          ok: false,
          message:
            "A fixture with these teams and kickoff already exists this season",
          fieldErrors: { _form: ["Duplicate fixture"] },
        };
      }
    }

    console.error(err);
    return { ok: false, message: "Unexpected error" };
  }
}
