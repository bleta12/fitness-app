import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";


// --- Types ---
type SleepEntry = { date: string; hours: number };

// --- Helpers ---
const formatDateLabel = (iso: string) => new Date(iso).toLocaleDateString(undefined, { weekday: "short" });
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Persist/restore from localStorage
const useLocalStorage = <T,>(key: string, initial: T) => {
    const [value, setValue] = useState<T>(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? (JSON.parse(raw) as T) : initial;
        } catch {
            return initial;
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch { }
    }, [key, value]);
    return [value, setValue] as const;
};

// --- UI atoms ---
const Card: React.FC<React.PropsWithChildren<{ className?: string; title?: string; subtitle?: string }>> = ({ className = "", children, title, subtitle }) => (
    <div className={`rounded-2xl shadow-sm border border-gray-100 bg-white p-5 ${className}`}>
        {(title || subtitle) && (
            <header className="mb-3">
                {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </header>
        )}
        {children}
    </div>
);

const SectionHeader: React.FC<{ icon?: React.ReactNode; title: string; desc?: string }> = ({ icon, title, desc }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 grid place-items-center rounded-xl bg-green-50 text-green-600 text-xl">{icon ?? "🧘"}</div>
        <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {desc && <p className="text-sm text-gray-500">{desc}</p>}
        </div>
    </div>
);

// --- Sleep Tracking ---
const genLast7Days = (): string[] => {
    const arr: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);
        arr.push(d.toISOString());
    }
    return arr;
};

