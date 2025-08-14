"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Use helpers that are supported in your build.
// Avoid z.datetime() (not available in your setup).
const createGameSchema = z.object({
  roundId: z.cuid(),
  homeTeamId: z.cuid(),
  awayTeamId: z.cuid(),
  startsAtISO: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "Invalid datetime",
  }),
  venue: z.string().trim().optional().nullable(),
});

export type CreateGameState = {
  ok: boolean;
  message?: string;
  // Allow undefined in values returned by zod's .flatten().fieldErrors
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createGameAction(
  _prevState: CreateGameState | undefined,
  formData: FormData
): Promise<CreateGameState> {
  const raw = {
    roundId: String(formData.get("roundId") ?? ""),
    homeTeamId: String(formData.get("homeTeamId") ?? ""),
    awayTeamId: String(formData.get("awayTeamId") ?? ""),
    startsAtISO: String(formData.get("startsAtISO") ?? ""),
    venue: (formData.get("venue") as string) || undefined,
  };

  const parsed = createGameSchema.safeParse(raw);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return {
      ok: false,
      message: "Please fix the highlighted errors.",
      fieldErrors: flattened.fieldErrors as Record<
        string,
        string[] | undefined
      >,
    };
  }

  const { roundId, homeTeamId, awayTeamId, startsAtISO, venue } = parsed.data;

  if (homeTeamId === awayTeamId) {
    return {
      ok: false,
      message: "Home and away teams must be different.",
      fieldErrors: { awayTeamId: ["Choose a different away team."] },
    };
  }

  // Look up season via the selected round
  const round = await prisma.round.findUnique({
    where: { id: roundId },
    select: { id: true, seasonId: true },
  });

  if (!round) {
    return { ok: false, message: "Round not found." };
  }

  const startsAt = new Date(startsAtISO); // treat as UTC ISO

  try {
    await prisma.fixture.create({
      data: {
        seasonId: round.seasonId,
        roundId: round.id,
        startsAt,
        homeTeamId,
        awayTeamId,
        venue: venue ?? null,
      },
    });

    return { ok: true, message: "Game created." };
  } catch (err: unknown) {
    // Handle unique constraint (duplicate game/time) gracefully
    const code =
      err instanceof Prisma.PrismaClientKnownRequestError ? err.code : undefined;
    if (code === "P2002") {
      return {
        ok: false,
        message: "A fixture with these teams and kickoff already exists.",
      };
    }
    console.error("createGameAction error:", err);
    return { ok: false, message: "Failed to create game. Try again." };
  }
}
