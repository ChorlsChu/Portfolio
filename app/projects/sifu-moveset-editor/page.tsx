import Link from "next/link";
import Reveal from "../../components/reveal";
import CaseStudyWallpaper from "../../components/case-study-wallpaper";

type Feature = {
  title: string;
  description: string;
};

type TechnicalSystem = {
  title: string;
  technology: string;
  description: string;
};

const modRepositoryUrl = "https://github.com/ChorlsChu/Custom-Moveset-Maker--Sifu-Mod-";
const modDownloadUrl =
  "https://github.com/ChorlsChu/Custom-Moveset-Maker--Sifu-Mod-/releases/latest/download/SifuMovesetEditor.zip";
const releasesUrl = "https://github.com/ChorlsChu/Custom-Moveset-Maker--Sifu-Mod-/releases";

const project = {
  name: "Sifu Custom Moveset Maker",
  type: "Modding Tool / Moveset Editor",
  period: "Aug 2026 - Present",
  role: "Modder / Developer",
  highlight:
    "A released WPF .NET 10 modding tool with an interactive combo tree editor, Three.js 3D animation viewer, and one-click pak export.",
  description:
    "A C# WPF modding tool for Sifu that lets you edit combo trees for the player, enemies, and bosses. It combines animation swapping, unit property and attack tuning, stance generation, auto-extraction of game assets, and UE4 pak export into a single desktop workflow.",
  stack: [
    "C#",
    ".NET 10",
    "WPF",
    "Three.js",
    "CUE4Parse",
    "UAssetAPI",
    "Newtonsoft.Json",
    "UnrealPak",
  ],
};

const features: Feature[] = [
  {
    title: "Combo tree visualizer",
    description:
      "Displays each unit's full attack tree as an interactive node graph. Click a node to preview its animation in the 3D viewer, drag animations onto nodes to swap moves, and double-click to reset to vanilla.",
  },
  {
    title: "Animation library",
    description:
      "Browse every loaded attack animation with search and filters for character, weapon type, and category, then drag animations straight onto combo nodes to replace moves.",
  },
  {
    title: "Edit any unit",
    description:
      "Switch between the player, enemies, and bosses with Change Unit, including phases and weapon variants. Edits across multiple units are kept in the project and export together in a single pak.",
  },
  {
    title: "Unit properties",
    description:
      "For enemies and bosses, tune Health and Structure, experimental AI defense fields, and an Immune to Focus Attacks flag without touching raw game files.",
  },
  {
    title: "Attack DB tuning",
    description:
      "Adjust each move's buildup frames and gameplay range from the right sidebar, with vanilla values shown as a hint whenever your edit differs from the original.",
  },
  {
    title: "Stance switching",
    description:
      "Swap the player's stance through a dropdown of 12 supported stances, each one replacing BaseMovementDB and BP_TransitionAnimRequest together.",
  },
  {
    title: "Auto-extract on first run",
    description:
      "On first launch the app locates Sifu's original pak file and selectively extracts only the assets needed for modding instead of the full 30GB game.",
  },
  {
    title: "Export and import mods",
    description:
      "Package modified combo trees, animations, unit properties, and stances into a UE4 pak for Sifu's mods folder, or load existing mod paks to inspect and edit them.",
  },
];

const technicalSystems: TechnicalSystem[] = [
  {
    title: "Desktop application",
    technology: "C# / .NET 10 / WPF",
    description:
      "The main application is built as a Windows desktop tool using WPF, providing the interface for browsing assets, editing movesets, and managing the modding workflow.",
  },
  {
    title: "3D visualization",
    technology: "Three.js / WebView2",
    description:
      "The animation viewer runs Three.js inside a local WebView2 control with a bundled three.min.js, so skeleton previews and animation playback work fully offline.",
  },
  {
    title: "Extraction and packaging",
    technology: "UnrealPak",
    description:
      "UnrealPak drives both ends of the pipeline: selective asset extraction on first run and pak building on export, including the matching signature file.",
  },
  {
    title: "Unreal Engine assets",
    technology: "CUE4Parse / UAssetAPI",
    description:
      "Unreal Engine asset libraries are parsed to extract and work with the data required by the combo tree, animation, and attack systems.",
  },
  {
    title: "Data layer",
    technology: "Newtonsoft.Json",
    description:
      "Structured JSON backs the settings file and the .sifu-edit project format, which stores animation swaps, unit properties, and multi-unit caches.",
  },
];

