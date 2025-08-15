import { z } from "zod";
import { FixtureStatus } from "@prisma/client";

const isoDateString = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid date/time",
  });

export const fixtureCreateSchema = z
  .object({
    roundId: z.cuid(),
    seasonId: z.cuid().optional(), // will be derived from round if not set
    homeTeamId: z.cuid(),
    awayTeamId: z.cuid(),
    startsAtISO: isoDateString,
    venue: z.string().trim().max(100, "Venue too long").optional(),
    status: z.enum(FixtureStatus).optional(), // default SCHEDULED
  })
  .superRefine((val, ctx) => {
    if (val.homeTeamId === val.awayTeamId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["awayTeamId"],
        message: "Home and away teams must be different",
      });
    }
  });

export const fixtureUpdateSchema = z.object({
  id: z.cuid(),
  roundId: z.cuid(),
  seasonId: z.cuid(),
  homeTeamId: z.cuid(),
  awayTeamId: z.cuid(),
  startsAtISO: isoDateString,
  venue: z.string().trim().max(100).nullable().optional(),
  status: z.enum(FixtureStatus),
});
