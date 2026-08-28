import Image from "next/image";
import Reveal from "../../components/reveal";
import CaseStudyWallpaper from "../../components/case-study-wallpaper";

const highlights = [
  "Expanded the campaign with new boss encounters for Order and Chaos factions.",
  "Added new boss abilities, phases, passives, cosmetics, summons, and level events.",
  "Improved enemy campaign behavior with stronger army advantage checks and less awkward cautious attacks.",
  "Added replayable completed levels and campaign-map access to the upgrade screen.",
  "Added ambush survival levels with timed waves, fog of war, and barrier mechanics.",
  "Reworked Medusa final boss with stronger phases, summons, and pressure.",
  "Campaign reinforcements now have temporary statue protection to prevent instant wave deletion.",
  "Intro video now plays directly on the intro screen instead of showing only a link.",
  "Fixed crashes, health bar issues, spell edge cases, unit control bugs, and campaign screen problems.",
  "Reduced lag from repeated campaign map updates, AI scans, and command spam.",
  "Added soundtracks from Stick War 1 across campaign levels.",
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
const originalGameStoryUrl = "https://www.youtube.com/watch?v=w6q9EoFmu0w";
const remasteredModSwfUrl =
  "https://github.com/ChorlsChu/Stick-War-2-Remastered-Mod/releases/download/v1.5/Stick_War_2_Remastered.swf";

const bossAbilities = [
  {
    boss: "Spearton Boss",
    faction: "Order",
    abilities: [
      { name: "Shield and Bash", detail: "Uses Shield Wall and Shield Bash that stuns enemies on hit. Can command nearby Speartons to Shield and Bash with him. Shield Wall deflects 15% of arrows while blocking." },
    ],
  },
  {
    boss: "Archidon Boss",
    faction: "Order",
    abilities: [
      { name: "Arrow Storm", detail: "Fires a blue glowing arrow that slows enemies hit. Can command nearby Archidons to fire Arrow Storm with him." },
      { name: "Fire Arrows", detail: "Shoots one fire arrow that deals more damage. Can command nearby Archidons to shoot fire arrows with him." },
      { name: "Triple Shot", detail: "Fires three arrows in a spread direction." },
      { name: "Explosive Arrow", detail: "Fires an explosive arrow that detonates on impact, damaging enemies in the area." },
    ],
  },
  {
    boss: "Shadowrath Boss",
    faction: "Order",
    abilities: [
      { name: "Cloak 3", detail: "Cloak lasting 12 seconds. Each successful hit immediately cloaks again at Cloak 2 damage for 1.5 seconds. Flanks and targets supporting units. Retreats behind the front line when cloak fails." },
      { name: "Clone", detail: "Spawns 2 clones to overwhelm the target. Clones target the boss's current target, have 2 seconds of spawn protection, and vanish when hit once after protection ends." },
    ],
  },
  {
    boss: "Magikill Boss",
    faction: "Order",
    abilities: [
      { name: "Meteor Chain", detail: "Summoning a meteor chains along with 2 more meteors at 70% damage each." },
      { name: "Lightning Wall Stun", detail: "Lightning wall does low damage but stuns enemies for a while." },
      { name: "Summoning", detail: "Can summon Speartons (max 3), Swordwraths (max 2), and Archidons (max 2)." },
    ],
  },
  {
    boss: "Wingidon Boss",
    faction: "Chaos",
    abilities: [
      { name: "Eclipse Mark", detail: "Fires a special marking arrow. Marked units take bonus damage from the next Wingidon/Eclipsor projectile. Nearby Wingidons can focus the marked target." },
      { name: "Demon Burst Fire", detail: "Fires a short burst of arrows. Hit units are stunned briefly." },
      { name: "Sky Commander Aura", detail: "Temporarily empowers nearby Wingidons and deflects all incoming arrows while active. Boss glows during the aura." },
    ],
  },
  {
    boss: "Skelator / Marrowkai Boss",
    faction: "Chaos",
    abilities: [
      { name: "Dead Rising", detail: "Available below 50% health. Summons Deads beside the boss (max 2)." },
      { name: "Poison Fists", detail: "Skeletal fists poison units they hit with visual poison fist effects on impact." },
      { name: "Reaper Control", detail: "Temporarily controls a struck enemy unit to attack its own allies. Controlled units cannot be selected. Controlled Magikill can cast spells against allies." },
    ],
  },
  {
    boss: "Medusa Final Boss",
    faction: "Chaos",
    abilities: [
      { name: "Look at Me", detail: "All units facing her turn into stone. Can be avoided by looking away. Reaction time varies by difficulty." },
    ],
  },
];

const ambushLevels = [
  {
    name: "Native Tribes",
    description: "Scattered native tribes attack from the hills with Speartons and Swordwraths wielding tribal weapons. Reduced health but large numbers across 5 waves. Reinforcements arrive after 150 seconds.",
  },
  {
    name: "Shadowrath Stalkers",
    description: "Assassins emerge from the dark under a night overlay. Shadowraths stalk your position and unlock cloak after 90 seconds, becoming invisible. 5 waves of increasing pressure.",
  },
  {
    name: "Rebels Last Stand",
    description: "The rebels gather everything for one final push. An opening cutscene reveals their full army before a single massive wave attacks. An ending cutscene shows rebels intercepted by chaos forces.",
  },
  {
    name: "Undead Horde",
    description: "The undead pour across the battlefield in a poisoned swarm. An opening cutscene shows a Marrowkai raising the dead. 4 waves of Undead variants followed by a 400 HP Marrowkai boss. Only garrison cures infection.",
  },
  {
    name: "The Storm",
    description: "Rain and lightning obscure the battlefield. Enemy units are only visible during thunder flashes. 6 waves with breathing periods, featuring Cats, Knights, Dead, Undead, Skelators, Wingidons, and Giants.",
  },
];

const ambushMechanics = [
  "Fog of war locks forward vision to a barrier line.",
  "Player units cannot cross the barrier.",
  "Reinforcements spawn after surviving approximately 150 seconds.",
  "Win by surviving all waves and eliminating enemy combat units.",
  "Wave sizes scale with difficulty (Normal, Hard, Insane).",
];

const campaignChanges = [
  "Bosses appear in their own campaign levels with unique encounters.",
  "Chaos bosses appear through reinforcements in Medusa's Gates.",
  "Rebels United is built as a major multi-boss rebel encounter.",
  "Several boss levels reward extra campaign points.",
  "Ambush levels added as survival-based encounters.",
  "Medusa's Gates now includes heavier Chaos Empire pressure.",
  "The final Medusa battle has improved pacing, music transitions, summons, and boss mechanics.",
  "After finishing the campaign, completed levels can be replayed from the campaign map.",
  "The upgrade screen can now be opened from the campaign map.",
  "The campaign intro uses the embedded intro video on the intro screen.",
];

const bossModeRules = [
  "Toggle Boss Mode on and off during gameplay using the comma key or the toggle button.",
  "Only boss units can be produced while active.",
  "Maximum of 3 bosses alive at once.",
  "Only 1 boss of each type at a time.",
  "Bosses have different gold and mana costs than regular units.",
];

const bossUpgradeTree = [
  { unlock: "Spearos", note: "Spearton boss line" },
  { unlock: "Archis", note: "Archidon boss line" },
  { unlock: "Shade", note: "Shadowrath boss line" },
  { unlock: "Vitalis", note: "Meric boss line" },
  { unlock: "Magis", note: "Magikill boss line" },
];

const undeadVariants = [
  { variant: "Undead Spearton", detail: "More HP but slightly slower." },
  { variant: "Undead Shadowrath", detail: "Slightly faster." },
  { variant: "Undead Magikill", detail: "Each hit has a chance of adding Infection Spray that infects units in an area." },
  { variant: "Undead Archer", note: "Used for visual design variety." },
];

const undeadMechanics = [
  "Same as Deads but melee unit type with Archidon-level HP.",
  "Each melee hit has a chance to inflict Infection, cured only by garrison.",
  "Units killed by Infection or Undead melee attacks turn into an Undead variant matching their unit type.",
];

export default function FlashOptimizationModPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-12">
        <CaseStudyWallpaper basePath="/projects/stick-war-2" />
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
                  A campaign-focused Flash/AS3 overhaul that expands boss fights, adds new level events, improves enemy behavior, rebalances campaign progression, adds replayable levels, and fixes bugs and performance issues from the original game.
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

      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <Reveal delay={180}>
          <article className="glass-panel overflow-hidden">
            <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="section-kicker">Game context</p>
                  <h2 className="mt-4 font-display text-3xl">Story behind Stick War 2</h2>
                  <p className="mt-5 leading-7 text-[var(--soft)]">
                    New to Stick War 2? This original-game story footage introduces the world and campaign that the Enhanced Edition Mod builds upon.
                  </p>
                </div>
                <p className="mt-8 text-sm leading-6 text-[var(--muted)]">
                  This footage is from the original game and is included only for context; it is not part of my mod work.
                </p>
              </div>
              <div className="border-t border-[var(--line)] bg-black/30 lg:border-l lg:border-t-0">
                <iframe
                  className="block aspect-video w-full"
                  src="https://www.youtube-nocookie.com/embed/w6q9EoFmu0w"
                  title="Original Stick War 2 story video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <p className="border-t border-[var(--line)] px-5 py-4 text-sm text-[var(--soft)]">
                  Source: {" "}
                  <a className="nav-link text-[var(--muted)]" href={originalGameStoryUrl} target="_blank" rel="noreferrer">
                    Original Stick War 2 story video on YouTube
                  </a>
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-3 lg:px-12">
        <Reveal delay={250} className="lg:col-span-2">
          <article className="project-card">
            <p className="section-kicker">What I modded</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <p className="mt-4 leading-7 text-[var(--soft)]">
              Looking for a lighter option? The <strong>Remastered Mod</strong> keeps all the performance fixes without changing the campaign.{" "}
              <a className="nav-link text-[var(--muted)]" href="#remastered-mod">
                Jump to Remastered Mod details
              </a>
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

      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="section-heading">
          <p className="section-kicker">Boss abilities breakdown</p>
          <p className="mt-5 max-w-3xl text-[var(--soft)]">
            Each boss has a unique kit designed around pressure, summons, and phase behavior. Here is a closer look at what each boss brings.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {bossAbilities.map((boss, index) => (
            <Reveal delay={700 + index * 80} key={boss.boss}>
              <article className="project-card">
                <div className="flex items-center gap-3">
                  <p className="font-display text-xl">{boss.boss}</p>
                  <span className="rounded-full border border-[var(--line)] bg-white/5 px-2 py-0.5 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    {boss.faction}
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {boss.abilities.map((ability) => (
                    <div key={ability.name}>
                      <p className="text-sm font-medium text-[var(--text)]">{ability.name}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--soft)]">{ability.detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
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

      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12" id="remastered-mod">
        <Reveal delay={950}>
          <article className="glass-panel overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-6 sm:p-8">
                <p className="section-kicker">Alternative version</p>
                <h2 className="mt-4 font-display text-3xl">Stick War 2: Remastered Mod</h2>
                <p className="mt-5 leading-7 text-[var(--soft)]">
                  Prefer the original campaign untouched? The Remastered Mod bundles all the performance optimizations from Enhanced Edition but skips the campaign changes entirely. Same smooth runtime, vanilla story.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a className="download-link" href={remasteredModSwfUrl}>
                    Download Remastered SWF
                  </a>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  Uses the same Flash Player setup as the Enhanced Edition.
                </p>
              </div>
              <div className="flex flex-col justify-center border-t border-[var(--line)] bg-white/[0.03] p-6 sm:p-8 lg:border-l lg:border-t-0">
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">What&apos;s included</p>
                <ul className="mt-5 space-y-3 text-sm text-[var(--soft)]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>Same performance fixes and lag reductions</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>Original campaign and story unchanged</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>No new bosses, abilities, or content</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>Same Flash Player setup</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="section-heading">
          <p className="section-kicker">Campaign changes</p>
          <p className="mt-5 max-w-3xl text-[var(--soft)]">
            The campaign layer was reworked to feel more dramatic and reactive. Boss encounters, ambush survival levels, and quality-of-life improvements reshape the campaign flow.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal delay={1050}>
            <article className="project-card">
              <p className="section-kicker">Key changes</p>
              <div className="mt-6 space-y-3">
                {campaignChanges.map((item) => (
                  <p className="text-[var(--soft)]" key={item}>
                    {item}
                  </p>
                ))}
              </div>
            </article>
          </Reveal>

          <Reveal delay={1150}>
            <article className="project-card">
              <p className="section-kicker">Difficulty scaling</p>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Normal</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">Recommended for a first playthrough. Boss fights are stronger than the original but more forgiving.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Hard</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">Enemy waves and boss pressure are stronger. Reinforcement timing and army pressure are less forgiving.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Insane</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">Intended for players who already know the campaign. Bosses, reinforcements, and enemy pressure are at their most punishing.</p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="section-heading">
          <p className="section-kicker">Ambush levels</p>
          <p className="mt-5 max-w-3xl text-[var(--soft)]">
            Ambush levels are survival-based encounters where you defend against timed enemy waves until reinforcements arrive. Fog of war hides the enemy base and a barrier prevents pushing forward.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {ambushLevels.map((level, index) => (
            <Reveal delay={1200 + index * 80} key={level.name}>
              <article className="project-card">
                <p className="section-kicker">{level.name}</p>
                <p className="mt-5 text-sm leading-6 text-[var(--soft)]">
                  {level.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={1600}>
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Common mechanics</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ambushMechanics.map((mechanic) => (
                <div className="flex gap-3" key={mechanic}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span className="text-sm text-[var(--soft)]">{mechanic}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-12">
        <Reveal delay={1700}>
          <article className="project-card">
            <p className="section-kicker">Playable bosses</p>
            <p className="mt-5 leading-7 text-[var(--soft)]">
              Unlock boss units through the upgrade tree and toggle Boss Mode to produce them instead of regular units. Each boss has unique abilities, costs, and production limits.
            </p>
            <div className="mt-6 space-y-3">
              {bossModeRules.map((rule) => (
                <div className="flex gap-3" key={rule}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span className="text-sm text-[var(--soft)]">{rule}</span>
                </div>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={1800}>
          <article className="project-card">
            <p className="section-kicker">Boss upgrade tree</p>
            <p className="mt-5 text-sm leading-6 text-[var(--soft)]">
              Boss unlocks follow a branching upgrade path. Ability upgrades (Triple Shot, Arrow Storm, Meteor II, Summon II, etc.) branch off from each boss unlock.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {bossUpgradeTree.map((boss) => (
                <div className="rounded-2xl border border-[var(--line)] bg-white/5 p-4" key={boss.unlock}>
                  <p className="text-sm font-medium text-[var(--text)]">{boss.unlock}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{boss.note}</p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <Reveal delay={1900}>
          <article className="glass-panel overflow-hidden">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 sm:p-8">
                <p className="section-kicker">New unit</p>
                <h2 className="mt-4 font-display text-3xl">Undead</h2>
                <p className="mt-5 leading-7 text-[var(--soft)]">
                  A new melee unit type added to the mod. Undead have Archidon-level HP and each melee hit has a chance to inflict Infection, which can only be cured by garrison. Units killed by Infection or Undead melee attacks turn into an Undead variant matching their original unit type.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {undeadVariants.map((variant) => (
                    <div className="rounded-2xl border border-[var(--line)] bg-white/5 p-4" key={variant.variant}>
                      <p className="text-sm font-medium text-[var(--text)]">{variant.variant}</p>
                      <p className="mt-1 text-xs text-[var(--soft)]">{variant.detail || variant.note}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center border-t border-[var(--line)] bg-white/[0.03] p-6 sm:p-8 lg:border-l lg:border-t-0">
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Core mechanics</p>
                <div className="mt-5 space-y-3">
                  {undeadMechanics.map((mechanic) => (
                    <div className="flex gap-3" key={mechanic}>
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                      <span className="text-sm text-[var(--soft)]">{mechanic}</span>
                    </div>
                  ))}
                </div>
              </div>
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
