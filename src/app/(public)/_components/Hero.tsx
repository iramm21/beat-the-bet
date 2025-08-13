import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          Bet smarter — not harder
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Beat the Bet: EV & Kelly-driven insights for NRL
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Plan stakes, understand risk, and track bankroll like a pro. Find +EV
          edges and size bets with confidence.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Get started free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn more</Link>
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Free plan available • No card required
        </p>
      </div>
    </section>
  );
}
