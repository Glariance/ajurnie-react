import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Dumbbell,
  Flame,
  Clock3,
  Repeat2,
  Info,
  ChevronRight,
  Video,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  Target,
} from "lucide-react";

// ================================
// Dark Themed Exercise Detail Page (no framer-motion)
// ================================

const LEVEL_STYLES: Record<string, string> = {
  beginner: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
  intermediate:
    "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  advanced: "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30",
};

const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium shadow-lg shadow-rose-950/30 bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 focus:ring-offset-slate-900 transition";
const SECONDARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition";

function StatChip({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
      <Icon className="size-4 text-slate-300" aria-hidden />
      <div className="text-sm leading-tight">
        <div className="text-slate-300/80">{label}</div>
        <div className="font-semibold text-slate-100">{value}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-slate-800/60 ring-1 ring-white/10 p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2 text-slate-200">
        {Icon ? <Icon className="size-5 text-slate-300" aria-hidden /> : null}
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
          <p className="text-slate-200/90">{it}</p>
        </li>
      ))}
    </ul>
  );
}

function MusclesDiagram({ primary, secondary }: { primary: string[]; secondary: string[] }) {
  const muscles = [
    "Neck", "Shoulders", "Chest", "Upper Back", "Lats", "Biceps", "Triceps", "Forearms",
    "Core", "Lower Back", "Glutes", "Quads", "Hamstrings", "Calves"
  ];
  const level = (name: string) =>
    primary.includes(name) ? "bg-emerald-500" : secondary.includes(name) ? "bg-amber-400" : "bg-slate-700";

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {muscles.map((m) => (
        <div key={m} className="flex items-center gap-3">
          <div className={`h-3 w-10 rounded ${level(m)}`}></div>
          <span className="text-sm text-slate-300">{m}</span>
        </div>
      ))}
    </div>
  );
}

