export type ExperienceProject = {
  name: string;
  summary: string;
  bullets: string[];
};

export type ExperienceMedia = {
  src: string;
  alt: string;
  caption: string;
};

export type ExperienceLink = {
  label: string;
  href: string;
};

export type Experience = {
  slug: string;
  role: string;
  company: string;
  location: string;
  period: string;
  kicker: string;
  summary: string;
  points: string[];
  stack: string[];
  projects: ExperienceProject[];
  challenges: string[];
  results: string[];
  media: ExperienceMedia[];
  links: ExperienceLink[];
  disclaimer?: string;
};

export const experience: Experience[] = [
  {
    slug: "sehtana",
    role: "Full Stack Developer",
    company: "Sehtana",
    location: "Doha, Qatar",
    period: "Apr 2025 - Present",
    kicker: "Full-stack development on a multi-app healthcare platform",
    summary:
      "Full stack developer on a multi-app healthcare technology initiative addressing real-world clinical and operational needs identified with healthcare stakeholders. Beyond full-stack features and REST APIs, I designed and built two prototypes: an indoor navigation map that guides patients through the facility from the kiosk, and an executive analytics dashboard for hospital leadership.",
    points: [
      "Developed and maintained full-stack features for a healthcare technology initiative addressing real-world clinical and operational needs identified with healthcare stakeholders.",
      "Designed and implemented backend services and RESTful APIs to support data exchange and system integration across healthcare-related modules.",
      "Built and maintained responsive web application features using modern frontend and backend technologies.",
      "Built the indoor navigation map prototype used for kiosk wayfinding and the executive analytics dashboard prototype for hospital leadership.",
      "Fixed reliability bugs across the mobile and kiosk apps, including timezone and date handling for appointments.",
      "Worked closely with cross-functional teams to translate requirements into scalable and maintainable software solutions.",
      "Participated in continuous improvement of system performance, usability, and development workflows within an enterprise healthcare context.",
    ],
    stack: ["JavaScript", "Flutter", "Dart", "React", "Node.js", "Express.js", "REST API", "Git/GitHub", "Visual Studio Code", "Android Studio"],
    projects: [
      {
        name: "Indoor navigation map prototype",
        summary:
          "Designed and built a map editing prototype for indoor wayfinding, so the kiosk can show patients where to go based on their appointment.",
        bullets: [
          "Built a multi-floor map editor with rooms, waypoints, walkable paths, and inter-floor connectors.",
          "Added room placement with wall-join snapping, selection, copy/paste, zoom, and pan controls.",
          "Supported exporting maps as JSON and uploading them to the backend for use by the kiosk.",
          "Designed the prototype to display appointment-based directions to the correct department and doctor.",
          "Built a route-testing page that imports exported maps, computes the shortest path, and previews turn-by-turn directions across floors.",
        ],
      },
      {
        name: "Doctor and kiosk assignment console",
        summary:
          "Built a console to manage the data behind kiosk wayfinding: which room each doctor is in, and which map and start point each kiosk uses.",
        bullets: [
          "Doctor tab: search doctors, pick a map and floor, then click the room on the map to assign that doctor to it.",
          "Auto-matched doctors' official room numbers to rooms in active maps, flagging ambiguous matches and unassignable rooms.",
          "Kiosk tab: assign maps to kiosks, choose a default map, and place each kiosk's start waypoint on the floor plan.",
          "Made kiosk start points draggable for fine-tuning, keeping per-map start node, floor, and offset.",
          "Kept assignments as drafts until saved so browsing doctors and kiosks never commits changes accidentally.",
        ],
      },
      {
        name: "Executive and analytics dashboard prototype",
        summary:
          "Designed and built an analytics dashboard for executives and administrators, showing how the hospital is performing at a glance.",
        bullets: [
          "Built KPI overview, patient flow, wait-time vs. target, patient feedback, and staff performance views.",
          "Created custom animated charts for volume, wait times, ratings, and service-stage status.",
          "Added facility switching and alert-style callouts for bottlenecks and flagged signals.",
          "Iterated on the design in Flutter and prototyped a React version to compare implementation approaches.",
        ],
      },
      {
        name: "Full-stack clinical features",
        summary:
          "Built and maintained responsive web features and the backend services behind the platform's clinical workflow.",
        bullets: [
          "Developed full-stack features end to end for the healthcare system.",
          "Designed RESTful API contracts for integration with internal and external systems.",
          "Worked across a modern stack including JavaScript, Flutter, React, Node.js, and Express.js.",
        ],
      },
      {
        name: "Mobile and kiosk reliability fixes",
        summary:
          "Diagnosed and fixed reliability bugs across the patient mobile app and the check-in kiosk.",
        bullets: [
          "Fixed booking issues caused by timezone and date handling between the mobile app and backend.",
          "Corrected doctor shift and slot-time mapping for non-default facilities.",
          "Resolved an Android session timeout that kicked users off the OTP screen.",
          "Improved kiosk check-in details so ticket numbers and checked-in status are clearer.",
        ],
      },
    ],
    challenges: [
      "Working in a regulated healthcare environment where reliability and data correctness are critical.",
      "Designing a map editor that stays fast and usable while editing large, multi-floor layouts.",
      "Turning operational signals into a dashboard that reads clearly at a glance for leadership.",
      "Auto-matching doctors' official room numbers to rooms in the map while catching ambiguous or missing matches.",
      "Coordinating date, time, and shift logic consistently across the app, kiosk, and backend.",
    ],
    results: [
      "Delivered full-stack features for a healthcare technology initiative addressing real-world clinical and operational needs identified with healthcare stakeholders.",
      "Shipped a working indoor navigation map prototype wired into the kiosk wayfinding flow.",
      "Shipped an executive dashboard prototype across two implementation approaches for leadership review.",
      "Shipped a doctor and kiosk assignment console so wayfinding data stays in sync with staff and kiosk setup.",
      "Fixed timezone, shift, session, and check-in bugs that affected real booking and kiosk flows.",
    ],
    media: [
      { src: "/experience/sehtana/map_creator_1.gif", alt: "Multi-floor map editor", caption: "Room creation" },
      { src: "/experience/sehtana/map_creator_2.gif", alt: "Room placement and wall snapping", caption: "Room editing" },
      { src: "/experience/sehtana/map_creator_3.gif", alt: "Map export and route preview", caption: "Connecting rooms using nodes" },
      { src: "/experience/sehtana/map_creator_4.gif", alt: "Turn-by-turn directions preview", caption: "Turn-by-turn directions" },
    ],
    links: [],
    disclaimer:
      "This page describes my general work and prototypes. Specific product details, internal systems, and confidential client material are intentionally not shown. Prototypes shown are simplified versions built for demonstration.",
  },
  {
    slug: "edgage",
    role: "Software Quality Assurance",
    company: "Edgage",
    location: "Doha, Qatar",
    period: "Nov 2025 - Mar 2026",
    kicker: "Quality assurance and test automation",
    summary:
      "Software QA internship focused on protecting product quality across releases: testing new features and enhancements, documenting defects with clear reproduction steps, executing functional and regression suites, and building basic end-to-end automation with Playwright and Cucumber.",
    points: [
      "Tested new features and enhancements before release to keep quality standards high across product updates.",
      "Documented defects with clear reproduction steps and worked closely with developers to validate fixes.",
      "Executed functional, regression, and compatibility testing across multiple environments and platforms.",
      "Built and maintained QA documentation, test cases, and checklists to improve coverage and team efficiency.",
      "Developed basic end-to-end automation with Playwright and Cucumber to support regression testing.",
    ],
    stack: ["JavaScript", "Node.js", "Playwright", "Cucumber", "Git/GitHub", "Google Sheets", "Visual Studio Code"],
    projects: [
      {
        name: "Functional and regression testing",
        summary:
          "Executed functional, regression, and compatibility testing across multiple environments and platforms.",
        bullets: [
          "Tested new features and enhancements before release to keep quality high across product updates.",
          "Ran functional, regression, and compatibility suites across environments and platforms.",
          "Focused test effort on the highest-risk areas before each release.",
        ],
      },
      {
        name: "Defect tracking and documentation",
        summary:
          "Documented defects with clear reproduction steps and worked closely with developers to validate fixes.",
        bullets: [
          "Logged defects with clear, repeatable reproduction steps.",
          "Worked with developers to validate fixes and confirm resolution.",
          "Kept QA documentation, test cases, and checklists current to improve coverage.",
        ],
      },
      {
        name: "End-to-end test automation",
        summary:
          "Developed basic end-to-end automation with Playwright and Cucumber to support regression testing.",
        bullets: [
          "Built basic end-to-end automation covering core user flows.",
          "Used Playwright and Cucumber to support ongoing regression testing.",
          "Reduced repetitive manual checks with repeatable automated scenarios.",
        ],
      },
    ],
    challenges: [
      "Maintaining consistent coverage across multiple environments and platforms.",
      "Documenting defects precisely enough for fast reproduction and fixes.",
      "Starting automation early with limited existing test infrastructure.",
    ],
    results: [
      "Helped keep quality standards high across product updates and releases.",
      "Built QA documentation and checklists that improved team efficiency.",
      "Established a basic automation foundation for regression testing with Playwright and Cucumber.",
    ],
    media: [],
    links: [],
    disclaimer:
      "This page describes general QA work. Product details, internal systems, and confidential client material are intentionally not shown.",
  },
  {
    slug: "monet",
    role: "Unreal Engine Developer",
    company: "Monet",
    location: "Doha, Qatar",
    period: "May 2025 - Aug 2025",
    kicker: "Interactive 3D development at QSTP",
    summary:
      "Unreal Engine development internship at Monet (QSTP) focused on interactive 3D venue planning and visualization, multiplayer collaboration tools, AI-assisted asset workflows, and backend integration between client and server systems.",
    points: [
      "Built and optimized features in Unreal Engine for interactive 3D venue planning and visualization.",
      "Implemented multiplayer collaboration tools for real-time asset placement and user interaction.",
      "Integrated AI-assisted workflows to speed up 3D asset creation from reference materials.",
      "Designed and maintained RESTful APIs to support communication between client and server systems.",
      "Improved usability and performance by refining workflows across cross-functional development efforts.",
    ],
    stack: ["Diversion", "Unreal Engine 5", "Next.js", "JavaScript", "Firebase", "REST API", "Git/GitHub", "Visual Studio Code"],
    projects: [
      {
        name: "3D venue planning and visualization",
        summary:
          "Built and optimized features in Unreal Engine for interactive 3D venue planning and visualization.",
        bullets: [
          "Developed interactive features for planning and visualizing 3D venues.",
          "Optimized runtime performance and usability across venue scenes.",
          "Refined workflows with the broader product team to improve the end result.",
        ],
      },
      {
        name: "Multiplayer collaboration tools",
        summary:
          "Implemented multiplayer collaboration tools for real-time asset placement and user interaction.",
        bullets: [
          "Enabled real-time asset placement and user interaction in shared sessions.",
          "Coordinated state across connected clients for consistent collaboration.",
          "Kept multiplayer interactions responsive and predictable.",
        ],
      },
      {
        name: "AI-assisted workflows and backend integration",
        summary:
          "Integrated AI-assisted workflows and maintained RESTful APIs for client-server communication.",
        bullets: [
          "Integrated AI-assisted workflows to speed up 3D asset creation from reference materials.",
          "Designed and maintained RESTful APIs for client and server communication.",
          "Used Next.js and Firebase to support web and backend layers.",
        ],
      },
    ],
    challenges: [
      "Keeping real-time multiplayer collaboration stable across connected clients.",
      "Balancing visual quality with runtime performance in Unreal Engine.",
      "Integrating AI-assisted asset creation smoothly into existing production workflows.",
    ],
    results: [
      "Shipped interactive 3D venue planning and visualization features.",
      "Delivered multiplayer collaboration tools for real-time user interaction.",
      "Improved asset creation speed through AI-assisted workflows and stronger client-server integration.",
    ],
    media: [],
    links: [],
    disclaimer:
      "This page describes general internship work. Product details, internal systems, and confidential client material are intentionally not shown.",
  },
];

export function getExperience(slug: string): Experience | undefined {
  return experience.find((item) => item.slug === slug);
}
