import { z } from "zod";

export const seasonSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .gte(1900, "Year too small")
    .lte(3000, "Year too large"),
});

export const roundsBulkSchema = z.object({
  seasonId: z.cuid(),
  count: z.coerce.number().int().min(1).max(40),
  baseName: z.string().trim().min(1).max(40).default("Round"),
});

export const roundUpdateSchema = z.object({
  id: z.cuid(),
  number: z.coerce.number().int().min(1).max(200),
  name: z.string().trim().min(1).max(80).optional(),
});
