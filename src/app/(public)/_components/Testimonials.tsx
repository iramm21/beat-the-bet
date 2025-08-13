const TESTIMONIALS = [
  {
    quote:
      "Kelly sizing finally clicked. I stopped overbetting edges and my variance dropped.",
    author: "Alex M.",
    role: "Semi-pro bettor",
  },
  {
    quote:
      "The EV view plus bankroll tracking is exactly what I needed to be disciplined.",
    author: "Sam M.",
    role: "Data analyst",
  },
  {
    quote:
      "I ditched spreadsheets. This is faster and I actually trust my numbers now.",
    author: "Jess M.",
    role: "NRL fan",
  },
];

export default function Testimonials() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          What users say
        </div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Built for disciplined bettors
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Real workflows, less guesswork.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.author}
              className="rounded-xl border bg-background p-6"
            >
              <blockquote className="text-sm leading-6">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground">
                — {t.author}, {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
