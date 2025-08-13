"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/components/providers/current-user-context";
import { Sidebar } from "./PrivateSidebar";
import { Header } from "./PrivateHeader";

export default function DashboardChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useCurrentUser(); // null if signed out
  const router = useRouter();

  // Simple client-side guard. If you also have middleware, this is just a safety net.
  useEffect(() => {
    if (profile === null) {
      router.replace("/auth/login");
    }
  }, [profile, router]);

  if (profile === null) {
    // You can also render your global loader here if you prefer
    return (
      <div className="grid min-h-dvh place-items-center">
        <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh">
      <Sidebar profile={profile} />
      <div className="flex flex-1 flex-col">
        <Header profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
