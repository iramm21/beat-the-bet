import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type {
  CurrentProfile,
  Role,
} from "@/components/providers/current-user-context";

export async function getCurrentProfile(): Promise<CurrentProfile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const db = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { userId: true, email: true, username: true, role: true },
  });

  return {
    userId: user.id,
    email: db?.email ?? user.email ?? null,
    username: db?.username ?? null,
    role: (db?.role as Role) ?? "USER",
  };
}
