"use client";

const experience = [
  {
    role: "Full Stack Developer",
    company: "Afya AI",
    location: "Doha, Qatar",
    period: "Apr 2025 - Present",
    points: [
      "Developed and maintained full-stack features for a healthcare system in collaboration with Hamad Medical Corporation.",
      "Designed and implemented backend services and RESTful APIs to support data exchange and system integration across healthcare-related modules.",
      "Built and maintained responsive web application features using modern frontend and backend technologies.",
      "Contributed to system reliability through debugging, testing, and validation of core functionalities across development environments.",
      "Worked closely with cross-functional teams to translate requirements into scalable and maintainable software solutions.",
      "Participated in continuous improvement of system performance, usability, and development workflows within an enterprise healthcare context.",
    ],
    stack: ["JavaScript", "Flutter", "Node.js", "Dart", "React", "Express.js", "REST API", "Git/GitHub", "Visual Studio Code", "Android Studio"],
  },
  {
    role: "Software Quality Assurance",
    company: "Edgage",
    location: "Doha, Qatar",
    period: "Nov 2025 - Mar 2026",
    points: [
      "Tested new features and enhancements before release to keep quality standards high across product updates.",
      "Documented defects with clear reproduction steps and worked closely with developers to validate fixes.",
      "Executed functional, regression, and compatibility testing across multiple environments and platforms.",
      "Built and maintained QA documentation, test cases, and checklists to improve coverage and team efficiency.",
      "Developed basic end-to-end automation with Playwright and Cucumber to support regression testing.",
    ],
    stack: ["JavaScript", "Node.js", "Playwright", "Cucumber", "Git/GitHub", "Google Sheets", "Visual Studio Code"],
  },
  {
    role: "Unreal Engine Developer",
    company: "Monet",
    location: "Doha, Qatar",
    period: "May 2025 - Aug 2025",
    points: [
      "Built and optimized features in Unreal Engine for interactive 3D venue planning and visualization.",
      "Implemented multiplayer collaboration tools for real-time asset placement and user interaction.",
      "Integrated AI-assisted workflows to speed up 3D asset creation from reference materials.",
      "Designed and maintained RESTful APIs to support communication between client and server systems.",
      "Improved usability and performance by refining workflows across cross-functional development efforts.",
    ],
    stack: ["Diversion", "Unreal Engine 5", "Next.js", "JavaScript", "Firebase", "REST API", "Git/GitHub", "Visual Studio Code"],
  },
];

const projects = [
  {
    name: "Stick War 2: Enhanced Edition Mod",
    type: "Campaign overhaul and optimization mod",
    period: "Mar 2026 - Present",
    highlight: "Current fan-made Flash mod focused on campaign expansion, boss systems, AI behavior, bug fixing, and performance cleanup.",
    description:
      "A large campaign-focused overhaul that adds boss encounters, replayable campaign levels, smarter enemy behavior, player-side toggles, and smoother runtime behavior for a Flash/AS3 game.",
    stack: ["Flash", "ActionScript 3", "Performance Optimization", "Game Modding", "QA Testing", "Visual Studio Code", "Git/GitHub"],
    href: "/projects/flash-optimization-mod",
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
  },
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
    value: "https://github.com/ChorlsChu",
    href: "https://github.com/ChorlsChu",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(111,168,220,0.18),_transparent_34%),radial-gradient(circle_at_85%_15%,_rgba(236,179,101,0.16),_transparent_24%),linear-gradient(180deg,_rgba(7,16,26,0.1),_transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg tracking-[0.3em] text-[var(--muted)] uppercase">
                Charles Emmanuel C. Tiu
              </p>
              <p className="mt-2 max-w-md text-sm text-[var(--soft)]">
                QA-focused Information Systems graduate building reliable software, tested workflows, and practical full-stack products.
              </p>
            </div>
            <nav className="flex flex-wrap gap-3 text-sm text-[var(--soft)]">
              <a className="nav-link" href="#experience">
                Experience
              </a>
              <a className="nav-link" href="#projects">
                Projects
              </a>
              <a className="nav-link" href="#skills">
                Skills
              </a>
              <a className="nav-link" href="#documents">
                Documents
              </a>
            </nav>
          </header>

          <div className="grid gap-14 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:py-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-white/5 px-4 py-2 text-sm text-[var(--muted)] shadow-[0_14px_36px_rgba(2,8,18,0.28)] backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                Based in Doha, Qatar
              </div>
              <div className="space-y-6">
                <p className="section-kicker">Software QA and full-stack developer</p>
                <h1 className="section-title">
                  Building dependable software through testing, debugging, and clean product execution.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--soft)] sm:text-xl">
                  My work sits between quality assurance and development: validating features, tracking defects, automating regression checks, and building web, mobile, backend, and 3D systems with reliability in mind.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a className="button-primary" href="/documents/CV.pdf" target="_blank" rel="noreferrer">
                  View CV
                </a>
                <a className="button-secondary" href="#projects">
                  Explore Projects
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="mini-signal">
                  <span className="mini-label">Core</span>
                  <span className="mini-value">Manual and automated QA</span>
                </div>
                <div className="mini-signal">
                  <span className="mini-label">Testing</span>
                  <span className="mini-value">Playwright and Cucumber</span>
                </div>
                <div className="mini-signal">
                  <span className="mini-label">Build Range</span>
                  <span className="mini-value">Full-stack, mobile, and 3D</span>
                </div>
              </div>
            </div>

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
                  <p className="stat-value">QA, automation, APIs</p>
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
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12" id="experience">
        <div className="section-heading">
          <p className="section-kicker">Experience</p>
        </div>
        <div className="mt-10 grid gap-6">
          {experience.map((item) => (
            <article className="glass-panel grid gap-8 p-6 lg:grid-cols-[0.8fr_1.2fr]" key={item.company + item.role}>
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
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12" id="projects">
        <div className="section-heading">
          <p className="section-kicker">Projects</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
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
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-0 sm:px-10 lg:px-12">
        <div className="glass-panel p-6 sm:p-8">
          <div className="grid gap-6">
            {earlyProjects.map((project) => (
              <article className="project-card" key={project.name}>
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
          {skillGroups.map((group) => (
            <article className="skill-card" key={group.title}>
              <h3 className="font-display text-2xl">{group.title}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-20 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-12">
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
      </section>
    </main>
  );
}
