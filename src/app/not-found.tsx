import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background text-foreground">
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        {/* BTB mark */}
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-md border">
          <span className="text-xs font-bold">BTB</span>
        </div>

        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          404 — Not Found
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Can’t find that page
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you’re looking for might have been moved, renamed, or never
          existed. Try the homepage or explore your dashboard.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <Search className="mr-2 h-4 w-4" />
              Open dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-8 rounded-xl border bg-card p-4 text-left">
          <p className="text-xs text-muted-foreground">
            Tip: Check the URL or use the site navigation. If you think this is
            a bug, report it via{" "}
            <Link href="/help" className="underline underline-offset-4">
              Help
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
