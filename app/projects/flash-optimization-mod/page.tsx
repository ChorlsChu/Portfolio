import Image from "next/image";
import Reveal from "../../components/reveal";

const highlights = [
  "Expanded the campaign with new boss encounters for Order and Chaos factions.",
  "Added new boss abilities, phases, passives, cosmetics, summons, and level events.",
  "Improved enemy campaign behavior with stronger army advantage checks and less awkward cautious attacks.",
  "Added replayable completed levels and campaign-map access to the upgrade screen.",
  "Fixed crashes, health bar issues, spell edge cases, unit control bugs, and campaign screen problems.",
  "Reduced lag from repeated debug overlays, campaign map updates, AI scans, and command spam.",
];

const bossSystems = [
  "Order bosses: Spearton, Archidon, Shadowrath, Magikill, and Meric.",
  "Chaos bosses: JuggerKnight, Wingidon, Skelator / Marrowkai, and Medusa.",
  "Boss ability queue limits simultaneous special abilities in multi-boss levels for readability and performance.",
  "Difficulty modes affect more than basic strength, changing boss pressure, reinforcements, and wave timing.",
];

const optimizationNotes = [
  "Removed large per-frame debug stat overlay updates.",
  "Reduced repeated AI target scans through caching.",
  "Reduced repeated campaign map UI updates.",
  "Reduced tutorial and enemy command spam that created unnecessary repeated logic.",
  "Kept debug keybind checks lightweight by running deeper checks only while Shift is held.",
];

const playSteps = [
  "Download both the Flash Player and the mod SWF.",
  "Open the flash player, you should see an empty blank when opened.",
  `Click and drag the downloaded SWF file 'Stick_War_2_Upgrades.swf' into it.`,
  "Start a game and enjoy :)",
];

const qaNotes = [
  "Tested boss phases, ability cooldowns, wave behavior, and campaign progression across multiple difficulty levels.",
  "Validated edge cases involving poison, flying units, controlled units, spell targeting, and disguise behavior.",
  "Used debug tools for faster reproduction, screenshots, spawn testing, and balancing checks.",
  "Tracked gameplay feel as part of quality work: smoother pacing, clearer boss pressure, and fewer sudden unfair failures.",
];

const unitToggles = [
  {
    unit: "Magikill Autocast",
    media: "/projects/stick-war-2/magikill.gif",
    alt: "Magikill autocast toggle demonstration",
    modes: "Auto Cast, Meteor Only, Disabled Autocast",
    defaultMode: "Disabled Autocast",
    details: [
      "Attack Autocast pushes forward when no enemies are in spell range and is used with AttackMove.",
      "Defend Autocast casts on enemies in range without pushing forward, supporting Hold and defend-base behavior.",
      "Spell selection uses weighted randomness to keep casting dynamic: Meteor 5, Lightning 3, Poison 2.",
    ],
  },
  {
    unit: "Archidon Auto Kite",
    media: "/projects/stick-war-2/archidon.gif",
    alt: "Archidon auto kite toggle demonstration",
    modes: "Auto Kite, Manual Positioning",
    defaultMode: "Manual Positioning",
    details: [
      "Adds a player-side toggle so Archidons can either kite automatically or stay under direct manual positioning.",
      "Keeps ranged-unit control flexible without forcing automation on players who prefer precise placement.",
    ],
  },
  {
    unit: "Shadowrath Auto Cloak",
    media: "/projects/stick-war-2/shadowrath.gif",
    alt: "Shadowrath auto cloak toggle demonstration",
    modes: "Auto Cloak, Manual Cloak",
    defaultMode: "Manual Cloak",
    details: [
      "Adds a player-side toggle for automated cloak usage while preserving manual cloak control by default.",
      "Designed to reduce repeated micromanagement while keeping high-skill control available.",
    ],
  },
];

const modRepositoryUrl = "https://github.com/ChorlsChu/Stick-War-2--Enhanced-Edition-Mod-";
const flashPlayerDownloadUrl =
  "https://github.com/ChorlsChu/Stick-War-2--Enhanced-Edition-Mod-/releases/latest/download/flashplayer_32_sa.exe";
const modSwfDownloadUrl =
  "https://github.com/ChorlsChu/Stick-War-2--Enhanced-Edition-Mod-/releases/latest/download/Stick_War_2_Upgrades.swf";

