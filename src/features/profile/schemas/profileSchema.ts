import { z } from "zod";

/**
 * Profile creation schema
 * - Only `userId`, `email` are required
 * - `username` is optional (we auto-generate if missing)
 * - Names & other fields are optional
 */
export const profileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
  avatarUrl: z.string().url("Invalid URL").optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