const SleepTracking: React.FC = () => {
    const [goal, setGoal] = useLocalStorage<number>("sleep_goal", 8);
    const [entries, setEntries] = useLocalStorage<SleepEntry[]>("sleep_entries", []);
    const days = useMemo(() => genLast7Days(), []);

    // Ensure we have an entry for each of the last 7 days (default 0)
    const weekly: SleepEntry[] = useMemo(() => {
        const map = new Map(entries.map((e) => [new Date(e.date).toDateString(), e.hours]));
        return days.map((iso) => ({ date: iso, hours: map.get(new Date(iso).toDateString()) ?? 0 }));
    }, [entries, days]);

    const lastNight = weekly[weekly.length - 1]?.hours ?? 0;
    const avg = weekly.reduce((s, e) => s + e.hours, 0) / weekly.length;

    const [todayHours, setTodayHours] = useState<number>(lastNight);
    useEffect(() => setTodayHours(lastNight), [lastNight]);

    const saveToday = () => {
        const iso = new Date(days[days.length - 1]).toISOString();
        const newEntries = entries.filter((e) => new Date(e.date).toDateString() !== new Date(iso).toDateString());
        newEntries.push({ date: iso, hours: clamp(todayHours, 0, 24) });
        setEntries(newEntries);
    };

    const tip = useMemo(() => {
        if (avg < goal - 1) return "You're averaging less than your goal. Try a consistent bedtime and dim screens 60 minutes before sleep.";
        if (lastNight < goal - 1) return "Last night was short. A 20–30 min power nap can help—avoid after 4pm.";
        if (avg >= goal) return "Great consistency! Keep your wind‑down routine and hydration steady.";
        return "You're close to your goal. Aim to keep the same wake time, even on weekends.";
    }, [avg, goal, lastNight]);

    const maxBar = Math.max(8, ...weekly.map((e) => e.hours));

    return (
        <Card title="Sleep" subtitle="Track sleep and get quick recommendations.">
            <div className="grid md:grid-cols-3 gap-5">
                {/* Summary */}
                <div className="md:col-span-1 space-y-3">
                    <div className="flex items-end gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Last night</p>
                            <p className="text-3xl font-semibold">{lastNight.toFixed(1)}<span className="text-base font-normal text-gray-500"> h</span></p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Weekly avg</p>
                            <p className="text-3xl font-semibold">{avg.toFixed(1)}<span className="text-base font-normal text-gray-500"> h</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600">Goal</label>
                        <input type="range" min={6} max={10} step={0.5} value={goal} onChange={(e) => setGoal(parseFloat(e.target.value))} className="w-full" />
                        <span className="text-sm font-medium">{goal}h</span>
                    </div>

                    <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800">{tip}</div>

                    <div className="border-t pt-3">
                        <label className="block text-sm text-gray-600 mb-1">Log today</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={0}
                                max={24}
                                step={0.25}
                                value={todayHours}
                                onChange={(e) => setTodayHours(parseFloat(e.target.value))}
                                className="w-24 rounded-lg border border-gray-200 px-3 py-2"
                            />
                            <button onClick={saveToday} className="rounded-lg px-3 py-2 bg-gray-900 text-white hover:bg-gray-800">Save</button>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="md:col-span-2">
                    <div className="flex items-end gap-3 h-40">
                        {weekly.map((e, i) => {
                            const ratio = e.hours / maxBar;
                            return (
                                <div key={i} className="flex flex-col items-center flex-1">
                                    <div className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500/60 to-indigo-500" style={{ height: `${ratio * 100}%` }} />
                                    <div className="mt-1 text-xs text-gray-500">{formatDateLabel(e.date)}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Bars show hours slept each day (goal {goal}h).</div>
                </div>
            </div>
        </Card>
    );
};

// --- Breathing / Meditation ---
const phases = [
    { name: "Inhale", seconds: 4 },
    { name: "Hold", seconds: 4 },
    { name: "Exhale", seconds: 6 },
];

type BreathState = { running: boolean; remaining: number; phaseIndex: number; roundsLeft: number };

const Breathing: React.FC = () => {
    const [minutes, setMinutes] = useLocalStorage<number>("meditation_minutes", 5);
    const [state, setState] = useState<BreathState>({ running: false, remaining: phases[0].seconds, phaseIndex: 0, roundsLeft: (5 * 60) / 14 });
    const intervalRef = useRef<number | null>(null);

    const totalPerRound = phases.reduce((s, p) => s + p.seconds, 0); // 14s

    const start = () => {
        const targetRounds = Math.max(1, Math.floor((minutes * 60) / totalPerRound));
        setState({ running: true, remaining: phases[0].seconds, phaseIndex: 0, roundsLeft: targetRounds });
    };
    const stop = () => {
        setState((s) => ({ ...s, running: false }));
    };
    const reset = () => setState({ running: false, remaining: phases[0].seconds, phaseIndex: 0, roundsLeft: Math.max(1, Math.floor((minutes * 60) / totalPerRound)) });

    useEffect(() => {
        if (!state.running) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            intervalRef.current = null;
            return;
        }
        intervalRef.current = window.setInterval(() => {
            setState((s) => {
                if (!s.running) return s;
                if (s.remaining > 1) return { ...s, remaining: s.remaining - 1 };
                // phase transition
                const nextPhase = (s.phaseIndex + 1) % phases.length;
                const nextRoundsLeft = nextPhase === 0 ? Math.max(0, s.roundsLeft - 1) : s.roundsLeft;
                const done = nextPhase === 0 && nextRoundsLeft === 0;
                return done ? { ...s, running: false } : { running: true, remaining: phases[nextPhase].seconds, phaseIndex: nextPhase, roundsLeft: nextRoundsLeft };
            });
        }, 1000);
        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        };
    }, [state.running]);

    const curPhase = phases[state.phaseIndex];
    const progress = useMemo(() => {
        const totalSeconds = Math.max(1, Math.floor((minutes * 60) / totalPerRound) * totalPerRound);
        const doneSeconds = (Math.max(0, Math.floor((Math.max(1, Math.floor((minutes * 60) / totalPerRound)) - state.roundsLeft))) * totalPerRound) + (curPhase.seconds - state.remaining);
        return clamp(doneSeconds / totalSeconds, 0, 1);
    }, [minutes, state.roundsLeft, state.remaining, state.phaseIndex]);

    return (
        <Card title="Meditation & Breathing" subtitle="Guided 4-4-6 rhythm with a calming visual.">
            <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Visual */}
                <div className="flex flex-col items-center">
                    <div
                        className={`relative grid place-items-center rounded-full bg-indigo-100/60 h-52 w-52 transition-all duration-700 ${state.running ? "animate-[pulse-scale_1s_ease-in-out_infinite]" : ""}`}
                        style={{
                            boxShadow: "inset 0 0 40px rgba(99,102,241,0.25)",
                            transform: `scale(${curPhase.name === "Inhale" ? 1.08 : curPhase.name === "Exhale" ? 0.92 : 1})`,
                        }}
                    >
                        <span className="text-xl font-semibold text-indigo-700">{curPhase.name}</span>
                        <span className="absolute bottom-4 text-sm text-indigo-600">{state.remaining}s</span>
                    </div>
                    <div className="mt-3 w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${progress * 100}%` }} />
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600">Session length</label>
                        <input type="range" min={3} max={15} step={1} value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value))} className="w-full" />
                        <span className="text-sm font-medium">{minutes}m</span>
                    </div>

                    <div className="flex gap-2">
                        {!state.running ? (
                            <button onClick={start} className="rounded-lg px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500">Start</button>
                        ) : (
                            <button onClick={stop} className="rounded-lg px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50">Pause</button>
                        )}
                        <button onClick={reset} className="rounded-lg px-4 py-2 bg-gray-900 text-white hover:bg-gray-800">Reset</button>
                    </div>

                    <ul className="text-sm text-gray-600 list-disc pl-5">
                        <li>Inhale 4s → Hold 4s → Exhale 6s</li>
                        <li>Keep shoulders relaxed; breathe through the nose.</li>
                        <li>Best done in a quiet place for 5–10 minutes.</li>
                    </ul>
                </div>
            </div>

            {/* keyframes for subtle pulsing */}
            <style>{`
        @keyframes pulse-scale { 0%,100%{ transform: scale(1);} 50%{ transform: scale(1.04);} }
      `}</style>
        </Card>
    );
};

