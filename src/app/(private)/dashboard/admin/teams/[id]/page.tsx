export const runtime = "nodejs";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { TeamForm } from "@/features/nrl/teams/components/TeamForm";

type Props = { params: { id: string } };

export default async function EditTeamPage({ params }: Props) {
  const team = await prisma.team.findUnique({ where: { id: params.id } });
  if (!team) notFound();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Team</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/admin/teams">Back</Link>
        </Button>
      </div>

      <TeamForm
        mode="edit"
        defaults={{
          id: team.id,
          code: team.code,
          name: team.name,
          shortName: team.shortName,
          homeVenue: team.homeVenue,
        }}
      />
    </div>
  );
}
