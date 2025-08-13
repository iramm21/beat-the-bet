"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, Bug } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optional: send to your monitoring/telemetry here
    // console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-background text-foreground">
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        {/* BTB mark */}
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-md border">
          <span className="text-xs font-bold">BTB</span>
        </div>

        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          We couldn’t complete that action
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          An unexpected error occurred. You can try again, or return to a safe
          page.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>

        <div className="mt-8 rounded-xl border bg-card p-4 text-left">
          <div className="flex items-start gap-3">
            <Bug className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              <p>
                If this keeps happening, please{" "}
                <Link href="/help" className="underline underline-offset-4">
                  report the issue
                </Link>
                .
              </p>
              {error?.digest && (
                <p className="mt-2">
                  Error ID: <span className="font-mono">{error.digest}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