// --- Stretching Routines ---
type StretchStep = { name: string; seconds: number };

type Routine = { id: string; title: string; focus: "Full Body" | "Upper" | "Lower"; steps: StretchStep[] };

const DEFAULT_ROUTINES: Routine[] = [
    {
        id: "r1",
        title: "Full Body Cool‑down (8 min)",
        focus: "Full Body",
        steps: [
            { name: "Neck circles", seconds: 60 },
            { name: "Shoulder rolls", seconds: 60 },
            { name: "Chest opener", seconds: 90 },
            { name: "Cat‑cow", seconds: 90 },
            { name: "Hamstring stretch (L)", seconds: 60 },
            { name: "Hamstring stretch (R)", seconds: 60 },
            { name: "Quad stretch (L)", seconds: 60 },
            { name: "Quad stretch (R)", seconds: 60 },
        ],
    },
    {
        id: "r2",
        title: "Upper Body Mobility (6 min)",
        focus: "Upper",
        steps: [
            { name: "T‑spine rotations", seconds: 90 },
            { name: "Doorway pec stretch", seconds: 90 },
            { name: "Tricep stretch (L)", seconds: 60 },
            { name: "Tricep stretch (R)", seconds: 60 },
            { name: "Wrist flexor/extensor", seconds: 60 },
        ],
    },
    {
        id: "r3",
        title: "Lower Body Post‑leg day (7 min)",
        focus: "Lower",
        steps: [
            { name: "Hip flexor lunge (L)", seconds: 60 },
            { name: "Hip flexor lunge (R)", seconds: 60 },
            { name: "Figure‑4 glute (L)", seconds: 60 },
            { name: "Figure‑4 glute (R)", seconds: 60 },
            { name: "Calf stretch (wall)", seconds: 90 },
            { name: "Child's pose", seconds: 90 },
        ],
    },
];

