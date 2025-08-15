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
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

type RoundRow = { id: string; number: number; name: string | null };

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
      <Card className="p-4">
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
              <Label htmlFor="count">Number of rounds</Label>
              <Input
                id="count"
                type="number"
                min={1}
                max={40}
                value={bulkCount}
                onChange={(e) => setBulkCount(Number(e.target.value))}
                disabled={bulkPending}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="baseName">Base name</Label>
              <Input
                id="baseName"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
                disabled={bulkPending}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={bulkPending}
              className="mt-1 sm:mt-0"
            >
              {bulkPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Rounds
                </>
              )}
            </Button>

            {bulkState?.message && (
              <p
                className={cn(
                  "sm:col-span-3 text-sm",
                  bulkState.ok ? "text-green-600" : "text-red-600"
                )}
              >
                {bulkState.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left w-28">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-right w-40">Actions</th>
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
    <tr className="border-t">
      <td className="px-4 py-3">
        <Input
          type="number"
          min={1}
          value={number}
          onChange={(e) => setNumber(Number(e.target.value))}
          className="h-9 w-24"
          disabled={pending}
        />
      </td>
      <td className="px-4 py-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Round ${row.number}`}
          className="h-9"
          disabled={pending}
        />
      </td>
      <td className="px-4 py-3 text-right">
        <form
          action={(fd) => {
            fd.set("id", row.id);
            fd.set("number", String(number));
            fd.set("name", name);
            formAction(fd);
          }}
          className="inline"
        >
          <Button type="submit" size="sm" className="mr-2" disabled={pending}>
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="sr-only">Save</span>
          </Button>
        </form>

        <form action={deleteRoundAction} className="inline">
          <input type="hidden" name="id" value={row.id} />
          <Button type="submit" variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </form>

        {state?.message && (
          <div
            className={cn(
              "mt-1 text-xs",
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
