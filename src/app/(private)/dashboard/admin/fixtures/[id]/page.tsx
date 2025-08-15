export const runtime = "nodejs";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { FixtureEditForm } from "@/features/nrl/fixtures/components/FixtureEditForm";

type Props = { params: { id: string } };

export default async function EditFixturePage({ params }: Props) {
  const fixture = await prisma.fixture.findUnique({
    where: { id: params.id },
    include: {
      homeTeam: true,
      awayTeam: true,
      round: { include: { season: true } },
    },
  });
  if (!fixture) notFound();

  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  const rounds = await prisma.round.findMany({
    where: { seasonId: fixture.seasonId },
    orderBy: { number: "asc" },
    select: { id: true, number: true, name: true },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Fixture</h1>
        <Button asChild variant="outline">
          <Link href={`/dashboard/admin/rounds/${fixture.roundId}/fixtures`}>
            Back
          </Link>
        </Button>
      </div>

      <FixtureEditForm
        defaults={{
          id: fixture.id,
          seasonId: fixture.seasonId,
          roundId: fixture.roundId!,
          homeTeamId: fixture.homeTeamId,
          awayTeamId: fixture.awayTeamId,
          startsAtISO: fixture.startsAt.toISOString(),
          venue: fixture.venue,
          status: fixture.status,
        }}
        teams={teams.map((t) => ({ id: t.id, name: t.name }))}
        rounds={rounds.map((r) => ({
          id: r.id,
          label: r.name ?? `Round ${r.number}`,
        }))}
      />
    </div>
  );
}
