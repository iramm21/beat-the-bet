export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteSeasonAction } from "@/features/nrl/seasons/actions/deleteSeason";

export default async function SeasonsPage() {
  const seasons = await prisma.season.findMany({
    orderBy: { year: "desc" },
    include: { league: true, rounds: { select: { id: true }, take: 1 } },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Seasons</h1>
        <Button asChild>
          <Link href="/dashboard/admin/seasons/new">New Season</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">League</th>
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-left">Rounds</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3">{s.league.name}</td>
                    <td className="px-4 py-3">{s.year}</td>
                    <td className="px-4 py-3">
                      {s.rounds.length > 0 ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mr-2"
                      >
                        <Link href={`/dashboard/admin/seasons/${s.id}`}>
                          Manage
                        </Link>
                      </Button>

                      <form action={deleteSeasonAction} className="inline">
                        <input type="hidden" name="id" value={s.id} />
                        <Button type="submit" variant="destructive" size="sm">
                          Delete
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}

                {seasons.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground"
                      colSpan={4}
                    >
                      No seasons yet. Create your first one.
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
