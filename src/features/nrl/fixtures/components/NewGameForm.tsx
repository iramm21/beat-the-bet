"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  createGameAction,
  type CreateGameState,
} from "@/features/nrl/fixtures/actions/createFixture";
import { CalendarClock, Loader2, Repeat, Wand2 } from "lucide-react";

type TeamOpt = { id: string; name: string };
type RoundOpt = { id: string; label: string };

/* ---------- helpers (module scope) ---------- */
const pad = (n: number) => String(n).padStart(2, "0");
const fmtLocal = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;

const selectBase =
  "h-10 w-full rounded-md border border-input bg-background text-foreground px-3 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export default function NewGameForm({
  teams,
  rounds,
  className,
}: {
  teams: TeamOpt[];
  rounds: RoundOpt[];
  className?: string;
}) {
  const [state, formAction, pending] = useActionState<
    CreateGameState | undefined,
    FormData
  >(createGameAction, undefined);

  // Default kickoff = next whole hour (local)
  const [localDT, setLocalDT] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return fmtLocal(d);
  });

  const tzOffsetMin = new Date().getTimezoneOffset() * -1; // minutes from UTC
  const localToISO = (local: string) => {
    const dt = new Date(local);
    return Number.isNaN(dt.getTime()) ? "" : dt.toISOString();
  };
  const isoPreview = localToISO(localDT);

  // Local form state
  const [roundId, setRoundId] = useState<string>(rounds[0]?.id ?? "");
  const [homeTeamId, setHomeTeamId] = useState<string>(teams[0]?.id ?? "");
  const [awayTeamId, setAwayTeamId] = useState<string>(
    teams[1]?.id ?? teams[0]?.id ?? ""
  );
  const [venue, setVenue] = useState<string>("");

  const sameTeam = homeTeamId && awayTeamId && homeTeamId === awayTeamId;
  const kickoffInPast = (() => {
    const dt = new Date(localDT);
    if (Number.isNaN(dt.getTime())) return false;
    return dt.getTime() < Date.now() - 60_000; // 1 min grace
  })();

  // Quick time presets
  const setTonight7pm = () => {
    const d = new Date();
    d.setHours(19, 0, 0, 0);
    if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
    setLocalDT(fmtLocal(d));
  };
  const setPlus = (hours = 0, days = 0) => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + hours);
    d.setDate(d.getDate() + days);
    setLocalDT(fmtLocal(d));
  };

  // Submit wrapper
  const onSubmit = (fd: FormData) => {
    if (!roundId || !homeTeamId || !awayTeamId || !localDT) return;

    fd.set("roundId", roundId);
    fd.set("homeTeamId", homeTeamId);
    fd.set("awayTeamId", awayTeamId);
    fd.set("venue", venue);
    fd.set("startsAtISO", localToISO(localDT));
    fd.set("startsAtLocal", localDT);
    fd.set("tzOffsetMin", String(tzOffsetMin));

    formAction(fd);
  };

  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="p-0">
        <form action={onSubmit} className="grid max-w-2xl gap-5">
          {/* Round */}
          <div className="grid gap-2">
            <Label htmlFor="roundId">Round</Label>
            <select
              id="roundId"
              name="roundId"
              className={cn(selectBase)}
              required
              disabled={pending}
              value={roundId}
              onChange={(e) => setRoundId(e.target.value)}
              aria-invalid={!!state?.fieldErrors?.roundId || undefined}
              aria-describedby={
                state?.fieldErrors?.roundId ? "roundId-error" : undefined
              }
            >
              {rounds.map((r) => (
                <option key={r.id} value={r.id} className="bg-background">
                  {r.label}
                </option>
              ))}
            </select>
            <FieldError
              id="roundId-error"
              messages={state?.fieldErrors?.roundId}
            />
          </div>

          {/* Teams (Swap button centered between) */}
          <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
            {/* Home */}
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
                aria-invalid={
                  sameTeam || !!state?.fieldErrors?.homeTeamId || undefined
                }
                aria-describedby={
                  state?.fieldErrors?.homeTeamId
                    ? "homeTeamId-error"
                    : undefined
                }
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-background">
                    {t.name}
                  </option>
                ))}
              </select>
              <FieldError
                id="homeTeamId-error"
                messages={state?.fieldErrors?.homeTeamId}
              />
            </div>

            {/* Swap (middle) */}
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

            {/* Away */}
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
                aria-invalid={
                  sameTeam || !!state?.fieldErrors?.awayTeamId || undefined
                }
                aria-describedby={
                  state?.fieldErrors?.awayTeamId
                    ? "awayTeamId-error"
                    : undefined
                }
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
              <FieldError
                id="awayTeamId-error"
                messages={state?.fieldErrors?.awayTeamId}
              />
            </div>
          </div>

          {/* Kickoff */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="startsAtLocal">Kickoff (your local time)</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" size="sm" variant="outline">
                    <CalendarClock className="mr-2 h-4 w-4" />
                    Quick set
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => setPlus(1, 0)}>
                    +1 hour
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={setTonight7pm}>
                    Tonight 7:00 pm
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPlus(0, 1)}>
                    +1 day (same time)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Input
              id="startsAtLocal"
              type="datetime-local"
              value={localDT}
              onChange={(e) => setLocalDT(e.target.value)}
              disabled={pending}
              required
              aria-invalid={kickoffInPast || !isoPreview || undefined}
            />

            {/* Inline hints */}
            <div className="text-xs text-muted-foreground">
              <div>UTC (stored): {isoPreview || "—"}</div>
              <div>
                Timezone offset: {tzOffsetMin >= 0 ? "+" : ""}
                {Math.trunc(tzOffsetMin / 60)}:{pad(Math.abs(tzOffsetMin % 60))}
              </div>
            </div>

            {kickoffInPast && (
              <p className="text-xs font-medium text-red-600">
                Kickoff appears to be in the past.
              </p>
            )}
            <FieldError
              id="startsAt-error"
              messages={state?.fieldErrors?.startsAtISO}
            />
          </div>

          {/* Venue + neutral flag */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="venue">Venue (optional)</Label>
              <div className="flex items-center gap-2">
                <Checkbox id="neutral" onCheckedChange={() => void 0} />
                <label
                  htmlFor="neutral"
                  className="text-xs text-muted-foreground"
                >
                  Neutral venue
                </label>
              </div>
            </div>
            <Input
              id="venue"
              name="venue"
              placeholder="Suncorp Stadium"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              disabled={pending}
            />
            <FieldError id="venue-error" messages={state?.fieldErrors?.venue} />
          </div>

          {/* Submit + status */}
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={pending || sameTeam || kickoffInPast || !isoPreview}
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Create game
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

          {/* Hidden fields (server convenience) */}
          <input type="hidden" name="startsAtISO" value="" />
          <input type="hidden" name="startsAtLocal" value="" />
          <input type="hidden" name="tzOffsetMin" value="" />
        </form>
      </CardContent>
    </Card>
  );
}

/** Renders zod-style array errors */
function FieldError({ messages, id }: { messages?: string[]; id?: string }) {
  if (!messages?.length) return null;
  return (
    <div id={id} className="space-y-1">
      {messages.map((m, i) => (
        <p key={i} className="text-xs text-red-500">
          {m}
        </p>
      ))}
    </div>
  );
}
