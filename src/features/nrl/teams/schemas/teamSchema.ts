import { z } from "zod";

export const teamSchema = z.object({
  id: z.cuid().optional(),
  code: z
    .string()
    .min(2, "Code is too short")
    .max(10, "Code is too long")
    .regex(/^[A-Z0-9_-]+$/, "Use A–Z, 0–9, _ or -")
    .transform((s) => s.toUpperCase().trim()),
  name: z.string().min(2, "Name is too short").trim(),
  shortName: z
    .string()
    .max(30, "Short name too long")
    .optional()
    .transform((v) => (v ? v.trim() : v)),
  homeVenue: z
    .string()
    .max(100, "Venue too long")
    .optional()
    .transform((v) => (v ? v.trim() : v)),
});

export type TeamInput = z.infer<typeof teamSchema>;
