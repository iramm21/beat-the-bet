export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Teams</h1>
        <Button asChild>
          <Link href="/dashboard/admin/teams/new">New Team</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Short</th>
                  <th className="px-4 py-3 text-left">Home venue</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-3 font-mono">{t.code}</td>
                    <td className="px-4 py-3">{t.name}</td>
                    <td className="px-4 py-3">{t.shortName ?? "—"}</td>
                    <td className="px-4 py-3">{t.homeVenue ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mr-2"
                      >
                        <Link href={`/dashboard/admin/teams/${t.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <DeleteButton id={t.id} />
                    </td>
                  </tr>
                ))}

                {teams.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground"
                      colSpan={5}
                    >
                      No teams yet. Create your first one.
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

import { deleteTeamAction } from "@/features/nrl/teams/actions/deleteTeam";
function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteTeamAction} className="inline">
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  );
}
