"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Difficulty = "easy" | "normal" | "hard";
type Phase = "intro" | "booting" | "active" | "complete";
type SystemState = "stable" | "repair";

type LogEntry = {
  id: string;
  target: string;
};

type ActivityEntry = {
  id: string;
  target: string;
  attempts: number;
  repairedAtMs: number;
};

type GameStatus = {
  active: boolean;
  repaired: number;
  total: number;
};

type SystemIntegrityGameProps = {
  onStatusChange?: (status: GameStatus) => void;
};

const difficultyCopy: Record<
  Difficulty,
  {
    label: string;
    short: string;
    hint: string;
    logsRequired: number;
    stableDelay: number;
  }
> = {
  easy: {
    label: "Easy",
    short: "Friendly",
    hint: "Just a few blanks across separate words, with a slow and readable repair pace.",
    logsRequired: 4,
    stableDelay: 1800,
  },
  normal: {
    label: "Normal",
    short: "Balanced",
    hint: "Slight distortions, quicker corruption, still readable without frustration.",
    logsRequired: 5,
    stableDelay: 1300,
  },
  hard: {
    label: "Hard",
    short: "Advanced",
    hint: "Noise symbols, rapid distortion, and less forgiving recovery windows.",
    logsRequired: 6,
    stableDelay: 950,
  },
};

const baseLogs: LogEntry[] = [
  { id: "integrity", target: "SYSTEM LOG: INTEGRITY CHECK FAILURE" },
  { id: "latency", target: "DIAGNOSTIC ALERT: NETWORK LATENCY SPIKE DETECTED" },
  { id: "mirror", target: "ARCHIVE MIRROR: INDEX REBUILD REQUIRED" },
  { id: "auth", target: "ACCESS LAYER: TOKEN VALIDATION DESYNCHRONIZED" },
  { id: "cache", target: "MEMORY CACHE: PRIMARY SEGMENT REPAIR QUEUED" },
  { id: "telemetry", target: "TELEMETRY CORE: SENSOR STREAM RESTORED" },
  { id: "checksum", target: "CHECKSUM MODULE: SIGNATURE TABLE CORRUPTED" },
  { id: "handoff", target: "SERVICE HANDOFF: FAILOVER ROUTINE PENDING" },
];

const bootMessages = [
  "Initializing diagnostic environment...",
  "Mounting system archives...",
  "Verifying operator input channel...",
  "Scanning log clusters for anomalies...",
];

function corruptText(target: string, difficulty: Difficulty, level: number) {
  const chars = target.split("");
  const letterIndexes = chars
    .map((char, index) => ({ char, index }))
    .filter((item) => /[A-Z]/.test(item.char))
    .map((item) => item.index);

  if (difficulty === "easy") {
    const wordMatches = [...target.matchAll(/[A-Z]+/g)];
    const eligibleWords = wordMatches.filter((match) => (match[0]?.length ?? 0) > 2);
    const wordPool = eligibleWords.length > 0 ? eligibleWords : wordMatches;
    const blanksWanted = Math.min(Math.floor(Math.random() * 3) + 1, wordPool.length);
    const chosenWords = new Set<number>();
    const chosenIndexes = new Set<number>();

    while (chosenWords.size < blanksWanted && chosenWords.size < wordPool.length) {
      const nextWordIndex = Math.floor(Math.random() * wordPool.length);

      if (chosenWords.has(nextWordIndex)) {
        continue;
      }

      chosenWords.add(nextWordIndex);
      const match = wordPool[nextWordIndex];
      const start = match.index ?? 0;
      const word = match[0] ?? "";
      const letterOffset = Math.floor(Math.random() * word.length);
      chosenIndexes.add(start + letterOffset);
    }

    return chars.map((char, index) => (chosenIndexes.has(index) ? "_" : char)).join("");
  }

  const maxMutations =
    difficulty === "normal"
      ? Math.min(8 + level, Math.max(5, Math.floor(letterIndexes.length * 0.28)))
      : Math.min(11 + level, Math.max(7, Math.floor(letterIndexes.length * 0.36)));

  const chosen = new Set<number>();

  while (chosen.size < Math.min(maxMutations, letterIndexes.length)) {
    const randomIndex = Math.floor(Math.random() * letterIndexes.length);
    chosen.add(letterIndexes[randomIndex]);
  }

  const noisy = ["#", "?", "%", "=", "*"];

  return chars
    .map((char, index) => {
      if (!chosen.has(index)) {
        return char;
      }

      if (difficulty === "normal") {
        return Math.random() > 0.55 ? "_" : chars[Math.max(0, index - 1)] ?? "_";
      }

      const randomNoise = noisy[Math.floor(Math.random() * noisy.length)];
      return Math.random() > 0.45 ? randomNoise : "_";
    })
    .join("");
}

