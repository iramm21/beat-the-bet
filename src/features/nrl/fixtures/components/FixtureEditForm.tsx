"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Repeat, Loader2, Save } from "lucide-react";
import type { UpdateFixtureState } from "../actions/updateFixture";
import { updateFixtureAction } from "../actions/updateFixture";
import { FixtureStatus } from "@prisma/client";

type TeamOpt = { id: string; name: string };
type RoundOpt = { id: string; label: string };

const selectBase =
  "h-10 w-full rounded-md border border-input bg-background text-foreground px-3 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export function FixtureEditForm({
  defaults,
  teams,
  rounds,
  className,
}: {
  defaults: {
    id: string;
    seasonId: string;
    roundId: string;
    homeTeamId: string;
    awayTeamId: string;
    startsAtISO: string; // ISO string
    venue: string | null;
    status: FixtureStatus;
  };
  teams: TeamOpt[];
  rounds: RoundOpt[];
  className?: string;
}) {
  const [state, formAction, pending] = useActionState<
    UpdateFixtureState | undefined,
    FormData
  >(updateFixtureAction, undefined);

  const [roundId, setRoundId] = useState(defaults.roundId);
  const [homeTeamId, setHomeTeamId] = useState(defaults.homeTeamId);
  const [awayTeamId, setAwayTeamId] = useState(defaults.awayTeamId);
  const [venue, setVenue] = useState(defaults.venue ?? "");
  const [status, setStatus] = useState<FixtureStatus>(defaults.status);

  // datetime-local needs "YYYY-MM-DDTHH:mm"
  const toLocalInput = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const [localDT, setLocalDT] = useState<string>(
    toLocalInput(defaults.startsAtISO)
  );
  const sameTeam = homeTeamId === awayTeamId;

  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="p-0">
        <form
          action={(fd) => {
            fd.set("id", defaults.id);
            fd.set("seasonId", defaults.seasonId);
            fd.set("roundId", roundId);
            fd.set("homeTeamId", homeTeamId);
            fd.set("awayTeamId", awayTeamId);
            fd.set("startsAtISO", new Date(localDT).toISOString());
            fd.set("venue", venue);
            fd.set("status", status);
            formAction(fd);
          }}
          className="grid max-w-2xl gap-5"
        >
          {/* Round */}
          <div className="grid gap-2">
            <Label htmlFor="roundId">Round</Label>
            <select
              id="roundId"
              name="roundId"
              className={selectBase}
              value={roundId}
              onChange={(e) => setRoundId(e.target.value)}
              disabled={pending}
              required
            >
              {rounds.map((r) => (
                <option key={r.id} value={r.id} className="bg-background">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Teams with middle swap */}
          <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
            <div className="grid gap-2">
              <Label htmlFor="homeTeamId">Home team</Label>
              <select
                id="homeTeamId"
                name="homeTeamId"
                className={cn(selectBase, sameTeam && "border-red-500")}
                required
                disabled={pending}
                value={homeTeamId}
                onChange={(e) => {
                  const val = e.target.value;
                  setHomeTeamId(val);
                  if (val === awayTeamId) {
                    const next = teams.find((t) => t.id !== val)?.id ?? "";
                    setAwayTeamId(next);
                  }
                }}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-background">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end justify-center">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-10 rounded-md"
                onClick={() => {
                  setHomeTeamId(awayTeamId);
                  setAwayTeamId(homeTeamId);
                }}
                disabled={pending}
                title="Swap teams"
                aria-label="Swap teams"
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="awayTeamId">Away team</Label>
              <select
                id="awayTeamId"
                name="awayTeamId"
                className={cn(selectBase, sameTeam && "border-red-500")}
                required
                disabled={pending}
                value={awayTeamId}
                onChange={(e) => setAwayTeamId(e.target.value)}
              >
                {teams.map((t) => (
                  <option
                    key={t.id}
                    value={t.id}
                    disabled={t.id === homeTeamId}
                    className="bg-background"
                  >
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kickoff */}
          <div className="grid gap-2">
            <Label htmlFor="startsAtLocal">Kickoff (local)</Label>
            <Input
              id="startsAtLocal"
              type="datetime-local"
              value={localDT}
              onChange={(e) => setLocalDT(e.target.value)}
              disabled={pending}
              required
            />
          </div>

          {/* Venue + Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="venue">Venue (optional)</Label>
              <Input
                id="venue"
                name="venue"
                placeholder="Suncorp Stadium"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                disabled={pending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className={selectBase}
                value={status}
                onChange={(e) => setStatus(e.target.value as FixtureStatus)}
                disabled={pending}
              >
                {Object.values(FixtureStatus).map((s) => (
                  <option key={s} value={s} className="bg-background">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending || sameTeam}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>
            {sameTeam && (
              <span className="text-sm text-red-600">
                Home and away teams must be different.
              </span>
            )}
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
