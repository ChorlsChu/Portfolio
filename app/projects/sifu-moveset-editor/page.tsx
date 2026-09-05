import Link from "next/link";
import Image from "next/image";
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

const project = {
  name: "Sifu Modding - Moveset Maker",
  type: "Modding Tool / Moveset Editor",
  period: "Aug 2026 - Present",
  role: "Modder / Developer",
  highlight:
    "A WPF .NET 10 moveset editor with Three.js 3D skeleton visualization and Unreal Engine asset parsing.",
  description:
    "A C# WPF modding tool for Sifu that allows creating and editing character movesets. It combines animation parsing, 3D skeleton visualization, stance generation and patching, and Unreal Engine asset handling into a single desktop workflow.",
  stack: [
    "C#",
    ".NET 10",
    "WPF",
    "Three.js",
    "CUE4Parse",
    "UAssetAPI",
    "Newtonsoft.Json",
  ],
};

const features: Feature[] = [
  {
    title: "Animation parsing",
    description:
      "Reads Sifu animation data and converts it into information that can be inspected, edited, and used by the moveset workflow.",
  },
  {
    title: "3D skeleton viewer",
    description:
      "Visualizes character skeletons in Three.js with animation playback so bone structure and animation behavior can be inspected directly.",
  },
  {
    title: "Moveset editing",
    description:
      "Provides a dedicated desktop workflow for creating and editing character movesets instead of manually manipulating game files.",
  },
  {
    title: "Stance generation",
    description:
      "Generates and patches stance-related data to make custom character stances easier to build and test.",
  },
  {
    title: "Unreal asset handling",
    description:
      "Uses CUE4Parse and UAssetAPI to work with Unreal Engine asset formats including .uasset and .uexp files.",
  },
  {
    title: "Mod data serialization",
    description:
      "Uses structured JSON serialization to keep editable mod data organized and portable throughout the workflow.",
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
    technology: "Three.js",
    description:
      "The embedded 3D viewer renders character skeletons and provides animation playback for inspecting movement, bone hierarchy, and animation behavior.",
  },
  {
    title: "Unreal Engine assets",
    technology: "CUE4Parse / UAssetAPI",
    description:
      "Unreal Engine asset libraries are parsed to extract and work with the data required by the moveset and animation systems.",
  },
  {
    title: "Data layer",
    technology: "Newtonsoft.Json",
    description:
      "Structured JSON data is used for mod configuration and serialization, keeping editable information separate from the application logic.",
  },
];

const workflow = [
  "Load the required Sifu game assets.",
  "Parse Unreal Engine asset data and animation information.",
  "Inspect the character skeleton and animations through the 3D viewer.",
  "Create or modify moveset and stance data.",
  "Generate or patch the required game data.",
  "Test the resulting moveset in Sifu and iterate on the changes.",
];

const qaNotes = [
  "Tested animation parsing accuracy across multiple character animsets.",
  "Validated skeleton rendering and bone hierarchy behavior in the 3D viewer.",
  "Tested frame timing and animation playback behavior.",
  "Validated stance transitions and generated stance data.",
  "Tested Unreal Engine asset parsing across different asset structures.",
  "Used repeated game-side testing to catch parsing and generated-data issues.",
];

