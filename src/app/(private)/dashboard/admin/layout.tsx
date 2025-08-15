export const runtime = "nodejs";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
// Use your existing server helper (async is fine)
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Get the logged-in user via your server helper (no cookie typing in here)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/dashboard/admin");
  }

  // Admin check via Prisma (Node runtime)
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { role: true },
  });

  if (profile?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
