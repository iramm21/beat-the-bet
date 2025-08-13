"use client";

import { useEffect, useState } from "react";
import { X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type HelplineLink = { label: string; href?: string };

type RGBannerProps = {
  /** localStorage key so you can bump the version later (e.g. v2) */
  storageKey?: string;
  /** Main message; keep it short and clear */
  message?: React.ReactNode;
  /** Optional support links under the message */
  helplines?: HelplineLink[];
  /** Optional “Learn more” link */
  learnMoreHref?: string;
  /** Stick to viewport top or bottom */
  position?: "top" | "bottom";
  /** If true, uses fixed positioning with backdrop blur */
  sticky?: boolean;
  /** Tailwind overrides */
  className?: string;
};

export default function ResponsibleGamblingBanner({
  storageKey = "rg-banner:v1",
  message = (
    <>
      <strong className="font-semibold">Gamble responsibly.</strong> Set a
      budget and stick to it. If gambling is causing you harm, support is
      available.
    </>
  ),
  helplines = [],
  learnMoreHref,
  position = "top",
  sticky = true,
  className,
}: RGBannerProps) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Initialize visibility from localStorage on mount
    const dismissed =
      typeof window !== "undefined" && localStorage.getItem(storageKey) === "1";
    setHidden(dismissed);
  }, [storageKey]);

  function dismiss() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      // ignore storage errors (private mode, etc.)
    }
    setHidden(true);
  }

  if (hidden) return null;

  const fixedClasses = sticky
    ? cn(
        "fixed inset-x-0 z-50",
        position === "top" ? "top-0" : "bottom-0",
        "backdrop-blur supports-[backdrop-filter]:bg-background/70"
      )
    : undefined;

  return (
    <div
      role="region"
      aria-label="Responsible gambling message"
      className={cn("border-b bg-background", fixedClasses, className)}
    >
      <div className="mx-auto flex w-full max-w-6xl items-start gap-3 px-4 py-3 sm:items-center">
        <div className="mt-0.5 shrink-0 rounded-md border p-1.5">
          <ShieldAlert className="h-4 w-4" aria-hidden />
        </div>

        <div className="flex-1">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {message}{" "}
            {learnMoreHref ? (
              <>
                <a
                  href={learnMoreHref}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Learn more
                </a>
                .
              </>
            ) : null}
          </p>

          {helplines.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {helplines.map((h) => (
                <li key={h.label} className="text-xs text-muted-foreground">
                  {h.href ? (
                    <a
                      href={h.href}
                      className="hover:underline underline-offset-4"
                    >
                      {h.label}
                    </a>
                  ) : (
                    h.label
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss responsible gambling banner"
          className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
