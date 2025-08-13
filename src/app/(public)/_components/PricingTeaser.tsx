import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const bullets = ["Free plan available", "Cancel anytime", "No card required"];

export default function PricingTeaser() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="rounded-2xl border bg-background p-8 sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Simple pricing that scales with you
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Start free. Upgrade when you want more data and automation.
          </p>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              {bullets.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4" /> {b}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button asChild size="lg">
                <Link href="/pricing">See pricing</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/sign-up">Start free</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
