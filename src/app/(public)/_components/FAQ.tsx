const QA = [
  {
    q: "Can I place bets in the app?",
    a: "No. We help you plan, size, and track bets. You place them with your bookmaker.",
  },
  {
    q: "What is EV and Kelly?",
    a: "EV is expected value (edge). Kelly suggests stake size based on your edge and risk preference.",
  },
  {
    q: "Do you support social logins?",
    a: "Email/password today. Social auth is planned.",
  },
  {
    q: "Is my data private?",
    a: "Yes. You control exports and we never share your private models or logs.",
  },
];

export default function FAQ() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          FAQ
        </div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Answers to common questions
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Still unsure? Reach out and we’ll help you get set up.
        </p>

        <div className="mt-8 grid gap-3">
          {QA.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border bg-background p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="text-sm font-medium">{item.q}</span>
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
