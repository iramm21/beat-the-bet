"use client";

import { SidebarLink } from "../ui/sidebar-link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Role } from "@/types/role";
type ProfileForUI = {
  email?: string | null;
  username?: string | null;
  role?: Role | null;
};

export function Sidebar({ profile }: { profile: ProfileForUI }) {
  const username = profile?.username ?? "User";
  const email = profile?.email ?? "";
  const role: Role = (profile?.role as Role) ?? "USER";

  const mainLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/settings", label: "Settings" },
  ] as const;

  const adminLinks = [
    { href: "/dashboard/admin/users", label: "User Management" },
    { href: "/dashboard/admin/reports", label: "Reports" },
  ] as const;

  const initials =
    (username && username.trim()[0]) || (email && email.trim()[0]) || "U";

  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      {/* Profile block */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {/* If you add avatarUrl later, put <AvatarImage src={...} /> here */}
            <AvatarFallback className="font-semibold">
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">{username}</span>
              {role === "ADMIN" && <Badge variant="destructive">Admin</Badge>}
            </div>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <div className="px-2 pb-1 pt-2 text-xs font-semibold uppercase text-muted-foreground">
          General
        </div>
        {mainLinks.map((link) => (
          <SidebarLink key={link.href} href={link.href} label={link.label} />
        ))}

        {role === "ADMIN" && (
          <>
            <div className="mt-4 px-2 pb-1 pt-2 text-xs font-semibold uppercase text-muted-foreground">
              Admin
            </div>
            {adminLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                label={link.label}
              />
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
