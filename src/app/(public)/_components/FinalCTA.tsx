import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="rounded-2xl border bg-background p-10 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">
            Ready to bet with discipline?
          </h3>
          <p className="mt-2 text-muted-foreground">
            Get started free and import your first market in minutes.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Create account</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">See how it works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
