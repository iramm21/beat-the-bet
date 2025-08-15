"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarLink } from "../ui/sidebar-link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Role } from "@/types/role";
import {
  ChevronDown,
  LayoutDashboard,
  Users,
  Shield,
  Gamepad2,
  Newspaper,
  ImageIcon,
  Database,
  Group,
  BarChart3,
  Wrench,
  Flag,
  Plus,
} from "lucide-react";

type ProfileForUI = {
  email?: string | null;
  username?: string | null;
  role?: Role | null;
};

type Leaf = { href: string; label: string };
type Section = {
  id: string;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  items: Leaf[];
  cta?: {
    href: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  defaultOpen?: boolean;
};

export function Sidebar({ profile }: { profile: ProfileForUI }) {
  const pathname = usePathname();
  const username = profile?.username ?? "User";
  const email = profile?.email ?? "";
  const role: Role = (profile?.role as Role) ?? "USER";
  const initials =
    (username && username.trim()[0]) || (email && email.trim()[0]) || "U";

  const generalSections: Section[] = useMemo(
    () => [
      {
        id: "general",
        icon: LayoutDashboard,
        label: "General",
        items: [
          { href: "/dashboard", label: "Overview" },
          { href: "/dashboard/profile", label: "Profile" },
          { href: "/dashboard/settings", label: "Settings" },
        ],
        defaultOpen: true,
      },
    ],
    []
  );

  const adminSections: Section[] = useMemo(
    () => [
      {
        id: "games",
        icon: Gamepad2,
        label: "Games",
        items: [
          { href: "/dashboard/admin/games", label: "Manage Games" },
          { href: "/dashboard/admin/games/results", label: "Results" },
          { href: "/dashboard/admin/games/fixtures", label: "Fixtures" },
          { href: "/dashboard/admin/games/markets", label: "Markets" },
        ],
        cta: {
          href: "/dashboard/admin/games/new",
          label: "New Game",
          icon: Plus,
        },
        defaultOpen: true,
      },
      {
        id: "teams",
        icon: Group,
        label: "Teams",
        items: [
          { href: "/dashboard/admin/teams", label: "Manage Teams" },

        ],
        cta: {
          href: "/dashboard/admin/teams/new",
          label: "New Team",
          icon: Plus,
        },
        defaultOpen: true,
      },
      {
        id: "users",
        icon: Users,
        label: "Users",
        items: [
          { href: "/dashboard/admin/users", label: "User Management" },
          {
            href: "/dashboard/admin/users/roles",
            label: "Roles & Permissions",
          },
        ],
      },
      {
        id: "content",
        icon: Newspaper,
        label: "Content",
        items: [
          { href: "/dashboard/admin/content/news", label: "News Posts" },
          {
            href: "/dashboard/admin/content/banners",
            label: "Banners & Promo",
          },
          { href: "/dashboard/admin/content/media", label: "Media Library" },
        ],
      },
      {
        id: "data",
        icon: Database,
        label: "Data",
        items: [
          { href: "/dashboard/admin/data/imports", label: "Imports" },
          { href: "/dashboard/admin/data/exports", label: "Exports" },
          { href: "/dashboard/admin/data/backups", label: "Backups" },
        ],
      },
      {
        id: "reports",
        icon: BarChart3,
        label: "Reports",
        items: [
          { href: "/dashboard/admin/reports", label: "Overview" },
          { href: "/dashboard/admin/reports/logs", label: "Transaction Logs" },
          {
            href: "/dashboard/admin/reports/user-activity",
            label: "User Activity",
          },
        ],
      },
      {
        id: "system",
        icon: Wrench,
        label: "System",
        items: [
          { href: "/dashboard/admin/system/flags", label: "Feature Flags" },
          { href: "/dashboard/admin/system/settings", label: "Site Settings" },
          { href: "/dashboard/admin/system/security", label: "Security" },
        ],
      },
    ],
    []
  );

  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      {/* Profile */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
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
        {generalSections.map((section) => (
          <CollapsibleSection
            key={section.id}
            section={section}
            pathname={pathname}
          />
        ))}

        {role === "ADMIN" && (
          <>
            <div className="mt-3 px-2 pb-1 pt-2 text-xs font-semibold uppercase text-muted-foreground">
              Admin
            </div>
            {adminSections.map((section) => (
              <CollapsibleSection
                key={section.id}
                section={section}
                pathname={pathname}
              />
            ))}
          </>
        )}
      </nav>

      {/* Helpful quick links (optional) */}
      <div className="border-t p-3 text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" />
          <span>Need elevated access? Ask an admin.</span>
        </div>
        <div className="flex items-center gap-2">
          <ImageIcon className="h-3.5 w-3.5" />
          <Link
            href="/dashboard/admin/content/media"
            className="hover:underline"
          >
            Upload media
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Flag className="h-3.5 w-3.5" />
          <Link
            href="/dashboard/admin/system/flags"
            className="hover:underline"
          >
            Toggle feature flags
          </Link>
        </div>
      </div>
    </aside>
  );
}

/** Collapsible section used in the sidebar (no external deps). */
function CollapsibleSection({
  section,
}: {
  section: Section;
  pathname: string | null;
}) {
  const [open, setOpen] = useState<boolean>(section.defaultOpen ?? false);
  const Icon = section.icon ?? LayoutDashboard;

  return (
    <div className="mb-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0 opacity-80" />
        <span className="flex-1 truncate font-medium">{section.label}</span>
        {/* Optional CTA on the right (e.g., New Game) */}
        {section.cta && (
          <Link
            href={section.cta.href}
            className="mr-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => e.stopPropagation()}
            title={section.cta.label}
          >
            {section.cta.icon ? (
              <section.cta.icon className="h-3.5 w-3.5" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{section.cta.label}</span>
          </Link>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open ? "rotate-180" : ""
          )}
          aria-hidden="true"
        />
      </button>

      {/* Items */}
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0">
          <ul className="mt-1 space-y-0.5 pl-8">
            {section.items.map((item) => (
              <li key={item.href}>
                {/* Re-use your existing SidebarLink for styling consistency */}
                <SidebarLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
