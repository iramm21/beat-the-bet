import Link from "next/link";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { AuthButton } from "@/features/auth/components/auth-button";
import { NavItem } from "./PublicNavItem"; // client subcomponent

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

export default async function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs font-bold">
              BTB
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Beat the Bet
            </span>
          </Link>
        </div>

        {/* Center: Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        {/* Right: Theme + Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeSwitcher />
          <AuthButton />
        </div>

        {/* Mobile right side (can add menu later) */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
