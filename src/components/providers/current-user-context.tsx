"use client";

import { createContext, useContext } from "react";
import type { Role } from "@/types/role";

export type { Role } from "@/types/role";
export type CurrentProfile = {
  userId: string;
  email: string | null;
  username: string | null;
  role: Role;
} | null;

type Ctx = { profile: CurrentProfile };

const CurrentUserContext = createContext<Ctx | undefined>(undefined);

export function CurrentUserProvider({
  value,
  children,
}: {
  value: Ctx;
  children: React.ReactNode;
}) {
  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx)
    throw new Error("useCurrentUser must be used within <CurrentUserProvider>");
  return ctx.profile;
}
