import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BarChart3, ShieldCheck, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-assisted edges",
    desc: "Blend bookmaker odds with your assumptions to surface +EV selections faster.",
  },
  {
    icon: BarChart3,
    title: "Bankroll tracking",
    desc: "Track stakes, CLV, profit, and risk—see what’s really driving results.",
  },
  {
    icon: Zap,
    title: "Kelly sizing",
    desc: "Size bets based on edge and risk preference. Fractional Kelly supported.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first",
    desc: "Your strategy stays yours. Secure by default; export anytime.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          Why Beat the Bet
        </div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Everything you need to bet with discipline
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Tools that help you be consistent—without the spreadsheets.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
