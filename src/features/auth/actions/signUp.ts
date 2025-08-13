"use server";

import { z } from "zod";
import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import { createProfile } from "@/features/profile/actions/createProfile";
import type { ProfileInput } from "@/features/profile/schemas/profileSchema";

/** Sign-up form schema */
const SignUpSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpResult =
  | { ok: true }
  | { ok: false; error: string; errors?: unknown };

/**
 * Server Action:
 * 1) Validates inputs
 * 2) Supabase signUp
 * 3) Creates minimal Profile linked to the new user
 */
export async function signUpAction(formData: FormData): Promise<SignUpResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = SignUpSchema.safeParse(raw);
  if (!parsed.success) {
    // Use treeifyError (new API) but also return a user-friendly string
    const tree = z.treeifyError(parsed.error);
    const flat = parsed.error.flatten().fieldErrors; // not used for types, just to pick a simple message
    const msg = flat.email?.[0] ?? flat.password?.[0] ?? "Invalid form data";
    return { ok: false, error: msg, errors: tree };
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/dashboard`,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const user = data.user;
  if (user) {
    // Build minimal profile payload; username auto-generated in createProfile
    const payload: ProfileInput = {
      userId: user.id,
      email: user.email ?? parsed.data.email,
    };

    const res = await createProfile(payload);
    if (!res.success) {
      // Don’t block sign-up if profile creation fails, but surface a message
      return {
        ok: false,
        error: "Account created, but failed to create profile.",
        errors: res.errors,
      };
    }
  }

  return { ok: true };
}
