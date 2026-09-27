"use client";

import { useEffect } from "react";
import { experience } from "./experience/data";
import Reveal from "./components/reveal";

const projects = [
  {
    name: "Sifu Custom Moveset Maker",
    type: "Modding tool / Moveset editor",
    period: "Aug 2026 - Present",
    highlight: "Released WPF .NET 10 modding tool with an interactive combo tree editor, Three.js 3D animation viewer, and one-click pak export.",
    description:
      "A C# WPF modding tool for Sifu that lets you edit combo trees for the player, enemies, and bosses. Features include drag-and-drop animation swapping, unit property and attack tuning, 12 stances, auto-extraction of game assets, and UE4 pak export/import via UnrealPak.",
    stack: ["C#", ".NET 10", "WPF", "Three.js", "CUE4Parse", "UAssetAPI", "Newtonsoft.Json", "UnrealPak"],
    href: "/projects/sifu-moveset-editor",
  },
  {
    name: "Stick War 2: Enhanced Edition Mod",
    type: "Campaign overhaul and optimization mod",
    period: "Mar 2026 - Present",
    highlight: "Current fan-made Flash mod focused on campaign expansion, boss systems, AI behavior, bug fixing, and performance cleanup.",
    description:
      "A large campaign-focused overhaul that adds boss encounters, replayable campaign levels, smarter enemy behavior, player-side toggles, and smoother runtime behavior for a Flash/AS3 game.",
    stack: ["Flash", "ActionScript 3", "Performance Optimization", "Game Modding", "QA Testing", "Visual Studio Code", "Git/GitHub"],
    href: "/projects/enhanced-edition-mod",
  },
  {
    name: "Sensei",
    type: "Mobile application",
    period: "Jan 2025 - Feb 2025",
    highlight: "1st place winner at UDST Skills Day Competition.",
    description:
      "A peer tutoring app that lets tutees request sessions by topic and schedule while tutors can accept or reschedule based on availability.",
    stack: ["React Native", "Expo", "Firebase", "Git/GitHub", "Visual Studio Code"],
  },
  {
    name: "ThermoGuard",
    type: "Monitoring and alert platform",
    period: "May 2024 - Dec 2024",
    highlight: "Combined real-time monitoring, predictive alerts, dashboard UI, and 3D interaction.",
    description:
      "An advanced monitoring system with sensor-driven telemetry, temperature prediction, and an interactive dashboard for system status and server visualization.",
    stack: ["JavaScript", "Node.js", "Python", "MongoDB", "Machine Learning", "Git/GitHub", "Visual Studio Code"],
  },
  {
    name: "Quiz App",
    type: "Mobile application",
    period: "Jan 2023 - Mar 2023",
    highlight: "Focused on flexible quiz creation and a friend-based invitation flow.",
    description:
      "A collaborative quiz platform with multiple section types, custom quiz authoring, and invitation-based participation.",
    stack: ["React Native", "Expo", "Firebase", "Visual Studio Code"],
  }
];

const earlyProjects = [
  {
    name: "Ball Obstacle Course",
    type: "Early game project",
    period: "Sep 2019 - Nov 2019",
    highlight: "Built during high school and presented at Celebration of Learning.",
    description:
      "A 3D Unity game built around a ball navigation mechanic combined with a first-person obstacle course.",
    stack: ["Unity", "C#", "Visual Studio 2019"],
  },
];

const skillGroups = [
  {
    title: "Languages",
    items: ["Python", "JavaScript", "C#", "C++", "HTML", "CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Next.js", "Express.js", "FastAPI", "Flask", "SQLAlchemy"],
  },
  {
    title: "Frontend and Mobile",
    items: ["ReactJS", "React Native", "Expo", "Tailwind CSS"],
  },
  {
    title: "Testing",
    items: ["Playwright", "Cucumber", "Regression Testing", "Compatibility Testing"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Postman", "Figma", "VS Code", "Visual Studio 2022"],
  },
  {
    title: "Platforms and Data",
    items: ["Unreal Engine 5", "Unity", "Firebase", "MongoDB", "MySQL", "MariaDB", "Machine Learning"],
  },
];

const documents = [
  {
    label: "Download CV",
    href: "/documents/CV.pdf",
    note: "Full overview of my education, skills, and professional experience.",
  },
  {
    label: "Monet Certificate",
    href: "/documents/Internship-Certificate-Monet.jpg",
    note: "Certificate of completion for my Unreal Engine development internship at Monet (QSTP).",
  },
  {
    label: "Edgage Certificate",
    href: "/documents/Internship-Certificate-Edgage.pdf",
    note: "Certificate of completion for my Software QA internship at Edgage (QSTP).",
  },
];

const contactItems = [
  {
    label: "Email",
    value: "charlestiu16@gmail.com",
    href: "mailto:charlestiu16@gmail.com",
  },
];

const profileLinks = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/charles-tiu-69a6a9328/",
    href: "https://www.linkedin.com/in/charles-tiu-69a6a9328/",
  },
  {
    label: "GitHub",
    value: "github.com/ChorlsChu",
    href: "https://github.com/ChorlsChu",
  },
];

