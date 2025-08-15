"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createGameAction,
  type CreateGameState,
} from "@/features/nrl/fixtures/actions/createFixture";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TeamOpt = { id: string; name: string };
type RoundOpt = { id: string; label: string };

export default function NewGameForm({
  teams,
  rounds,
  className,
}: {
  teams: TeamOpt[];
  rounds: RoundOpt[];
  className?: string;
}) {
  // Allow undefined as the initial state, and pass FormData as the action arg
  const [state, formAction, pending] = useActionState<
    CreateGameState | undefined,
    FormData
  >(createGameAction, undefined);

  // Default kickoff: next hour in local time for convenience
  const defaultLocal = useMemo(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    const pad = (n: number) => String(n).padStart(2, "0");
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${y}-${m}-${day}T${h}:${min}`; // datetime-local format
  }, []);

  // Convert <input type="datetime-local"> value (local) to ISO string
  const [localDT, setLocalDT] = useState(defaultLocal);
  const localToISO = (local: string) => {
    const dt = new Date(local);
    return dt.toISOString(); // server will treat as UTC ISO
  };

  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="p-0">
        <form
          action={(fd) => {
            // Normalize datetime-local to ISO before sending to server action
            fd.set("startsAtISO", localToISO(localDT));
            formAction(fd); // ✅ pass FormData to the action
          }}
          className="grid gap-4 max-w-xl"
        >
          {/* Round */}
          <div className="grid gap-2">
            <Label htmlFor="roundId">Round</Label>
            <select
              id="roundId"
              name="roundId"
              className="border rounded-md h-10 px-3"
              required
              disabled={pending}
              defaultValue={rounds[0]?.id ?? ""}
            >
              {rounds.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.roundId && (
              <p className="text-xs text-red-500">
                {state.fieldErrors.roundId.join(", ")}
              </p>
            )}
          </div>

          {/* Home team */}
          <div className="grid gap-2">
            <Label htmlFor="homeTeamId">Home team</Label>
            <select
              id="homeTeamId"
              name="homeTeamId"
              className="border rounded-md h-10 px-3"
              required
              disabled={pending}
              defaultValue={teams[0]?.id ?? ""}
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.homeTeamId && (
              <p className="text-xs text-red-500">
                {state.fieldErrors.homeTeamId.join(", ")}
              </p>
            )}
          </div>

          {/* Away team */}
          <div className="grid gap-2">
            <Label htmlFor="awayTeamId">Away team</Label>
            <select
              id="awayTeamId"
              name="awayTeamId"
              className="border rounded-md h-10 px-3"
              required
              disabled={pending}
              defaultValue={teams[1]?.id ?? teams[0]?.id ?? ""}
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.awayTeamId && (
              <p className="text-xs text-red-500">
                {state.fieldErrors.awayTeamId.join(", ")}
              </p>
            )}
          </div>

          {/* Kickoff (local) */}
          <div className="grid gap-2">
            <Label htmlFor="startsAtLocal">Kickoff (your local time)</Label>
            <Input
              id="startsAtLocal"
              type="datetime-local"
              value={localDT}
              onChange={(e) => setLocalDT(e.target.value)}
              disabled={pending}
              required
            />
            {/* Hidden field is optional since we set via FormData, but harmless */}
            <input type="hidden" name="startsAtISO" value="" />
            {state?.fieldErrors?.startsAtISO && (
              <p className="text-xs text-red-500">
                {state.fieldErrors.startsAtISO.join(", ")}
              </p>
            )}
          </div>

          {/* Venue */}
          <div className="grid gap-2">
            <Label htmlFor="venue">Venue (optional)</Label>
            <Input
              id="venue"
              name="venue"
              placeholder="Suncorp Stadium"
              disabled={pending}
            />
            {state?.fieldErrors?.venue && (
              <p className="text-xs text-red-500">
                {state.fieldErrors.venue.join(", ")}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Create game"}
            </Button>
            {state && state.message && (
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
