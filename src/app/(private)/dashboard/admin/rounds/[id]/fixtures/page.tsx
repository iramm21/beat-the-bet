export const runtime = "nodejs";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteFixtureAction } from "@/features/nrl/fixtures/actions/deleteFixture";

type Props = { params: { id: string } };

export default async function RoundFixturesPage({ params }: Props) {
  const round = await prisma.round.findUnique({
    where: { id: params.id },
    include: {
      season: { include: { league: true } },
      fixtures: {
        orderBy: { startsAt: "asc" },
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
  });

  if (!round) {
    return <div className="p-6">Round not found.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">
          {round.season.league.name} — {round.season.year} —{" "}
          {round.name ?? `Round ${round.number}`}
        </h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/admin/seasons/${round.seasonId}`}>
              Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/admin/rounds/${round.id}/fixtures/new`}>
              New Fixture
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Kickoff</th>
                  <th className="px-4 py-3 text-left">Home</th>
                  <th className="px-4 py-3 text-left">Away</th>
                  <th className="px-4 py-3 text-left">Venue</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {round.fixtures.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="px-4 py-3">
                      {new Date(f.startsAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{f.homeTeam.name}</td>
                    <td className="px-4 py-3">{f.awayTeam.name}</td>
                    <td className="px-4 py-3">{f.venue ?? "—"}</td>
                    <td className="px-4 py-3">{f.status}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mr-2"
                      >
                        <Link href={`/dashboard/admin/fixtures/${f.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <form action={deleteFixtureAction} className="inline">
                        <input type="hidden" name="id" value={f.id} />
                        <Button type="submit" variant="destructive" size="sm">
                          Delete
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
                {round.fixtures.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground"
                      colSpan={6}
                    >
                      No fixtures yet — add your first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
