export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManageRounds } from "@/features/nrl/seasons/components/ManageRounds";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default async function SeasonDetailPage({ params }: Props) {
  const season = await prisma.season.findUnique({
    where: { id: params.id },
    include: {
      league: true,
      rounds: {
        orderBy: { number: "asc" },
        select: { id: true, number: true, name: true },
      },
    },
  });
  if (!season) notFound();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {season.league.name} — {season.year}
        </h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/admin/seasons">Back</Link>
        </Button>
      </div>

      <ManageRounds seasonId={season.id} rounds={season.rounds} />
    </div>
  );
}
