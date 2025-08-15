export const runtime = "nodejs";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SeasonForm } from "@/features/nrl/seasons/components/SeasonForm";

export default function NewSeasonPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Season</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/admin/seasons">Back</Link>
        </Button>
      </div>

      <SeasonForm />
    </div>
  );
}
