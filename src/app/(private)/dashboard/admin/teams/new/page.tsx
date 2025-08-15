export const runtime = "nodejs";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TeamForm } from "@/features/nrl/teams/components/TeamForm";

export default function NewTeamPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Team</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/admin/teams">Back</Link>
        </Button>
      </div>

      <TeamForm mode="create" />
    </div>
  );
}
