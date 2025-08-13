import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your account, bankroll and recent activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/onboarding">
            <Button variant="outline">Edit profile</Button>
          </Link>
          <Link href="/builder">
            <Button>Open Bet Builder</Button>
          </Link>
        </div>
      </div>

      {/* Quick stats (placeholders for now) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bankroll
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">$0.00</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Bets
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">0</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last 7d EV
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">+0.0%</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">0%</CardContent>
        </Card>
      </section>

      {/* Recent activity (placeholder) */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Recent Bets</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No recent bets yet. When you place or log a bet, it will appear
            here.
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Connect your models to see suggested bets based on EV/Kelly and your
            risk.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
