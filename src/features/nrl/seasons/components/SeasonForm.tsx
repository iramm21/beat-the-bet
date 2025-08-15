"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SeasonActionState } from "../actions/createSeason";
import { createSeasonAction } from "../actions/createSeason";
import { Loader2, Plus } from "lucide-react";

export function SeasonForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState<
    SeasonActionState | undefined,
    FormData
  >(createSeasonAction, undefined);

  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);

  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="p-0">
        <form
          action={(fd) => {
            fd.set("year", String(year));
            formAction(fd);
          }}
          className="grid max-w-md gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={1900}
              max={3000}
              disabled={pending}
              required
            />
            {state?.fieldErrors?.year?.length ? (
              <p className="text-xs text-red-500">
                {state.fieldErrors.year.join(", ")}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create season
                </>
              )}
            </Button>

            {state?.message && (
              <span
                className={cn(
                  "text-sm",
                  state.ok ? "text-green-600" : "text-red-600"
                )}
              >
                {state.message}
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
