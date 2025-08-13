"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { forwardRef, ComponentProps } from "react";

// Get the prop types from the Button component
type ButtonProps = ComponentProps<typeof Button>;

export const LogoutButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children = "Logout", ...props }, ref) => {
    const router = useRouter();

    const logout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
    };

    return (
      <Button ref={ref} onClick={logout} {...props}>
        {children}
      </Button>
    );
  }
);

LogoutButton.displayName = "LogoutButton";
