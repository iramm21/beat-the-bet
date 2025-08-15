"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  createRoundsBulkAction,
  type RoundsBulkState,
} from "../actions/createRoundsBulk";
import {
  updateRoundAction,
  type RoundActionState,
} from "../actions/updateRound";
import { deleteRoundAction } from "../actions/deleteRound";
import { Loader2, Save, Trash2, CalendarRange } from "lucide-react";
import Link from "next/link";

type RoundRow = { id: string; number: number; name: string | null };

const numberInputTight =
  // hides browser spinners + tight width for numbers
  "h-9 w-24 tabular-nums font-mono " +
  "appearance-none [appearance:textfield] " +
  "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

export function ManageRounds({
  seasonId,
  rounds,
  className,
}: {
  seasonId: string;
  rounds: RoundRow[];
  className?: string;
}) {
  const [bulkCount, setBulkCount] = useState<number>(27);
  const [baseName, setBaseName] = useState<string>("Round");

  const [bulkState, bulkAction, bulkPending] = useActionState<
    RoundsBulkState | undefined,
    FormData
  >(createRoundsBulkAction, undefined);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Bulk generate */}
      <Card className="p-4 shadow-sm">
        <CardContent className="p-0">
          <form
            action={(fd) => {
              fd.set("seasonId", seasonId);
              fd.set("count", String(bulkCount));
              fd.set("baseName", baseName);
              bulkAction(fd);
            }}
            className="grid gap-4 sm:grid-cols-[160px_1fr_auto] sm:items-end"
          >
            <div className="grid gap-2">
              <Label htmlFor="count" className="text-sm">
                Number of rounds
              </Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={40}
                value={bulkCount}
                onChange={(e) => setBulkCount(Number(e.target.value))}
                disabled={bulkPending}
                required
                className={numberInputTight}
              />
              <p className="text-xs text-muted-foreground">
                Max 40. Existing rounds won’t be duplicated.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="baseName" className="text-sm">
                Base name
              </Label>
              <Input
                id="baseName"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
                disabled={bulkPending}
                required
                placeholder="Round"
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">
                Used for labels (e.g. “Round 1”, “Round 2”…).
              </p>
            </div>

            <Button
              type="submit"
              disabled={bulkPending}
              className="mt-1 h-10 sm:mt-0"
            >
              {bulkPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <CalendarRange className="mr-2 h-4 w-4" />
                  Generate Rounds
                </>
              )}
            </Button>

            {bulkState?.message && (
              <p
                className={cn(
                  "sm:col-span-3 mt-1 rounded-md border px-3 py-2 text-sm",
                  bulkState.ok
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300"
                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
                )}
              >
                {bulkState.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Rounds table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left w-28">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-right w-[320px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((r) => (
                  <RoundRowEdit key={r.id} row={r} />
                ))}

                {rounds.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground"
                      colSpan={3}
                    >
                      No rounds yet — generate above.
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

function RoundRowEdit({ row }: { row: RoundRow }) {
  const [number, setNumber] = useState<number>(row.number);
  const [name, setName] = useState<string>(row.name ?? "");
  const [state, formAction, pending] = useActionState<
    RoundActionState | undefined,
    FormData
  >(updateRoundAction, undefined);

  return (
    <tr
      className={cn(
        "border-t hover:bg-muted/30 transition-colors",
        pending && "opacity-60"
      )}
    >
      <td className="px-4 py-3 align-middle">
        <Input
          type="number"
          min={1}
          value={number}
          onChange={(e) => setNumber(Number(e.target.value))}
          className={numberInputTight}
          disabled={pending}
        />
      </td>

      <td className="px-4 py-3 align-middle">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Round ${row.number}`}
          className="h-9"
          disabled={pending}
        />
      </td>

      <td className="px-4 py-3 align-middle">
        <div className="flex items-center justify-end gap-2">
          <form
            action={(fd) => {
              fd.set("id", row.id);
              fd.set("number", String(number));
              fd.set("name", name);
              formAction(fd);
            }}
            className="inline"
          >
            <Button
              type="submit"
              size="sm"
              className="h-8 px-2"
              disabled={pending}
              title="Save"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="sr-only">Save</span>
            </Button>
          </form>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 px-3"
            title="Manage fixtures"
          >
            <Link href={`/dashboard/admin/rounds/${row.id}/fixtures`}>
              Fixtures
            </Link>
          </Button>

          <form action={deleteRoundAction} className="inline">
            <input type="hidden" name="id" value={row.id} />
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              className="h-8 px-2"
              title="Delete round"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </form>
        </div>

        {state?.message && (
          <div
            className={cn(
              "mt-1 text-xs text-right",
              state.ok ? "text-green-600" : "text-red-600"
            )}
          >
            {state.message}
          </div>
        )}
      </td>
    </tr>
  );
}