const RoutineRunner: React.FC<{ routine: Routine; onClose: () => void }> = ({ routine, onClose }) => {
    const [idx, setIdx] = useState(0);
    const [remaining, setRemaining] = useState(routine.steps[0].seconds);
    const [running, setRunning] = useState(true);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (!running) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            intervalRef.current = null;
            return;
        }
        intervalRef.current = window.setInterval(() => {
            setRemaining((r) => {
                if (r > 1) return r - 1;
                // move to next step or finish
                setIdx((i) => {
                    const next = i + 1;
                    if (next >= routine.steps.length) {
                        setRunning(false);
                        return i;
                    }
                    setRemaining(routine.steps[next].seconds);
                    return next;
                });
                return 0;
            });
        }, 1000);
        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        };
    }, [running, routine.steps]);

    const step = routine.steps[idx];
    const totalSeconds = routine.steps.reduce((s, a) => s + a.seconds, 0);
    const doneSeconds = routine.steps.slice(0, idx).reduce((s, a) => s + a.seconds, 0) + (step ? step.seconds - remaining : totalSeconds);
    const progress = clamp(doneSeconds / totalSeconds, 0, 1);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm grid place-items-center p-4 z-50">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold">{routine.title}</h3>
                        <p className="text-sm text-gray-500">{routine.focus} • {Math.round(totalSeconds / 60)} min</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg px-3 py-2 bg-gray-100 hover:bg-gray-200">Close</button>
                </div>

                <div className="mt-4">
                    {step ? (
                        <div className="space-y-3">
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Current step</p>
                                <p className="text-2xl font-semibold">{step.name}</p>
                                <p className="text-sm text-gray-600 mt-1">Hold steady, breathe calmly.</p>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${progress * 100}%` }} /></div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Time left this step</span>
                                <span className="font-medium">{remaining}s</span>
                            </div>
                            <div className="flex gap-2">
                                {!running ? (
                                    <button onClick={() => setRunning(true)} className="rounded-lg px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500">Resume</button>
                                ) : (
                                    <button onClick={() => setRunning(false)} className="rounded-lg px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50">Pause</button>
                                )}
                                <button
                                    onClick={() => {
                                        setIdx((i) => clamp(i + 1, 0, routine.steps.length - 1));
                                        const next = clamp(idx + 1, 0, routine.steps.length - 1);
                                        setRemaining(routine.steps[next].seconds);
                                    }}
                                    className="rounded-lg px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50"
                                >
                                    Skip
                                </button>
                                <button onClick={() => { setIdx(0); setRemaining(routine.steps[0].seconds); setRunning(true); }} className="rounded-lg px-4 py-2 bg-gray-900 text-white hover:bg-gray-800">Restart</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-3">
                            <p className="text-xl font-semibold">Nice work! 🥳</p>
                            <p className="text-gray-600">Routine completed. Hydrate and breathe.</p>
                            <button onClick={onClose} className="rounded-lg px-4 py-2 bg-gray-900 text-white hover:bg-gray-800">Done</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StretchingRoutines: React.FC = () => {
    const [favs, setFavs] = useLocalStorage<string[]>("stretch_favs", []);
    const [filter, setFilter] = useState<"All" | Routine["focus"]>("All");
    const [active, setActive] = useState<Routine | null>(null);

    const toggleFav = (id: string) => setFavs((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

    const routines = DEFAULT_ROUTINES.filter((r) => (filter === "All" ? true : r.focus === filter));

    return (
        <Card title="Stretching Routines" subtitle="Quick sequences for recovery after your workouts.">
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {(["All", "Full Body", "Upper", "Lower"] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 rounded-full text-sm border ${filter === f ? "bg-emerald-600 text-white border-emerald-600" : "bg-white hover:bg-gray-50 border-gray-200"}`}>{f}</button>
                ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {routines.map((r) => {
                    const totalMin = Math.round(r.steps.reduce((s, a) => s + a.seconds, 0) / 60);
                    const isFav = favs.includes(r.id);
                    return (
                        <div key={r.id} className="rounded-xl border border-gray-100 p-4 bg-white">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{r.title}</h4>
                                    <p className="text-sm text-gray-500">{r.focus} • {totalMin} min</p>
                                </div>
                                <button onClick={() => toggleFav(r.id)} className={`h-9 w-9 rounded-lg border ${isFav ? "bg-yellow-400/20 border-yellow-300" : "bg-white border-gray-200"}`}>{isFav ? "★" : "☆"}</button>
                            </div>
                            <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1 max-h-28 overflow-auto pr-2">
                                {r.steps.map((s, i) => (
                                    <li key={i} className="flex justify-between"><span>{s.name}</span><span className="text-gray-500">{s.seconds}s</span></li>
                                ))}
                            </ul>
                            <button onClick={() => setActive(r)} className="mt-3 w-full rounded-lg px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-500">Start</button>
                        </div>
                    );
                })}
            </div>

            {active && <RoutineRunner routine={active} onClose={() => setActive(null)} />}
        </Card>
    );
};

// --- Page wrapper ---
const RecoveryWellness: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
            {/* Navbar */}
            <Navbar />

            <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
                <SectionHeader title="Recovery & Wellness" desc="Sleep, meditation and stretching to boost recovery and performance." />
                <SleepTracking />
                <Breathing />
                <StretchingRoutines />
            </div>
        </div>
    );
};

export default RecoveryWellness;
