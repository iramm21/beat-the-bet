const METRICS = [
  { label: "Bets tracked", value: "120K+" },
  { label: "Avg. EV per bet", value: "+2.1%" },
  { label: "Users", value: "8,500+" },
  { label: "Integrations", value: "12" },
];

export default function Metrics() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="rounded-xl border bg-background p-6">
              <div className="text-3xl font-bold">{m.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
