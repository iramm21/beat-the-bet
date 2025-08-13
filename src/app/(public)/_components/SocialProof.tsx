const logos = ["NRL Stats", "SharpEdge", "BookieBench", "DataCraft", "OddsLab"];

export default function SocialProof() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Trusted by analysts & bettors
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 opacity-70">
            {logos.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center rounded-md border bg-background px-4 py-3 text-xs"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
