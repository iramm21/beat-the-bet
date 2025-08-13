import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UserMenu } from "./user-menu";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() (slightly heavier). Claims are fine for email.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user?.sub) {
    // Not signed in
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant="default">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  // Fetch role from your Profile table
  const profile = await prisma.profile.findUnique({
    where: { userId: user.sub as string },
    select: { role: true, email: true },
  });

  // Prefer DB email if present; fallback to claims.email
  const email = profile?.email ?? (user.email as string) ?? "Account";
  const role = (profile?.role as "USER" | "ADMIN") ?? "USER";

  return <UserMenu email={email} role={role} />;
}
