export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// Reuse your improved form
import NewGameForm from "@/features/nrl/fixtures/components/NewGameForm";

type Props = { params: { id: string } };

export default async function NewFixtureForRoundPage({ params }: Props) {
  const round = await prisma.round.findUnique({
    where: { id: params.id },
    include: { season: true },
  });
  if (!round) {
    return <div className="p-6">Round not found.</div>;
  }

  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  // Put current round first, followed by others from the same season
  const seasonRounds = await prisma.round.findMany({
    where: { seasonId: round.seasonId },
    orderBy: { number: "asc" },
    select: { id: true, number: true, name: true },
  });
  const roundsOrdered = [
    seasonRounds.find((r) => r.id === round.id)!,
    ...seasonRounds.filter((r) => r.id !== round.id),
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Fixture</h1>
        <Button asChild variant="outline">
          <Link href={`/dashboard/admin/rounds/${round.id}/fixtures`}>
            Back
          </Link>
        </Button>
      </div>

      <NewGameForm
        teams={teams.map((t) => ({ id: t.id, name: t.name }))}
        rounds={roundsOrdered.map((r) => ({
          id: r.id,
          label: r.name ?? `Round ${r.number}`,
        }))}
        className="max-w-3xl"
      />
      {/* Hidden seasonId if your action wants it (we derive on server anyway) */}
      {/* You can also fork the NewGameForm to include a hidden seasonId field if preferred */}
    </div>
  );
}