const technicalChallenges = [
  {
    title: "Game data is not designed for editing",
    description:
      "The tool has to interpret existing game assets and transform low-level Unreal Engine data into something that can be edited through a higher-level moveset workflow.",
  },
  {
    title: "Animation data needs visual validation",
    description:
      "Parsing animation information is not enough on its own. The 3D skeleton viewer provides a visual way to confirm that the parsed hierarchy and animation data behave correctly.",
  },
  {
    title: "Mod generation must remain consistent",
    description:
      "Generated and patched data needs to match the structure expected by the game, making validation and repeated testing an important part of the development process.",
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
                <p className="section-kicker">Current modding project</p>

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
                    <span className="tag">Skeletons</span>
                    <span className="tag">Movesets</span>
                    <span className="tag">Stances</span>
                    <span className="tag">Unreal Assets</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--line)] bg-white/[0.03] p-6 sm:p-8 lg:border-l lg:border-t-0">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="stat-label">Problem</p>
                    <p className="mt-3 leading-7 text-[var(--soft)]">
                      Sifu's animation and character data lives inside Unreal
                      Engine assets that are not designed around a convenient
                      modding workflow.
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
                      A single workflow connecting asset parsing, animation
                      inspection, skeleton visualization, moveset editing,
                      and mod generation.
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
        <Reveal delay={700}>
          <article className="glass-panel h-full p-6 sm:p-8">
            <p className="section-kicker">Technical architecture</p>

            <h2 className="mt-4 font-display text-3xl">
              Multiple systems working together
            </h2>

            <p className="mt-5 leading-7 text-[var(--soft)]">
              The tool sits between a desktop editing interface and the game's
              underlying Unreal Engine data. Each technology handles a
              different part of that pipeline.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                Workflow
              </p>

              <p className="mt-4 text-sm leading-7 text-[var(--soft)]">
                Game assets → Unreal parsing → animation data → 3D skeleton
                visualization → moveset editing → generated / patched data →
                in-game testing
              </p>
            </div>
          </article>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {technicalSystems.map((system, index) => (
            <Reveal delay={760 + index * 80} key={system.title}>
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

      {/* WPF UI + DEMO */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <Reveal delay={1050}>
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
                      Three.js skeleton and animation viewer
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
                  <span className="tag">Animation Playback</span>
                  <span className="tag">3D Skeleton</span>
                  <span className="tag">Moveset Editing</span>
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
            <Reveal delay={1200 + index * 80} key={challenge.title}>
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
        <Reveal delay={1450}>
          <article className="project-card h-full">
            <p className="section-kicker">Typical workflow</p>

            <h2 className="mt-4 font-display text-3xl">
              From asset inspection to in-game testing
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

        <Reveal delay={1530}>
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

      {/* TRY IT
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <Reveal delay={1650}>
          <article className="glass-panel overflow-hidden">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
              <div className="p-6 sm:p-8">
                <p className="section-kicker">How to try it</p>

                <h2 className="mt-4 font-display text-3xl">
                  Local WPF development build
                </h2>

                <p className="mt-5 leading-7 text-[var(--soft)]">
                  The Moveset Maker is intended to run locally as a standalone
                  Windows application. The current project is still under
                  development, so distribution links will be added when a
                  public build is ready.
                </p>

                <div className="mt-6 grid gap-3">
                  <a className="download-link" href="#">
                    Download WPF Application
                  </a>

                  <a className="download-link" href="#">
                    Download Mod Setup
                  </a>

                  <a
                    className="case-study-link"
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Setup on GitHub
                  </a>
                </div>
              </div>

              <div className="border-t border-[var(--line)] bg-white/[0.03] p-6 sm:p-8 lg:border-l lg:border-t-0">
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                  Current development status
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="stat-card">
                    <p className="stat-label">Platform</p>
                    <p className="stat-value">Windows / WPF</p>
                  </div>

                  <div className="stat-card">
                    <p className="stat-label">Framework</p>
                    <p className="stat-value">.NET 10</p>
                  </div>

                  <div className="stat-card">
                    <p className="stat-label">Project stage</p>
                    <p className="stat-value">Active development</p>
                  </div>

                  <div className="stat-card">
                    <p className="stat-label">Focus</p>
                    <p className="stat-value">Moveset tooling</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </section> */}

      {/* QA */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <Reveal delay={1800}>
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

        <Reveal delay={1880}>
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
                  validate the tool's output.
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      {/* DISCLAIMER */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <Reveal delay={1950}>
          <article className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">Disclaimer</p>

            <p className="mt-6 max-w-4xl leading-7 text-[var(--soft)]">
              This is an unofficial fan-made modding tool and is not
              affiliated with the original Sifu developers. The original Sifu
              belongs to its respective creators. This portfolio page focuses
              on modding, animation parsing, skeleton visualization, moveset
              tooling, and Unreal Engine integration work.
            </p>
          </article>
        </Reveal>
      </section>
    </main>
  );
}