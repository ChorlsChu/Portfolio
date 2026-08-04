import type { Experience } from "./data";
import MediaGallery from "./media-gallery";
import Reveal from "../components/reveal";

export default function ExperienceLayout({ experience }: { experience: Experience }) {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(111,168,220,0.18),_transparent_34%),radial-gradient(circle_at_85%_15%,_rgba(236,179,101,0.16),_transparent_24%)]" />
        <div className="ambient-blob pointer-events-none absolute -left-24 top-12 h-80 w-80 rounded-full bg-[rgba(110,160,200,0.12)] blur-3xl" />
        <div className="ambient-blob pointer-events-none absolute -right-20 top-56 h-72 w-72 rounded-full bg-[rgba(201,166,107,0.1)] blur-3xl" style={{ animationDelay: "-8s" }} />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> for cross-document view transition */}
          <a className="nav-link inline-flex text-sm text-[var(--soft)]" href="/#experience">
            Back to experience
          </a>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <Reveal>
              <div>
                <p className="section-kicker">{experience.kicker}</p>
                <h1 className="section-title animated-gradient mt-5">
                  {experience.role} at {experience.company}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--soft)] sm:text-xl">
                  {experience.summary}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {experience.stack.map((tool) => (
                    <span className="tag" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <aside className="glass-panel p-6 sm:p-8">
                <p className="section-kicker">Role details</p>
                <div className="mt-6 grid gap-4">
                  <div className="stat-card">
                    <p className="stat-label">Company</p>
                    <p className="stat-value">{experience.company}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Location</p>
                    <p className="stat-value">{experience.location}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Timeline</p>
                    <p className="stat-value">{experience.period}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">Role</p>
                    <p className="stat-value">{experience.role}</p>
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-12">
        <Reveal delay={250}>
          <article className="project-card lg:col-span-2">
            <p className="section-kicker">What I did</p>
            <ul className="mt-6 space-y-3 text-[var(--soft)]">
              {experience.points.map((point) => (
                <li className="flex gap-3" key={point}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>

        <Reveal delay={350}>
          <article className="project-card">
            <p className="section-kicker">Stack</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {experience.stack.map((tool) => (
                <span className="tag" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
          </article>
        </Reveal>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-12">
        {experience.projects.map((project, index) => (
          <Reveal delay={500 + index * 90} key={project.name}>
            <article className="project-card">
              <p className="section-kicker">{project.name}</p>
              <p className="mt-5 leading-7 text-[var(--soft)]">{project.summary}</p>
              <ul className="mt-5 space-y-3 text-[var(--soft)]">
                {project.bullets.map((bullet) => (
                  <li className="flex gap-3" key={bullet}>
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent-strong)]" />
                    <span className="text-sm leading-6">{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-12">
        <Reveal delay={800}>
          <article className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">Challenges</p>
            <div className="mt-6 space-y-3">
              {experience.challenges.map((item) => (
                <p className="text-[var(--soft)]" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={900}>
          <article className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">Results</p>
            <div className="mt-6 space-y-3">
              {experience.results.map((item) => (
                <p className="text-[var(--soft)]" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </article>
        </Reveal>
      </section>

      {experience.media.length > 0 ? (
        <Reveal delay={1100}>
          <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
            <div className="section-heading">
              <p className="section-kicker">Screenshots and media</p>
              <p className="mt-5 max-w-3xl text-[var(--soft)]">
                Screenshots of the projects and systems I worked on. Media will be added here as it becomes available.
              </p>
            </div>
            <MediaGallery items={experience.media} />
          </section>
        </Reveal>
      ) : null}

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-12">
        {experience.links.length > 0 ? (
          <Reveal delay={1300}>
            <article className="glass-panel p-6 sm:p-8">
              <p className="section-kicker">Links</p>
              <div className="mt-6 grid gap-3">
                {experience.links.map((link) => (
                  <a className="case-study-link" href={link.href} key={link.label} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          </Reveal>
        ) : null}

        <Reveal delay={1400}>
          <article className="glass-panel p-6 sm:p-8">
            <p className="section-kicker">Disclaimer</p>
            <p className="mt-6 leading-7 text-[var(--soft)]">
              {experience.disclaimer ??
                "This page describes general professional work. Specific product details, internal systems, and confidential client material are intentionally not shown."}
            </p>
          </article>
        </Reveal>
      </section>
    </main>
  );
}