const unitEditingNotes: Feature[] = [
  {
    title: "Cached combo graphs",
    description:
      "Every unit you open is cached in the project, so jumping back to an earlier moveset never means reloading the game data.",
  },
  {
    title: "Variant-aware edits",
    description:
      "Properties and stance changes follow the selected unit while you switch between its weapon variants, phases, and tiers.",
  },
  {
    title: "Single-pak export",
    description:
      "Every modified unit appears in the export review list and ships together inside one pak instead of one file per character.",
  },
  {
    title: "Save and resume",
    description:
      "The .sifu-edit project file stores animation swaps, unit properties, and multi-unit caches so a session can be saved and picked up later.",
  },
];

const workflow = [
  "Launch the app. On first run it locates Sifu's original pak file and extracts only the assets it needs.",
  "Pick a unit with Change Unit: the player, an enemy, or a boss, including phases and weapon variants.",
  "Inspect the combo tree. Nodes are color-coded, blue for vanilla and green for replaced.",
  "Edit moves. Drag animations from the library onto nodes and preview them in the 3D viewer.",
  "Tune the details: Attack DB values, unit properties, and stances for the selected unit.",
  "Export the pak, review every change, then copy the generated pak and signature into the mods folder.",
  "Test in Sifu and iterate, or import an existing mod to keep editing it.",
];

const installSteps = [
  "Download and unzip SifuMovesetEditor.zip anywhere on your PC.",
  "Install the .NET 10 Desktop Runtime if Windows does not already have it.",
  "Launch the app and point it at Sifu's original pak file so it can extract the assets it needs.",
  "Edit your moveset, unit properties, and stance, then click Export Pak.",
  "Copy the generated pak and signature files into Sifu/Content/Paks/~mods/ and start the game.",
];

const requirements = [
  { label: "Platform", value: "Windows 10 / 11" },
  { label: "Framework", value: ".NET 10 Desktop Runtime" },
  { label: "Viewer", value: "WebView2 (bundled with Edge)" },
  { label: "Game", value: "Own Sifu (Epic or Steam)" },
  { label: "Network", value: "Offline after first run" },
  { label: "Storage", value: "~1-2GB extracted" },
];

const qaNotes = [
  "Validated combo tree parsing and node graph rendering against vanilla game assets.",
  "Tested drag-and-drop animation swaps across player, enemy, and boss movesets.",
  "Verified exported paks load in-game with the expected moves, stances, and unit property changes.",
  "Tested the import, diff, and re-export round-trip on existing mod paks.",
  "Checked first-run auto-extraction on a clean install to confirm only the needed assets are pulled.",
  "Used repeated game-side testing to catch parsing and generated-data issues.",
];

const technicalChallenges = [
  {
    title: "Game data is not designed for editing",
    description:
      "The tool has to interpret existing game assets and transform low-level Unreal Engine data into something that can be edited through a higher-level combo tree workflow.",
  },
  {
    title: "Animation data needs visual validation",
    description:
      "Parsing animation information is not enough on its own. The 3D viewer provides a visual way to confirm that the parsed hierarchy and animation data behave correctly.",
  },
  {
    title: "Mod generation must remain consistent",
    description:
      "The export pipeline only packages modified assets, patches attack maps and stance databases, and rebuilds the pak, so generated data has to match what the game expects every single time.",
  },
  {
    title: "Enemy movesets resist structural changes",
    description:
      "Custom chain attacks work on the player, but building the same structures on enemy movesets crashes the game, so enemy editing focuses on safe animation swaps while deeper moveset work stays experimental.",
  },
];

