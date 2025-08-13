"use client";

import { UserMenu } from "@/features/auth/components/user-menu";
import { Badge } from "@/components/ui/badge";

type Role = "USER" | "ADMIN";
type ProfileForUI = {
  email?: string | null;
  username?: string | null;
  role?: Role | null;
};

export function Header({ profile }: { profile: ProfileForUI }) {
  const email = profile?.email ?? "Account";
  const role: Role = (profile?.role as Role) ?? "USER";

  return (
    <header className="border-b bg-background p-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          {role === "ADMIN" && <Badge variant="destructive">Admin</Badge>}
        </div>

        <div className="flex items-center gap-4">
          {/* Space for search/quick actions later */}
          <UserMenu email={email} role={role} />
        </div>
      </div>
    </header>
  );
}
