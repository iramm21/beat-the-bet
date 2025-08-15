export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { prisma } from "@/lib/prisma";

interface FixtureRow {
  id: string;
  startsAt: Date;
  homeTeam: { name: string };
  awayTeam: { name: string };
  markets: { key: string }[];
}

async function getFixtures(): Promise<FixtureRow[]> {
  return prisma.fixture.findMany({
    // TEMP: no time filter so we can verify data exists regardless of timestamp/season
    include: {
      homeTeam: { select: { name: true } },
      awayTeam: { select: { name: true } },
      markets: { select: { key: true } },
    },
    orderBy: { startsAt: "asc" },
    take: 10,
  });
}

export default async function DashboardPage() {
  const fixtures = await getFixtures();
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

      {/* Upcoming fixtures */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Fixtures</CardTitle>
          </CardHeader>
          <CardContent>
            {fixtures.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No fixtures available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Teams</th>
                      <th className="p-2">Kickoff</th>
                      <th className="p-2">Markets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fixtures.map((fixture) => (
                      <tr key={fixture.id} className="border-t">
                        <td className="p-2">
                          {fixture.homeTeam.name} vs {fixture.awayTeam.name}
                        </td>
                        <td className="p-2">
                          {fixture.startsAt.toLocaleString()}
                        </td>
                        <td className="p-2">
                          {fixture.markets.map((m) => m.key).join(", ") || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