export default function SifuMovesetEditorPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-12">
        <CaseStudyWallpaper basePath="/projects/sifu-moveset-editor" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(111,168,220,0.18),_transparent_34%),radial-gradient(circle_at_85%_15%,_rgba(236,179,101,0.16),_transparent_24%)]" />

        <div className="ambient-blob pointer-events-none absolute -left-24 top-12 h-80 w-80 rounded-full bg-[rgba(110,160,200,0.12)] blur-3xl" />

        <div
          className="ambient-blob pointer-events-none absolute -right-20 top-56 h-72 w-72 rounded-full bg-[rgba(201,166,107,0.1)] blur-3xl"
          style={{ animationDelay: "-8s" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <Link
            className="nav-link inline-flex text-sm text-[var(--soft)]"
            href="/#projects"
          >
            Back to projects
          </Link>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <Reveal>
              <div>
                <p className="section-kicker">Released modding tool</p>

                <h1 className="section-title animated-gradient mt-5">
                  {project.name}
                </h1>

                <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--soft)] sm:text-xl">
                  {project.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.stack.map((tool) => (
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
                    <p className="stat-value">{project.period}</p>
                  </div>

                  <div className="stat-card">
                    <p className="stat-label">Role</p>
                    <p className="stat-value">{project.role}</p>
                  </div>

                  <div className="stat-card">
                    <p className="stat-label">Type</p>
                    <p className="stat-value">{project.type}</p>
                  </div>

                  <div className="stat-card">
                    <p className="stat-label">Links</p>
                    <div className="mt-2 flex flex-col gap-2">
                      <a
                        className="nav-link text-sm"
                        href={modRepositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on GitHub
                      </a>
                      <a className="nav-link text-sm" href={modDownloadUrl}>
                        Download latest release
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROJECT INTRO */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <Reveal delay={180}>
          <article className="glass-panel overflow-hidden">
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="section-kicker">What this project is</p>

                  <h2 className="mt-4 font-display text-3xl">
                    A dedicated workspace for Sifu modding
                  </h2>

                  <p className="mt-5 leading-7 text-[var(--soft)]">
                    Instead of manually working through game assets and
                    animation data, the Moveset Maker brings the process into
                    one application. The goal is to make experimentation with
                    Sifu character movesets more visual, repeatable, and
                    accessible.
                  </p>
                </div>

                <div className="mt-8">
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                    Core focus
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="tag">Animation</span>
                    <span className="tag">Combo Trees</span>
                    <span className="tag">Movesets</span>
                    <span className="tag">Stances</span>
                    <span className="tag">Unit Tuning</span>
                    <span className="tag">Unreal Assets</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--line)] bg-white/[0.03] p-6 sm:p-8 lg:border-l lg:border-t-0">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="stat-label">Problem</p>
                    <p className="mt-3 leading-7 text-[var(--soft)]">
                      Sifu&apos;s animation and character data lives inside
                      Unreal Engine assets that are not designed around a
                      convenient modding workflow.
                    </p>
                  </div>

                  <div>
                    <p className="stat-label">Approach</p>
                    <p className="mt-3 leading-7 text-[var(--soft)]">
                      Build a desktop editor that can parse the underlying
                      data, visualize it, and provide higher-level tools for
                      creating and modifying movesets.
                    </p>
                  </div>

                  <div>
                    <p className="stat-label">Result</p>
                    <p className="mt-3 leading-7 text-[var(--soft)]">
                      A released Windows application that parses game assets,
                      visualizes combo trees, and exports working pak mods
                      straight into Sifu.
                    </p>
                  </div>

                  <div>
                    <p className="stat-label">Development focus</p>
                    <p className="mt-3 leading-7 text-[var(--soft)]">
                      Tooling, reverse-engineering-oriented data handling,
                      visualization, iteration, and game-side testing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      {/* FEATURES */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="section-heading">
          <p className="section-kicker">What the tool does</p>

          <h2 className="mt-4 font-display text-3xl">
            From raw game assets to editable movesets
          </h2>

          <p className="mt-5 max-w-3xl text-[var(--soft)]">
            The application combines several systems into one modding
            workflow. Each feature exists to reduce manual asset work or make
            the resulting data easier to understand.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal delay={250 + index * 70} key={feature.title}>
              <article className="project-card h-full">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-medium text-[var(--muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                </div>

                <h3 className="mt-8 font-display text-2xl">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[var(--soft)]">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TECHNICAL SYSTEMS */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-12">
        <Reveal delay={800}>
          <article className="glass-panel h-full p-6 sm:p-8">
            <p className="section-kicker">Technical architecture</p>

            <h2 className="mt-4 font-display text-3xl">
              Multiple systems working together
            </h2>

            <p className="mt-5 leading-7 text-[var(--soft)]">
              The tool sits between a desktop editing interface and the
              game&apos;s underlying Unreal Engine data. Each technology
              handles a different part of that pipeline.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                Workflow
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--soft)]">
                Game assets → auto-extract → combo tree graph → animation and
                stat edits → patched data → pak export → in-game testing
              </p>
            </div>
          </article>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {technicalSystems.map((system, index) => (
            <Reveal delay={860 + index * 80} key={system.title}>
              <article className="project-card h-full">
                <p className="section-kicker">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-5 font-display text-2xl">
                  {system.title}
                </h3>

                <p className="mt-3 text-sm font-medium text-[var(--text)]">
                  {system.technology}
                </p>

                <p className="mt-4 text-sm leading-7 text-[var(--soft)]">
                  {system.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MULTI-UNIT EDITING */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-12">
        <Reveal delay={1250}>
          <article className="glass-panel h-full p-6 sm:p-8">
            <p className="section-kicker">Multi-unit editing</p>

            <h2 className="mt-4 font-display text-3xl">
              One project, every fighter
            </h2>

            <p className="mt-5 leading-7 text-[var(--soft)]">
              Use Change Unit to move between the player, enemies, and bosses
              without leaving the editor. Player weapon variants and enemy or
              boss phases all load into the same session, so a single project
              can hold an entire roster of edits.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                Roster
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--soft)]">
                Player weapon variants: Barehands, Bat, Staff, Blade. Enemies
                and bosses: Grunt, FireDisciple, FlashKick, BigGuy, BodyGuard,
                Fajar, Fengjie, Kuroki, Sean, Yang, Servant, and Sifu.
              </p>
            </div>
          </article>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {unitEditingNotes.map((note, index) => (
            <Reveal delay={1330 + index * 80} key={note.title}>
              <article className="project-card h-full">
                <p className="section-kicker">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-5 font-display text-2xl">{note.title}</h3>

                <p className="mt-4 text-sm leading-7 text-[var(--soft)]">
                  {note.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* UNIT TUNING */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="section-heading">
          <p className="section-kicker">Unit tuning</p>

          <h2 className="mt-4 font-display text-3xl">
            Stats, defense, and per-move data
          </h2>

          <p className="mt-5 max-w-3xl text-[var(--soft)]">
            Beyond animation swaps, the tool exposes the values that shape how
            a fight feels. Enemy and boss stats, experimental AI defense
            behavior, and raw attack data are all editable from the same
            workspace.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal delay={1450}>
            <article className="project-card h-full">
              <p className="section-kicker">Unit properties</p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    ArchetypeDB
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">
                    Health and Structure values that control how much
                    punishment a unit takes before staggering or falling.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    ContextDefense (experimental)
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">
                    Memory Limit, Hits Count, and Flush Limit tune how
                    aggressively the AI parries, dodges, or avoids attacks.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    Immune to Focus Attacks
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">
                    A family-level flag that repoints the shared ArchetypeDB at
                    Yang&apos;s empty VitalPointDB so the unit has no Focus
                    target.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    Reset to Defaults
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">
                    Restores vanilla values for the current unit. The panel is
                    hidden while the player is active since these fields only
                    exist on enemies and bosses.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={1530}>
            <article className="project-card h-full">
              <p className="section-kicker">Attack DB</p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    Buildup frames
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">
                    How many frames the attack charges before it can land.
                    Lower values mean faster startup.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    Gameplay range
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">
                    Attack reach measured in Unreal units. Higher values hit
                    from farther away.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    Vanilla hints
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">
                    The hint line under the fields always shows the original
                    values, with a marker whenever your edit differs from
                    vanilla.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    Safe rollback
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--soft)]">
                    Right-click to reset a node back to vanilla, and imported
                    mods seed these fields automatically when their cards
                    differ from the original.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* WPF UI + DEMO */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <Reveal delay={1620}>
          <article className="glass-panel overflow-hidden">
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="section-kicker">Application interface</p>

                  <h2 className="mt-4 font-display text-3xl">
                    Built as a real desktop tool
                  </h2>

                  <p className="mt-5 leading-7 text-[var(--soft)]">
                    The WPF application provides the workspace where assets,
                    animations, skeletons, and moveset data come together.
                    Instead of treating the mod as a collection of manually
                    edited files, the application provides a structured
                    editing environment.
                  </p>
                </div>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-2xl border border-[var(--line)] bg-white/5 p-4">
                    <p className="stat-label">Interface</p>
                    <p className="mt-2 text-sm text-[var(--soft)]">
                      .NET 10 + WPF desktop application
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--line)] bg-white/5 p-4">
                    <p className="stat-label">Visualization</p>
                    <p className="mt-2 text-sm text-[var(--soft)]">
                      Three.js animation viewer running fully offline
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--line)] bg-black/20 p-5 sm:p-8 lg:border-l lg:border-t-0">
                <div className="rounded-2xl border border-[var(--line)] bg-black/30 p-3">
                  <video
                    className="block w-full rounded-xl"
                    controls
                    playsInline
                    muted
                    loop
                    preload="metadata"
                  >
                    <source
                      src="/projects/sifu-moveset-editor/sifu-demo.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="tag">Combo Tree Graph</span>
                  <span className="tag">3D Animation Preview</span>
                  <span className="tag">Drag and Drop Editing</span>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      {/* DEVELOPMENT CHALLENGES */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="section-heading">
          <p className="section-kicker">Development challenges</p>

          <h2 className="mt-4 font-display text-3xl">
            Turning low-level game data into usable tooling
          </h2>

          <p className="mt-5 max-w-3xl text-[var(--soft)]">
            The interesting part of this project is not just the interface. The
            tool has to bridge the gap between Unreal Engine asset structures,
            animation data, and something a modder can actually work with.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {technicalChallenges.map((challenge, index) => (
            <Reveal delay={1720 + index * 80} key={challenge.title}>
              <article className="project-card h-full">
                <p className="section-kicker">
                  Challenge {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-5 font-display text-xl">
                  {challenge.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[var(--soft)]">
                  {challenge.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <Reveal delay={2060}>
          <article className="project-card h-full">
            <p className="section-kicker">Typical workflow</p>

            <h2 className="mt-4 font-display text-3xl">
              From asset extraction to in-game testing
            </h2>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {workflow.map((step, index) => (
                <div
                  className="instruction-step"
                  key={step}
                >
                  <span className="instruction-step-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-sm leading-6 text-[var(--soft)]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={2140}>
          <article className="glass-panel h-full p-6 sm:p-8">
            <p className="section-kicker">Why the workflow matters</p>

            <p className="mt-6 leading-7 text-[var(--soft)]">
              Modding animation-heavy games can involve a lot of repeated
              manual inspection. The Moveset Maker is designed around
              shortening that loop: inspect the data, visualize it, make a
              change, generate the required output, and test it again.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                <span className="text-sm text-[var(--soft)]">
                  Visual feedback instead of relying only on raw asset data.
                </span>
              </div>

              <div className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                <span className="text-sm text-[var(--soft)]">
                  Centralized editing instead of scattered manual changes.
                </span>
              </div>

              <div className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                <span className="text-sm text-[var(--soft)]">
                  Faster iteration between tool-side changes and game-side
                  testing.
                </span>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      {/* TRY IT */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[0.88fr_1.12fr] lg:px-12">
        <Reveal delay={2280}>
          <article className="glass-panel h-full p-6 sm:p-8">
            <p className="section-kicker">How to try it</p>

            <h2 className="mt-4 font-display text-3xl">
              Download the latest release
            </h2>

            <p className="mt-5 leading-7 text-[var(--soft)]">
              The Moveset Maker ships as a standalone Windows application.
              Grab the newest build below or open the repository for the full
              setup guide. It runs fully offline after the first extraction,
              and you need to own a legal copy of Sifu to use it.
            </p>

            <div className="mt-6 grid gap-3">
              <a className="download-link" href={modDownloadUrl}>
                Download latest release (.zip)
              </a>

              <a
                className="download-link"
                href={releasesUrl}
                target="_blank"
                rel="noreferrer"
              >
                View all releases
              </a>

              <a
                className="case-study-link"
                href={modRepositoryUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open setup on GitHub
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal delay={2360}>
          <article className="glass-panel h-full p-6 sm:p-8">
            <p className="section-kicker">Setup</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {installSteps.map((step, index) => (
                <div className="instruction-step" key={step}>
                  <span className="instruction-step-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-sm leading-6 text-[var(--soft)]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>
      </section>

      {/* REQUIREMENTS */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <Reveal delay={2460}>
          <article className="project-card">
            <p className="section-kicker">Requirements</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {requirements.map((item) => (
                <div className="stat-card" key={item.label}>
                  <p className="stat-label">{item.label}</p>
                  <p className="stat-value">{item.value}</p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>
      </section>

      {/* QA */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <Reveal delay={2560}>
          <article className="project-card">
            <p className="section-kicker">QA value</p>

            <h2 className="mt-4 font-display text-3xl">
              Testing the tool and the generated result
            </h2>

            <div className="mt-7 space-y-3">
              {qaNotes.map((note) => (
                <div className="flex gap-3" key={note}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />

                  <p className="text-sm leading-7 text-[var(--soft)]">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={2640}>
          <article className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">Engineering focus</p>

            <div className="mt-6 space-y-6">
              <div>
                <p className="stat-label">Parsing</p>
                <p className="mt-2 text-sm leading-6 text-[var(--soft)]">
                  Converting Unreal Engine asset structures into usable
                  application data.
                </p>
              </div>

              <div>
                <p className="stat-label">Visualization</p>
                <p className="mt-2 text-sm leading-6 text-[var(--soft)]">
                  Making animation and skeleton data understandable through
                  interactive 3D visualization.
                </p>
              </div>

              <div>
                <p className="stat-label">Iteration</p>
                <p className="mt-2 text-sm leading-6 text-[var(--soft)]">
                  Repeatedly testing generated data inside the actual game to
                  validate the tool&apos;s output.
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      {/* DISCLAIMER */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <Reveal delay={2720}>
          <article className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">Disclaimer</p>

            <p className="mt-6 max-w-4xl leading-7 text-[var(--soft)]">
              This is an unofficial fan-made modding tool and is not
              affiliated with the original Sifu developers. The original Sifu
              belongs to its respective creators. Sifu Custom Moveset Maker is
              open source and released for educational and modding purposes.
              This portfolio page focuses on modding, animation parsing,
              combo tree visualization, unit tuning, and Unreal Engine
              integration work.
            </p>
          </article>
        </Reveal>
      </section>
    </main>
  );
}
