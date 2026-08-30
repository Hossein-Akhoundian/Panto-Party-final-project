import { ArrowLeft, ArrowRight, Clock3, Plus, RotateCcw, Sparkles } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Brand } from "@/components/shared/brand";
import { TeamEditor } from "@/components/setup/team-editor";
import { SettingChoice } from "@/components/setup/setting-choice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createId } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import {
  DURATION_OPTIONS,
  ROUND_OPTIONS,
  type GameConfiguration,
  type TeamInput,
} from "@/types/game";

function createPlayer(name = "") {
  return { id: createId("player"), name };
}

function createTeam(name = "", playerName = ""): TeamInput {
  return { id: createId("team"), name, players: [createPlayer(playerName)] };
}

const DEFAULT_VALUES: GameConfiguration = {
  gameName: "Friday Night Panto",
  rounds: 3,
  turnDuration: 60,
  teams: [createTeam("The Scene Stealers"), createTeam("The Wild Cards")],
};

export function SetupPage() {
  const returnHome = useGameStore((state) => state.returnHome);
  const startGame = useGameStore((state) => state.startGame);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GameConfiguration>({
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const { fields: teams, append, remove } = useFieldArray({
    control,
    name: "teams",
    keyName: "fieldKey",
    rules: { minLength: { value: 2, message: "Add at least two teams to start." } },
  });

  const submitGame = (values: GameConfiguration) => {
    startGame({
      ...values,
      gameName: values.gameName.trim(),
      teams: values.teams.map((team) => ({
        ...team,
        name: team.name.trim(),
        players: team.players.map((player) => ({ ...player, name: player.name.trim() })),
      })),
    });
  };

  return (
    <main className="min-h-dvh bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="flex items-center justify-between py-5 sm:py-7">
          <Brand />
          <Button variant="ghost" size="sm" onClick={returnHome}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back home
          </Button>
        </header>

        <div className="mb-8 max-w-2xl animate-fade-up">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-primary">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Game setup
          </div>
          <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">Build your dream teams</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
            Add everyone playing, choose the pace, then hand the device to your first actor.
          </p>
        </div>

        <form id="game-setup-form" onSubmit={handleSubmit(submitGame)} noValidate>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Give the night a name</CardTitle>
                  <CardDescription>This will appear during every turn.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="game-name">Game name</Label>
                  <Input
                    id="game-name"
                    autoFocus
                    maxLength={60}
                    aria-invalid={Boolean(errors.gameName)}
                    {...register("gameName", {
                      validate: (value) => value.trim().length > 0 || "Enter a name for your game.",
                    })}
                  />
                  {errors.gameName?.message && <p className="form-error">{errors.gameName.message}</p>}
                </CardContent>
              </Card>

              <section aria-labelledby="teams-heading">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h2 id="teams-heading" className="text-xl font-black tracking-tight">Teams & players</h2>
                    <p className="mt-1 text-sm text-muted-foreground">At least two teams, with one player each.</p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                    {teams.length} teams
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {teams.map((team, teamIndex) => (
                    <TeamEditor
                      key={`${team.fieldKey}-${teamIndex}`}
                      control={control}
                      register={register}
                      errors={errors.teams?.[teamIndex]}
                      teamIndex={teamIndex}
                      canRemoveTeam={teams.length > 2}
                      onRemoveTeam={() => remove(teamIndex)}
                    />
                  ))}
                </div>
                {errors.teams?.root?.message && <p className="form-error mt-3">{errors.teams.root.message}</p>}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => append(createTeam(), { shouldFocus: false })}
                  className="mt-4 w-full border-dashed bg-transparent"
                >
                  <Plus className="h-5 w-5" aria-hidden="true" />
                  Add another team
                </Button>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-6">
              <Card>
                <CardHeader>
                  <CardTitle>Game pace</CardTitle>
                  <CardDescription>Pick a length that fits your group.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Controller
                    name="rounds"
                    control={control}
                    rules={{ validate: (value) => ROUND_OPTIONS.includes(value) || "Choose a valid round count." }}
                    render={({ field }) => (
                      <fieldset>
                        <legend className="mb-3 text-sm font-semibold">Number of rounds</legend>
                        <div className="grid grid-cols-3 gap-2">
                          {ROUND_OPTIONS.map((rounds) => (
                            <SettingChoice
                              key={rounds}
                              name="rounds"
                              label={`${rounds}`}
                              detail={rounds === 3 ? "Quick" : rounds === 5 ? "Classic" : "Epic"}
                              checked={field.value === rounds}
                              onChange={() => field.onChange(rounds)}
                            />
                          ))}
                        </div>
                        {errors.rounds?.message && <p className="form-error mt-2">{errors.rounds.message}</p>}
                      </fieldset>
                    )}
                  />

                  <Separator />

                  <Controller
                    name="turnDuration"
                    control={control}
                    rules={{ validate: (value) => DURATION_OPTIONS.includes(value) || "Choose a valid turn duration." }}
                    render={({ field }) => (
                      <fieldset>
                        <legend className="mb-3 text-sm font-semibold">Turn duration</legend>
                        <div className="space-y-2">
                          {DURATION_OPTIONS.map((duration) => (
                            <SettingChoice
                              key={duration}
                              name="turn-duration"
                              label={`${duration} seconds`}
                              detail={duration === 30 ? "Fast & frantic" : duration === 60 ? "Crowd favorite" : "Room to perform"}
                              checked={field.value === duration}
                              onChange={() => field.onChange(duration)}
                              icon={duration === 60 ? Clock3 : duration === 30 ? RotateCcw : Sparkles}
                            />
                          ))}
                        </div>
                        {errors.turnDuration?.message && <p className="form-error mt-2">{errors.turnDuration.message}</p>}
                      </fieldset>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="hidden lg:block">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  Start the game
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
                <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
                  Everyone ready? The first secret word stays hidden until the actor confirms.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <Button type="submit" form="game-setup-form" size="lg" className="mx-auto flex w-full max-w-6xl" disabled={isSubmitting}>
          Start the game
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </main>
  );
}