function shuffleLogs(logs: LogEntry[]) {
  const next = [...logs];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function SystemIntegrityGame({ onStatusChange }: SystemIntegrityGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [phase, setPhase] = useState<Phase>("intro");
  const [bootStep, setBootStep] = useState(0);
  const [systemState, setSystemState] = useState<SystemState>("stable");
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [repairAttempts, setRepairAttempts] = useState(0);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [pulseMessage, setPulseMessage] = useState("System standing by.");
  const [showReport, setShowReport] = useState(false);
  const [errorFlash, setErrorFlash] = useState(false);

  const stableTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedLogs = useMemo(() => {
    const shuffled = shuffleLogs(baseLogs);
    return shuffled.slice(0, difficultyCopy[difficulty].logsRequired);
  }, [difficulty]);

  const currentLog = selectedLogs[activeIndex];

  const corruptedText = useMemo(() => {
    if (!currentLog) {
      return "";
    }

    return corruptText(currentLog.target, difficulty, activeIndex);
  }, [activeIndex, currentLog, difficulty]);

  useEffect(() => {
    if (phase !== "booting") {
      return undefined;
    }

    const interval = setInterval(() => {
      setBootStep((current) => {
        if (current >= bootMessages.length - 1) {
          clearInterval(interval);
          setPhase("active");
          setSystemState("stable");
          setPulseMessage("Diagnostic environment active.");
          setStartTime(Date.now());
          return current;
        }

        return current + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "active") {
      return undefined;
    }

    if (systemState !== "stable") {
      return undefined;
    }

    if (activeIndex >= selectedLogs.length) {
      setPhase("complete");
      setEndTime(Date.now());
      setPulseMessage("System integrity restored.");
      return undefined;
    }

    stableTimeoutRef.current = setTimeout(() => {
      setSystemState("repair");
      setPulseMessage(`Corruption detected in cluster ${activeIndex + 1}.`);
      setInputValue("");
      setAttemptCount(0);
      inputRef.current?.focus();
    }, difficultyCopy[difficulty].stableDelay);

    return () => {
      if (stableTimeoutRef.current) {
        clearTimeout(stableTimeoutRef.current);
      }
    };
  }, [activeIndex, difficulty, phase, selectedLogs.length, systemState]);

  useEffect(() => {
    if (systemState === "repair") {
      inputRef.current?.focus();
    }
  }, [systemState]);

  useEffect(() => {
    if (!errorFlash) {
      return undefined;
    }

    const timeout = setTimeout(() => setErrorFlash(false), 280);
    return () => clearTimeout(timeout);
  }, [errorFlash]);

  useEffect(() => {
    const body = document.body;
    const breachActive = phase !== "intro";

    body.classList.toggle("system-breach", breachActive);

    return () => {
      body.classList.remove("system-breach");
    };
  }, [phase]);

  const accuracy = repairAttempts === 0 ? 100 : Math.round((activityLog.length / repairAttempts) * 100);
  const elapsedMs = startTime === null ? 0 : (endTime ?? Date.now()) - startTime;

  useEffect(() => {
    onStatusChange?.({
      active: phase !== "intro",
      repaired: activityLog.length,
      total: selectedLogs.length,
    });
  }, [activityLog.length, onStatusChange, phase, selectedLogs.length]);

  function initializeScan() {
    setPhase("booting");
    setBootStep(0);
    setSystemState("stable");
    setActiveIndex(0);
    setInputValue("");
    setAttemptCount(0);
    setRepairAttempts(0);
    setActivityLog([]);
    setStartTime(null);
    setEndTime(null);
    setPulseMessage("Preparing boot sequence...");
    setShowReport(false);
    setErrorFlash(false);
  }

  function quitScan() {
    if (stableTimeoutRef.current) {
      clearTimeout(stableTimeoutRef.current);
    }

    setPhase("intro");
    setBootStep(0);
    setSystemState("stable");
    setActiveIndex(0);
    setInputValue("");
    setAttemptCount(0);
    setRepairAttempts(0);
    setActivityLog([]);
    setStartTime(null);
    setEndTime(null);
    setPulseMessage("System standing by.");
    setShowReport(false);
    setErrorFlash(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentLog || systemState !== "repair") {
      return;
    }

    const normalized = inputValue.trim().toUpperCase();
    const nextAttempt = attemptCount + 1;

    setAttemptCount(nextAttempt);
    setRepairAttempts((count) => count + 1);

    if (normalized === currentLog.target) {
      const repairedAtMs = startTime ? Date.now() - startTime : 0;

      setActivityLog((entries) => [
        ...entries,
        {
          id: currentLog.id,
          target: currentLog.target,
          attempts: nextAttempt,
          repairedAtMs,
        },
      ]);
      setSystemState("stable");
      setPulseMessage(`Cluster ${activeIndex + 1} repaired successfully.`);
      setActiveIndex((index) => index + 1);
      setInputValue("");
      return;
    }

    setErrorFlash(true);
    setPulseMessage("Mismatch detected. Reconstruct the log and retry.");
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12" id="integrity-mode">
      <div className="section-heading">
        <p className="section-kicker">Mini Game</p>
        <h2 className="section-title">System Integrity Repair Mode</h2>
        <p className="mt-5 max-w-3xl text-[var(--soft)]">
          Diagnose and restore corrupted system logs through interactive repair tasks. Built to feel like a polished diagnostic console rather than a separate arcade-style game.
        </p>
      </div>

      <div className="mt-10 rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(13,25,39,0.94),rgba(18,32,47,0.92))] p-6 text-slate-100 shadow-[0_30px_90px_rgba(13,25,39,0.18)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/80">
              Diagnostic Console
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
              This mini-game showcases UI/UX interaction design, debugging logic, and state-based system design through a controlled typing-based repair experience.
            </p>
          </div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-200">
            {phase === "intro"
              ? "Standby"
              : phase === "booting"
                ? "Booting"
                : phase === "active"
                  ? systemState === "repair"
                    ? "Repair Active"
                    : "System Stable"
                  : "Integrity Restored"}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Skill signals</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["UI/UX interaction design", "Debugging logic", "State-based system design"].map((item) => (
                  <span className="system-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Difficulty</p>
              <div className="mt-4 grid gap-3">
                {(["easy", "normal", "hard"] as Difficulty[]).map((option) => (
                  <button
                    className={`difficulty-button ${difficulty === option ? "difficulty-button-active" : ""}`}
                    disabled={phase !== "intro" && phase !== "complete"}
                    key={option}
                    onClick={() => setDifficulty(option)}
                    type="button"
                  >
                    <span>
                      <span className="block font-display text-lg text-white">
                        {difficultyCopy[option].label}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-slate-400">
                        {difficultyCopy[option].short}
                      </span>
                    </span>
                    <span className="text-right text-xs leading-6 text-slate-300">
                      {difficultyCopy[option].hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Status pulse</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{pulseMessage}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                <span>{difficultyCopy[difficulty].logsRequired} logs queued</span>
                <span>{repairAttempts} attempts</span>
                <span>{activityLog.length} repaired</span>
              </div>
            </div>
          </div>

          <div className={`terminal-shell ${errorFlash ? "terminal-shell-alert" : ""}`}>
            {phase === "intro" && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">System overview</p>
                  <h3 className="mt-3 font-display text-3xl text-white">Repair readable anomalies before they cascade.</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                    You are the operator. Once the scan starts, corrupted logs will surface at controlled intervals. Rebuild each line exactly to stabilize the system.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="terminal-card">
                    <span className="terminal-card-label">Default mode</span>
                    <span className="terminal-card-value">Easy</span>
                  </div>
                  <div className="terminal-card">
                    <span className="terminal-card-label">Core mechanic</span>
                    <span className="terminal-card-value">Type to repair</span>
                  </div>
                  <div className="terminal-card">
                    <span className="terminal-card-label">Feel</span>
                    <span className="terminal-card-value">Diagnostic UI</span>
                  </div>
                </div>

                <button className="system-cta" onClick={initializeScan} type="button">
                  Initialize System Scan
                </button>
              </div>
            )}

            {phase === "booting" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">Boot sequence</p>
                  <button className="system-ghost" onClick={quitScan} type="button">
                    Quit Scan
                  </button>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 font-mono text-sm text-emerald-200">
                  {bootMessages.slice(0, bootStep + 1).map((message) => (
                    <p className="boot-line" key={message}>
                      {`> ${message}`}
                    </p>
                  ))}
                  <p className="mt-3 text-slate-400">
                    Awaiting scan stabilization<span className="terminal-caret">_</span>
                  </p>
                </div>
              </div>
            )}

            {phase === "active" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">Live repair cycle</p>
                    <h3 className="mt-2 font-display text-2xl text-white">
                      {systemState === "stable" ? "System stable. Monitoring..." : `Corruption event ${activeIndex + 1}`}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                      {activityLog.length}/{selectedLogs.length} repaired
                    </div>
                    <button className="system-ghost" onClick={quitScan} type="button">
                      Quit Scan
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="terminal-card">
                    <span className="terminal-card-label">Accuracy</span>
                    <span className="terminal-card-value">{accuracy}%</span>
                  </div>
                  <div className="terminal-card">
                    <span className="terminal-card-label">Elapsed</span>
                    <span className="terminal-card-value">{formatDuration(elapsedMs)}</span>
                  </div>
                  <div className="terminal-card">
                    <span className="terminal-card-label">Mode</span>
                    <span className="terminal-card-value">{difficultyCopy[difficulty].label}</span>
                  </div>
                </div>

                {systemState === "stable" ? (
                  <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
                    <p className="font-mono text-sm leading-7 text-emerald-200">
                      {`> log cluster ${Math.min(activeIndex + 1, selectedLogs.length)} queued for observation`}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      The console is scanning for the next anomaly. Stay ready, repair window will open automatically.
                    </p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-amber-100/80">Corrupted log</p>
                      <p className="mt-4 break-words font-mono text-lg leading-8 text-amber-50">
                        {corruptedText}
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                      <label className="block text-xs uppercase tracking-[0.22em] text-slate-400" htmlFor="repair-input">
                        Reconstruct full system text
                      </label>
                      <input
                        autoCapitalize="characters"
                        autoCorrect="off"
                        className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-4 font-mono text-sm uppercase tracking-[0.08em] text-slate-100 outline-none transition focus:border-sky-300/50"
                        id="repair-input"
                        onChange={(event) => setInputValue(event.target.value.toUpperCase())}
                        placeholder="TYPE THE REPAIRED LOG EXACTLY"
                        ref={inputRef}
                        spellCheck={false}
                        value={inputValue}
                      />
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Attempt {attemptCount + 1}
                        </p>
                        <button className="system-cta" type="submit">
                          Repair Log
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {phase === "complete" && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">Summary</p>
                  <h3 className="mt-3 font-display text-3xl text-white">System Integrity Restored</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    All queued log anomalies have been repaired and the diagnostic environment has returned to a stable state.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="terminal-card">
                    <span className="terminal-card-label">Logs repaired</span>
                    <span className="terminal-card-value">{activityLog.length}</span>
                  </div>
                  <div className="terminal-card">
                    <span className="terminal-card-label">Accuracy</span>
                    <span className="terminal-card-value">{accuracy}%</span>
                  </div>
                  <div className="terminal-card">
                    <span className="terminal-card-label">Time taken</span>
                    <span className="terminal-card-value">{formatDuration(elapsedMs)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="system-cta" onClick={initializeScan} type="button">
                    Replay Scan
                  </button>
                  <button className="system-ghost" onClick={quitScan} type="button">
                    Quit Scan
                  </button>
                  <button className="system-ghost" onClick={() => setShowReport((current) => !current)} type="button">
                    {showReport ? "Hide Diagnostic Report" : "View Diagnostic Report"}
                  </button>
                </div>

                {showReport && (
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Repair history</p>
                    <div className="mt-4 space-y-3">
                      {activityLog.map((entry, index) => (
                        <div className="rounded-2xl border border-white/8 bg-white/5 p-4" key={entry.id}>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="font-mono text-sm text-slate-100">{entry.target}</p>
                            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                              {`Repair ${index + 1}`}
                            </span>
                          </div>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                            {`${entry.attempts} attempt${entry.attempts === 1 ? "" : "s"} - ${formatDuration(entry.repairedAtMs)}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
