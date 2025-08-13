const STEPS = [
  {
    title: "Import odds & set assumptions",
    bullets: [
      "Pull market odds",
      "Set fair probabilities",
      "Flag mismatches (+EV)",
    ],
  },
  {
    title: "Size stakes with Kelly",
    bullets: [
      "Pick fractional Kelly",
      "Respect bankroll and limits",
      "Simulate outcomes",
    ],
  },
  {
    title: "Track results & improve",
    bullets: [
      "Log bets in one click",
      "See EV vs. actuals",
      "Refine edges over time",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          How it works
        </div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          From idea to disciplined execution
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Simple workflow that keeps you consistent.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="rounded-xl border bg-background p-6">
              <h3 className="text-base font-semibold">{s.title}</h3>
              <ul className="mt-4 space-y-2">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-foreground/70" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