export default function Home() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) {
      return;
    }
    const handleScroll = () => {
      header.classList.toggle("nav-scrolled", window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const startPosition = window.scrollY;
    const headerHeight = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
    const targetPosition = target.getBoundingClientRect().top + startPosition - headerHeight - 24;
    const distance = targetPosition - startPosition;
    const duration = Math.min(1150, Math.max(650, Math.abs(distance) * 0.45));
    const startTime = performance.now();
    const easeInOutCubic = (progress: number) =>
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const animateScroll = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      window.scrollTo({ top: startPosition + distance * easeInOutCubic(progress) });

      if (progress < 1) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.requestAnimationFrame(animateScroll);
    window.history.replaceState(null, "", `#${targetId}`);
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="intro-hero relative overflow-hidden">
        <video
          className="intro-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/wallpapers/intro_wallpaper.mp4" type="video/mp4" />
        </video>
        <div className="intro-overlay pointer-events-none absolute inset-0" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
          <header className="site-header flex flex-wrap items-center justify-end gap-4 rounded-xl px-4 py-3 -mx-4">
            <nav className="flex flex-wrap gap-3 text-sm text-[var(--soft)]">
              <a className="nav-link" href="#experience" onClick={(event) => handleAnchorClick(event, "experience")}>
                Experience
              </a>
              <a className="nav-link" href="#projects" onClick={(event) => handleAnchorClick(event, "projects")}>
                Projects
              </a>
              <a className="nav-link" href="#skills" onClick={(event) => handleAnchorClick(event, "skills")}>
                Skills
              </a>
              <a className="nav-link" href="#documents" onClick={(event) => handleAnchorClick(event, "documents")}>
                Contacts
              </a>
            </nav>
          </header>

          <div className="intro-content flex flex-1 items-center justify-center py-16 text-center sm:py-20">
            <Reveal>
              <div id="top">
                <p className="section-kicker">Based in Doha, Qatar</p>
                <h1 className="intro-name mt-5">Charles Emmanuel Tiu</h1>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[var(--text)] sm:text-xl">
                  Full Stack Developer & Software Engineer, passionate about building web and mobile experiences, solving problems through technology, and turning ideas into practical solutions.
                </p>
                <a className="scroll-prompt mt-14" href="#education" onClick={(event) => handleAnchorClick(event, "education")}>
                  <span>Scroll to explore</span>
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12" id="education">
        <Reveal>
          <div className="glass-panel p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">Education</p>
                  <h2 className="mt-3 font-display text-2xl">University of Doha for Science and Technology</h2>
                </div>
                <span className="rounded-full border border-[var(--line)] bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Aug 2025
                </span>
              </div>
              <p className="mt-4 text-[var(--soft)]">
                Bachelor of Science in Information Systems with hands-on experience across software QA, backend engineering, mobile product work, and interactive 3D experiences.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="stat-card">
                  <p className="stat-label">Specialties</p>
                  <p className="stat-value">Development, APIs, QA, automation</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Winning project</p>
                  <p className="stat-value">Sensei, 1st Place</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Core mindset</p>
                  <p className="stat-value">Reliable and detail-oriented</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Focus</p>
                  <p className="stat-value">Quality-first product building</p>
                </div>
              </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12" id="experience">
        <div className="section-heading">
          <p className="section-kicker">Experience</p>
        </div>
        <div className="mt-10 grid gap-6">
          {experience.map((item, index) => (
            <Reveal delay={350 + index * 90} key={item.company + item.role}>
              <article className="glass-panel grid gap-8 p-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">{item.period}</p>
                  <h3 className="mt-4 font-display text-3xl">{item.role}</h3>
                  <p className="mt-2 text-lg text-[var(--soft)]">{`${item.company} - ${item.location}`}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.stack.map((tool) => (
                      <span className="tag" key={tool}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="space-y-3 text-[var(--soft)]">
                  {item.points.map((point) => (
                    <li className="flex gap-3" key={point}>
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <a className="case-study-link" href={`/experience/${item.slug}`}>
                  View case study
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12" id="projects">
        <div className="section-heading">
          <p className="section-kicker">Projects</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal delay={750 + index * 90} key={project.name}>
              <article className="project-card">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">{project.type}</p>
                  <span className="text-sm text-[var(--soft)]">{project.period}</span>
                </div>
                <h3 className="mt-6 font-display text-3xl">{project.name}</h3>
                <p className="mt-4 text-[var(--soft)]">{project.description}</p>
                <p className="mt-5 rounded-2xl border border-[var(--line)] bg-white/5 p-4 text-sm text-[var(--muted)]">
                  {project.highlight}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((tool) => (
                    <span className="tag" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
                {"href" in project && project.href ? (
                  <a className="case-study-link" href={project.href}>
                    View case study
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-0 sm:px-10 lg:px-12">
        <div className="glass-panel p-6 sm:p-8">
          <div className="grid gap-6">
            {earlyProjects.map((project) => (
              <Reveal delay={1050} key={project.name}>
                <article className="project-card">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">{project.type}</p>
                      <h3 className="mt-3 font-display text-3xl">{project.name}</h3>
                    </div>
                    <span className="text-sm text-[var(--soft)]">{project.period}</span>
                  </div>
                  <p className="mt-4 text-[var(--soft)]">{project.description}</p>
                  <p className="mt-5 rounded-2xl border border-[var(--line)] bg-white/5 p-4 text-sm text-[var(--muted)]">
                    {project.highlight}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((tool) => (
                      <span className="tag" key={tool}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12" id="skills">
        <div className="section-heading">
          <p className="section-kicker">Skills</p>
          <p className="mt-5 max-w-2xl text-[var(--soft)]">
            My background blends structured QA practices with development experience across mobile apps, APIs, data systems, and real-time 3D tools.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <Reveal delay={1100 + index * 80} key={group.title}>
              <article className="skill-card">
                <h3 className="font-display text-2xl">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-20 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-12">
        <Reveal delay={1500}>
          <article className="glass-panel p-6 sm:p-8" id="documents">
            <p className="section-kicker">Documents</p>
            <h2 className="mt-3 font-display text-3xl">CV and certificates</h2>
            <div className="mt-6 space-y-3">
              {documents.map((doc) => (
                <a className="document-link" href={doc.href} key={doc.label} target="_blank" rel="noreferrer">
                  <span>
                    <span className="block text-base font-medium text-[var(--text)]">{doc.label}</span>
                    <span className="mt-1 block text-sm text-[var(--soft)]">{doc.note}</span>
                  </span>
                  <span className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Open</span>
                </a>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={1600}>
          <article className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">Connect</p>
            <h2 className="mt-3 font-display text-3xl">Contact and profiles</h2>

            <div className="mt-8 grid gap-4">
              <div className="info-card">
                <p className="info-card-label">Contact</p>
                <div className="mt-4 space-y-3">
                  {contactItems.map((item) => (
                    <a className="profile-link" href={item.href} key={item.label}>
                      <span>
                        <span className="block text-sm uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</span>
                        <span className="mt-2 block text-base font-medium text-[var(--text)]">{item.value}</span>
                      </span>
                      <span className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Open</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="info-card">
                <p className="info-card-label">GitHub and LinkedIn</p>
                <div className="mt-4 space-y-3">
                  {profileLinks.map((item) => (
                    <a className="profile-link" href={item.href} key={item.label} target="_blank" rel="noreferrer">
                      <span>
                        <span className="block text-sm uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</span>
                        <span className="mt-2 block text-base font-medium text-[var(--text)]">{item.value}</span>
                      </span>
                      <span className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Visit</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </section>
    </main>
  );
}
