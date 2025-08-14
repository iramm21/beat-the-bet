"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/features/auth/components/logout-button";
import {
  User,
  Settings,
  LayoutDashboard,
  Shield,
  LogOutIcon,
} from "lucide-react";
import type { Role } from "@/types/role";

type UserMenuProps = {
  email: string;
  role?: Role;
};

export function UserMenu({ email, role = "USER" }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{email}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Signed in as
          <br />
          <span className="text-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Link href="/dashboard">
          <DropdownMenuItem className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>
        </Link>

        <Link href="/account">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
        </Link>

        <Link href="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>

        {role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            {/* Link to admin dashboard */}
            <Link href="/dashboard/admin">
              <DropdownMenuItem className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </DropdownMenuItem>
            </Link>
          </>
        )}

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          {/* Keep your existing LogoutButton */}
          <LogoutButton variant="ghost" size="sm" className="gap-2">
            <LogOutIcon className="h-4 w-4" /> Sign out
          </LogoutButton>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
