import { ArrowRight, Clock3, EyeOff, Sparkles, UsersRound } from "lucide-react";

import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGameStore } from "@/store/game-store";

const STEPS = [
  { icon: UsersRound, label: "Make your teams", detail: "Add friends and pick your rounds." },
  { icon: EyeOff, label: "Reveal in secret", detail: "Only the actor sees the word." },
  { icon: Clock3, label: "Act against time", detail: "Guess, score, and pass it on." },
];

export function HomePage() {
  const openSetup = useGameStore((state) => state.openSetup);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-hero text-white">
      <div className="party-orb party-orb-one" aria-hidden="true" />
      <div className="party-orb party-orb-two" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-4 sm:px-6">
        <header className="flex items-center justify-between py-6 sm:py-8">
          <Brand light />
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100 backdrop-blur">
            No sign-in. Just play.
          </span>
        </header>

        <section className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3.5 py-2 text-sm font-semibold text-violet-100">
              <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
              One device. Every friend. Zero awkward rules.
            </div>
            <h1 className="text-balance text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Big gestures.
              <span className="block text-party-yellow">Bigger laughs.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-violet-100/80 sm:text-xl">
              A fast local charades game built for passing around the room. Split into teams, race the timer, and claim party glory.
            </p>
            <Button
              size="lg"
              onClick={openSetup}
              className="mt-8 w-full bg-party-yellow text-slate-950 shadow-[0_18px_50px_-16px_rgba(250,204,21,0.8)] hover:bg-yellow-300 sm:w-auto"
            >
              Start a new game
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <p className="mt-4 text-sm font-medium text-violet-200/70">Takes about a minute to set up.</p>
          </div>

          <Card className="relative border-white/10 bg-white/[0.08] p-3 shadow-2xl backdrop-blur-xl lg:rotate-1">
            <div className="rounded-[1.25rem] border border-white/10 bg-[#211b42]/90 p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">How it works</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-400/15 text-lg">🎭</span>
              </div>
              <div className="mt-6 space-y-3">
                {STEPS.map(({ icon: Icon, label, detail }, index) => (
                  <div key={label} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-500/20 text-violet-200">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-bold text-white">
                        <span className="mr-2 text-violet-400">0{index + 1}</span>
                        {label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-violet-200/65">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm">
                <span className="font-semibold text-emerald-200">Party-ready</span>
                <span className="text-emerald-300/70">2+ teams • 3–7 rounds</span>
              </div>
            </div>
          </Card>
        </section>

        <footer className="py-5 text-center text-xs text-violet-200/50 sm:text-left">Made for game nights, living rooms, and dramatic friends.</footer>
      </div>
    </main>
  );
}