export default function FlashOptimizationModPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(111,168,220,0.18),_transparent_34%),radial-gradient(circle_at_85%_15%,_rgba(236,179,101,0.16),_transparent_24%)]" />
        <div className="ambient-blob pointer-events-none absolute -left-24 top-12 h-80 w-80 rounded-full bg-[rgba(110,160,200,0.12)] blur-3xl" />
        <div className="ambient-blob pointer-events-none absolute -right-20 top-56 h-72 w-72 rounded-full bg-[rgba(201,166,107,0.1)] blur-3xl" style={{ animationDelay: "-8s" }} />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> for cross-document view transition */}
          <a className="nav-link inline-flex text-sm text-[var(--soft)]" href="/#projects">
            Back to projects
          </a>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <Reveal>
              <div>
                <p className="section-kicker">Current game optimization project</p>
                <h1 className="section-title animated-gradient mt-5">Stick War 2: Enhanced Edition Mod</h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--soft)] sm:text-xl">
                  A campaign-focused Flash/AS3 overhaul that expands boss fights, improves enemy behavior, rebalances campaign progression, adds replayable levels, and fixes bugs and performance issues from the original game.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["Flash", "ActionScript 3", "Game Modding", "Performance Optimization", "QA Testing"].map((tool) => (
                    <span className="tag" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <aside className="glass-panel p-6 sm:p-8">
                <p className="section-kicker">Project status</p>
                <div className="mt-6 grid gap-4">
                  <div className="stat-card">
                    <p className="stat-label">Timeline</p>
                    <p className="stat-value">Mar 2026 - Present</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Role</p>
                    <p className="stat-value">Modding, scripting, balancing, testing</p>
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-3 lg:px-12">
        <Reveal delay={250} className="lg:col-span-2">
          <article className="project-card">
            <p className="section-kicker">What I modded</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <p className="rounded-2xl border border-[var(--line)] bg-white/5 p-4 text-sm leading-6 text-[var(--soft)]" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={350}>
          <article className="project-card">
            <p className="section-kicker">Note</p>
            <p className="mt-6 leading-7 text-[var(--soft)]">
              The mod is intended to be tested locally through the standalone Flash projector for the smoothest performance. This page focuses on the technical breakdown, optimization work, and development notes.
            </p>
          </article>
        </Reveal>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-12">
        <Reveal delay={500}>
          <article className="project-card">
            <p className="section-kicker">Boss and campaign systems</p>
            <div className="mt-6 space-y-3">
              {bossSystems.map((item) => (
                <p className="text-[var(--soft)]" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={600}>
          <article className="project-card">
            <p className="section-kicker">Performance cleanup</p>
            <div className="mt-6 space-y-3">
              {optimizationNotes.map((item) => (
                <p className="text-[var(--soft)]" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </article>
        </Reveal>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[0.88fr_1.12fr] lg:px-12">
        <Reveal delay={800}>
          <article className="project-card">
            <p className="section-kicker">How to try it</p>
            <p className="mt-6 leading-7 text-[var(--soft)]">
              The mod is meant to run locally instead of inside a browser emulator, so players get the smoother Flash projector experience.
            </p>
            <div className="mt-6 grid gap-3">
              <a className="download-link" href={flashPlayerDownloadUrl}>
                Download Flash Player
              </a>
              <a className="download-link" href={modSwfDownloadUrl}>
                Download mod SWF
              </a>
              <a className="case-study-link" href={modRepositoryUrl} target="_blank" rel="noreferrer">
                Open setup on GitHub
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal delay={900}>
          <article className="project-card">
            <div className="grid gap-4 sm:grid-cols-2">
              {playSteps.map((step, index) => (
                <div className="instruction-step" key={step}>
                  <span className="instruction-step-number">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-6 text-[var(--soft)]">{step}</p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="section-heading">
          <p className="section-kicker">Player unit toggles</p>
          <p className="mt-5 max-w-3xl text-[var(--soft)]">
            Added optional player-side automation controls for spellcasting, kiting, and cloak behavior so units can feel smoother without removing manual control.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {unitToggles.map((toggle, index) => (
            <Reveal delay={1100 + index * 90} key={toggle.unit}>
              <article className="toggle-card">
                <Image
                  className="toggle-media"
                  src={toggle.media}
                  alt={toggle.alt}
                  width={960}
                  height={540}
                  unoptimized
                />
                <div className="p-5">
                  <p className="section-kicker">{toggle.unit}</p>
                  <dl className="mt-5 grid gap-3 text-sm">
                    <div>
                      <dt className="stat-label">Modes</dt>
                      <dd className="mt-1 text-[var(--soft)]">{toggle.modes}</dd>
                    </div>
                    <div>
                      <dt className="stat-label">Starts as</dt>
                      <dd className="mt-1 text-[var(--soft)]">{toggle.defaultMode}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 space-y-3">
                    {toggle.details.map((detail) => (
                      <p className="text-sm leading-6 text-[var(--soft)]" key={detail}>
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-12">
        <Reveal delay={1400}>
          <article className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">QA value</p>
            <div className="mt-6 space-y-3">
              {qaNotes.map((item) => (
                <p className="text-[var(--soft)]" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={1500}>
          <article className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">Disclaimer</p>
            <p className="mt-6 leading-7 text-[var(--soft)]">
              This is an unofficial fan-made mod project and is not an official Stick War release. The original Stick War 2 belongs to its respective creators. This portfolio page focuses on modding, scripting, balancing, bug fixing, testing, and optimization work.
            </p>
          </article>
        </Reveal>
      </section>
    </main>
  );
}
