import { Plus, Trash2, UserRound, UsersRound } from "lucide-react";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createId } from "@/lib/utils";
import type { GameConfiguration, TeamInput } from "@/types/game";

interface TeamEditorProps {
  control: Control<GameConfiguration>;
  register: UseFormRegister<GameConfiguration>;
  errors?: FieldErrors<TeamInput>;
  teamIndex: number;
  canRemoveTeam: boolean;
  onRemoveTeam: () => void;
}

const TEAM_STYLES = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
];

export function TeamEditor({
  control,
  register,
  errors,
  teamIndex,
  canRemoveTeam,
  onRemoveTeam,
}: TeamEditorProps) {
  const playersName = `teams.${teamIndex}.players` as const;
  const { fields, append, remove } = useFieldArray({
    control,
    name: playersName,
    keyName: "fieldKey",
    rules: { minLength: { value: 1, message: "Every team needs at least one player." } },
  });

  return (
    <Card className="relative overflow-hidden border-border/80">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${TEAM_STYLES[teamIndex % TEAM_STYLES.length]}`} />
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-secondary text-primary">
            <UsersRound className="h-4 w-4" aria-hidden="true" />
          </span>
          Team {teamIndex + 1}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemoveTeam}
          disabled={!canRemoveTeam}
          aria-label={`Remove team ${teamIndex + 1}`}
          title={canRemoveTeam ? "Remove team" : "A game needs at least two teams"}
          className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <input type="hidden" {...register(`teams.${teamIndex}.id`)} />
        <div className="space-y-2">
          <Label htmlFor={`team-${teamIndex}-name`}>Team name</Label>
          <Input
            id={`team-${teamIndex}-name`}
            placeholder={teamIndex === 0 ? "e.g. The Scene Stealers" : "e.g. The Wild Cards"}
            autoComplete="off"
            aria-invalid={Boolean(errors?.name)}
            {...register(`teams.${teamIndex}.name`, {
              validate: (value) => value.trim().length > 0 || "Give this team a name.",
            })}
          />
          {errors?.name?.message && <p className="form-error">{errors.name.message}</p>}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label>Players</Label>
            <span className="text-xs font-medium text-muted-foreground">
              {fields.length} {fields.length === 1 ? "player" : "players"}
            </span>
          </div>
          <div className="space-y-2.5">
            {fields.map((field, playerIndex) => (
              <div key={field.fieldKey}>
                <input type="hidden" {...register(`teams.${teamIndex}.players.${playerIndex}.id`)} />
                <div className="flex items-start gap-2">
                  <div className="relative flex-1">
                    <UserRound className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      aria-label={`Player ${playerIndex + 1} name for team ${teamIndex + 1}`}
                      placeholder={`Player ${playerIndex + 1}`}
                      autoComplete="off"
                      className="pl-10"
                      aria-invalid={Boolean(errors?.players?.[playerIndex]?.name)}
                      {...register(`teams.${teamIndex}.players.${playerIndex}.name`, {
                        validate: (value) => value.trim().length > 0 || "Enter a player name.",
                      })}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(playerIndex)}
                    disabled={fields.length === 1}
                    aria-label={`Remove player ${playerIndex + 1}`}
                    title={fields.length === 1 ? "Each team needs one player" : "Remove player"}
                    className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                {errors?.players?.[playerIndex]?.name?.message && (
                  <p className="form-error mt-1.5">{errors.players[playerIndex]?.name?.message}</p>
                )}
              </div>
            ))}
          </div>
          {errors?.players?.root?.message && <p className="form-error">{errors.players.root.message}</p>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => append({ id: createId("player"), name: "" }, { shouldFocus: true })}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add player
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
