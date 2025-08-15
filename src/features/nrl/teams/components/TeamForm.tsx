"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TeamActionState } from "../actions/createTeam";
import { createTeamAction } from "../actions/createTeam";
import { updateTeamAction } from "../actions/updateTeam";
import { Loader2, Save, Plus } from "lucide-react";

type TeamFormProps = {
  mode: "create" | "edit";
  defaults?: {
    id: string;
    code: string;
    name: string;
    shortName: string | null;
    homeVenue: string | null;
  };
  className?: string;
};

export function TeamForm({ mode, defaults, className }: TeamFormProps) {
  const [state, formAction, pending] = useActionState<
    TeamActionState | undefined,
    FormData
  >(mode === "create" ? createTeamAction : updateTeamAction, undefined);

  const [code, setCode] = useState(defaults?.code ?? "");
  const [name, setName] = useState(defaults?.name ?? "");
  const [shortName, setShortName] = useState(defaults?.shortName ?? "");
  const [homeVenue, setHomeVenue] = useState(defaults?.homeVenue ?? "");

  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="p-0">
        <form
          action={(fd) => {
            if (mode === "edit" && defaults?.id) fd.set("id", defaults.id);
            fd.set("code", code);
            fd.set("name", name);
            fd.set("shortName", shortName || "");
            fd.set("homeVenue", homeVenue || "");
            formAction(fd);
          }}
          className="grid max-w-xl gap-5"
        >
          {/* Code */}
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. BRON"
              required
              disabled={pending}
            />
            <FieldError messages={state?.fieldErrors?.code} />
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Brisbane Broncos"
              required
              disabled={pending}
            />
            <FieldError messages={state?.fieldErrors?.name} />
          </div>

          {/* Short name */}
          <div className="grid gap-2">
            <Label htmlFor="shortName">Short name (optional)</Label>
            <Input
              id="shortName"
              value={shortName ?? ""}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="Broncos"
              disabled={pending}
            />
            <FieldError messages={state?.fieldErrors?.shortName} />
          </div>

          {/* Venue */}
          <div className="grid gap-2">
            <Label htmlFor="homeVenue">Home venue (optional)</Label>
            <Input
              id="homeVenue"
              value={homeVenue ?? ""}
              onChange={(e) => setHomeVenue(e.target.value)}
              placeholder="Suncorp Stadium"
              disabled={pending}
            />
            <FieldError messages={state?.fieldErrors?.homeVenue} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : mode === "create" ? (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create team
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
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

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <div className="space-y-1">
      {messages.map((m, i) => (
        <p key={i} className="text-xs text-red-500">
          {m}
        </p>
      ))}
    </div>
  );
}