export default function ExerciseDetailPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "steps" | "tips" | "variations">("overview");

  const exercise = useMemo(
    () => ({
      title: "Push-ups",
      level: "beginner",
      short: "Classic bodyweight push exercise for chest, triceps, and core stability.",
      hero: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1974&auto=format&fit=crop",
      equipment: ["Bodyweight"],
      category: "Compound",
      mechanics: "Push",
      forceType: "Push",
      primaryMuscles: ["Chest", "Triceps"],
      secondaryMuscles: ["Shoulders", "Core"],
      steps: [
        "Begin in a high plank: hands slightly wider than shoulders, wrists stacked under elbows, body in a straight line.",
        "Brace your core and squeeze your glutes. Inhale as you lower your chest, keeping elbows at ~45°.",
        "Lower until your chest is just above the floor while maintaining a neutral neck.",
        "Exhale as you press back to the start, driving the floor away and protracting the shoulder blades at the top.",
      ],
      tips: [
        "Keep ribs tucked—avoid arching the lower back.",
        "Screw hands into the floor to create shoulder stability.",
        "Move as one unit; don't let the hips sag or pike up.",
      ],
      mistakes: [
        "Elbows flared at 90° causing shoulder stress.",
        "Head jutting forward; keep a neutral spine.",
        "Partial range of motion from rushing reps.",
      ],
      setsReps: {
        beginner: "3 sets × 8–12 reps",
        intermediate: "4 sets × 10–15 reps",
        advanced: "5 sets × 12–20 reps (+tempo or weight)",
      },
      tempo: "2–1–1 (down–pause–up)",
      rest: "60–90s",
      calories: "~7–10 kcal/min (est.)",
      videoUrl: "#",
    }),
    []
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-6 md:px-6">
        <a
          href="#"
          className="group inline-flex items-center gap-2 text-slate-300 hover:text-white"
          aria-label="Back to Exercise Library"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          <span className="text-sm">Back to Library</span>
        </a>
      </div>

      {/* HERO */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
          <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 ring-1 ring-white/10">
            <div
              className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-slate-950/0 to-slate-950/40 pointer-events-none"
              aria-hidden
            />
            <img
              src={exercise.hero}
              alt={`${exercise.title} demonstration`}
              className="h-80 w-full object-cover md:h-full"
              loading="eager"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {exercise.title}
                </h1>
                <Pill className={LEVEL_STYLES[exercise.level] || LEVEL_STYLES.beginner}>
                  {exercise.level}
                </Pill>
              </div>
              <p className="mt-2 max-w-2xl text-slate-300/90">{exercise.short}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a href={exercise.videoUrl} className={PRIMARY_BUTTON}>
                  <Video className="size-4" /> Watch Demo
                </a>
                <button className={SECONDARY_BUTTON}>
                  <Dumbbell className="size-4" /> Add to Workout
                </button>
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <aside className="grid content-start gap-4">
            <div className="grid gap-3">
              <StatChip icon={Dumbbell} label="Equipment" value={exercise.equipment.join(", ")} />
              <StatChip icon={Target} label="Category" value={exercise.category} />
              <StatChip icon={Gauge} label="Tempo" value={exercise.tempo} />
              <StatChip icon={Clock3} label="Rest" value={exercise.rest} />
              <StatChip icon={Flame} label="Intensity" value={exercise.calories} />
              <StatChip icon={Repeat2} label="Prescription" value={exercise.setsReps[exercise.level]} />
            </div>

            <div className="rounded-2xl bg-slate-800/60 p-4 ring-1 ring-white/10">
              <div className="text-sm text-slate-300/80">Muscle focus</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {exercise.primaryMuscles.map((m) => (
                  <Pill key={m} className="bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
                    {m}
                  </Pill>
                ))}
                {exercise.secondaryMuscles.map((m) => (
                  <Pill key={m} className="bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30">
                    {m}
                  </Pill>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {([
              { id: "overview", label: "Overview" },
              { id: "steps", label: "Steps" },
              { id: "tips", label: "Pro Tips" },
              { id: "variations", label: "Variations" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-sm font-medium ring-1 transition ${
                  activeTab === tab.id
                    ? "bg-slate-700 text-white ring-slate-600"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 ring-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-2">
              <SectionCard title="What it is" icon={Info}>
                <p className="text-slate-200/90">
                  Push-ups are a foundational bodyweight movement emphasizing the chest, triceps,
                  and anterior shoulders, with significant core engagement. They can be adjusted
                  for most levels and require no equipment.
                </p>
              </SectionCard>

              <SectionCard title="Muscles Worked" icon={Target}>
                <MusclesDiagram
                  primary={exercise.primaryMuscles}
                  secondary={exercise.secondaryMuscles}
                />
              </SectionCard>

              <SectionCard title="Suggested Programming" icon={Repeat2}>
                <div className="grid gap-3 text-slate-200/90">
                  <div>
                    <div className="text-slate-300/80">Beginner</div>
                    <div className="font-semibold">{exercise.setsReps.beginner}</div>
                  </div>
                  <div>
                    <div className="text-slate-300/80">Intermediate</div>
                    <div className="font-semibold">{exercise.setsReps.intermediate}</div>
                  </div>
                  <div>
                    <div className="text-slate-300/80">Advanced</div>
                    <div className="font-semibold">{exercise.setsReps.advanced}</div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Common Mistakes" icon={AlertTriangle}>
                <List items={exercise.mistakes} />
              </SectionCard>
            </div>
          )}

          {activeTab === "steps" && (
            <SectionCard title="How to perform" icon={ChevronRight}>
              <ol className="grid gap-3">
                {exercise.steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-slate-200">
                      {i + 1}
                    </span>
                    <p className="text-slate-200/90">{s}</p>
                  </li>
                ))}
              </ol>
            </SectionCard>
          )}

          {activeTab === "tips" && (
            <SectionCard title="Coaching Cues" icon={CheckCircle2}>
              <List items={exercise.tips} />
            </SectionCard>
          )}

          {activeTab === "variations" && (
            <div className="grid gap-6 md:grid-cols-2">
              <SectionCard title="Regressions (Easier)">
                <List
                  items={[
                    "Incline Push-up (hands on bench)",
                    "Knee Push-up",
                    "Hands-elevated with reduced ROM",
                  ]}
                />
              </SectionCard>
              <SectionCard title="Progressions (Harder)">
                <List
                  items={[
                    "Feet-elevated Push-up",
                    "Tempo or Paused Push-ups",
                    "Weighted (plate or vest)",
                  ]}
                />
              </SectionCard>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-800/40 p-5 ring-1 ring-white/10">
          <div>
            <h4 className="text-lg font-semibold">Ready to train {exercise.title}?</h4>
            <p className="text-sm text-slate-300/90">Add this movement to your plan or start a quick workout with a built‑in timer.</p>
          </div>
          <div className="flex gap-3">
            <button className={SECONDARY_BUTTON}>
              <Clock3 className="size-4" /> Start 10‑min Session
            </button>
            <button className={PRIMARY_BUTTON}>
              <Dumbbell className="size-4" /> Add to Plan
            </button>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}
