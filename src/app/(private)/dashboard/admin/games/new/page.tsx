export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import NewGameForm from "@/app/(private)/dashboard/admin/_components/NewGameForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminNewGamePage() {
  // Fetch teams
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  // Pick the latest season by year (assumes higher year = current)
  const latestSeason = await prisma.season.findFirst({
    orderBy: { year: "desc" },
    select: { id: true, year: true },
  });

  const rounds = latestSeason
    ? await prisma.round.findMany({
        where: { seasonId: latestSeason.id },
        orderBy: { number: "asc" },
        select: { id: true, number: true, name: true },
      })
    : [];

  const teamOpts = teams.map((t) => ({ id: t.id, name: t.name }));
  const roundOpts = rounds.map((r) => ({
    id: r.id,
    label: r.name ?? `Round ${r.number}`,
  }));

  return (
    <main className="mx-auto w-full max-w-4xl p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {teamOpts.length === 0 || roundOpts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No teams or rounds found. Seed or create these first.
            </p>
          ) : (
            <NewGameForm teams={teamOpts} rounds={roundOpts} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
