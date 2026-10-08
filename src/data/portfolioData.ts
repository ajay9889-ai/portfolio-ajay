import { Project, SkillGroup, ExperienceItem, ProfileData } from "@/types";

export const PROFILE: ProfileData = {
  name: "Ajay A",
  role: "Full-stack developer",
  location: "Bengaluru, India",
  headline: "Ajay A",
  subtext: "Full-stack developer. I build web products from the interface to the API, from Bengaluru.",
  about: "MCA graduate who ships / React and Next.js, / wires them to APIs, / and tests until they hold.",
  aboutSupport: "HackVerse 2025 winner. Software development intern at BrikUp, building production features.",
  email: process.env.NEXT_PUBLIC_OWNER_EMAIL || "ajayhasrb123@gmail.com",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/ajay9889-ai",
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/ajay-a",
};

export const MARQUEE_TECH = [
  "React.js",
  "Next.js",
  "Node.js",
  "Python",
  "TypeScript",
  "REST APIs",
  "Tailwind CSS",
  "MongoDB",
  "PostgreSQL",
  "Three.js",
  "Socket.IO",
  "Git",
  "AWS",
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: "Frontend",
    items: ["React.js", "Next.js", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    name: "Backend",
    items: ["Python", "Node.js", "REST APIs"],
  },
  {
    name: "Data",
    items: ["MySQL", "MongoDB", "PostgreSQL"],
  },
  {
    name: "Tools",
    items: ["Git", "GitHub", "Postman", "basic AWS"],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "eldernest",
    title: "ElderNest",
    slug: "eldernest",
    badge: "HackVerse 2025 winner",
    tagline: "React platform for elderly users with community interaction, real-time assistance, and an accessible interface.",
    description: "ElderNest is an empathetic assistive web platform designed for senior citizens. It pairs high-contrast WCAG-compliant design with peer community spaces and immediate one-tap assistance dispatching.",
    role: "Lead Full-Stack Developer",
    timeline: "2025",
    technologies: ["React.js", "Next.js", "Tailwind CSS", "REST APIs", "Node.js"],
    problem: "Elderly individuals frequently face digital exclusion due to cluttered modern web interfaces, complex multi-step navigation, and inadequate accessibility standards, making it daunting to seek timely assistance or connect with community peers.",
    solution: "Engineered an ultra-clean, high-legibility interface using React and Tailwind CSS. Built high-contrast touch targets, simplified one-click assistance dispatching, and community channels with live status feedback.",
    result: "Won 1st Place at HackVerse 2025 for exceptional accessibility engineering, empathetic user experience, and robust API integration under competitive judging.",
    architecture: {
      summary: "Client-first accessible component system connected to resilient REST notification endpoints.",
      nodes: [
        { label: "Accessible UI", desc: "High-contrast React components with enhanced keyboard focus and screen-reader semantics." },
        { label: "Dispatch Gateway", desc: "REST endpoints handling instant assistance requests with validation and rate limiting." },
        { label: "Community Layer", desc: "Cached feed routes providing low-latency peer interactions and announcements." },
      ],
    },
    lessonsLearned: [
      "Strict WCAG AAA contrast and touch-target sizing dramatically reduce user frustration for older adults.",
      "Optimistic UI updates paired with clear status confirmations provide essential reassurance during critical assistance calls.",
    ],
    githubUrl: "https://github.com/ajay9889-ai",
  },
  {
    id: "wisdomplay",
    title: "WisdomPlay",
    slug: "wisdomplay",
    tagline: "Multilingual educational Unity game with animation, audio, and JSON-driven content.",
    description: "An interactive educational gaming environment designed to teach core curriculum concepts across multiple Indian regional languages via dynamic questions and responsive audio cues.",
    role: "Game Engine & Logic Developer",
    timeline: "2024",
    technologies: ["Unity", "C#", "JSON", "Audio Systems", "Animation Controller"],
    problem: "Most digital educational games are restricted to single-language tracks with hardcoded assets, making localized syllabus updates expensive and cumbersome for educators.",
    solution: "Architected a decoupled Unity game framework where gameplay logic, multilingual question pools, and audio assets are loaded dynamically via structured JSON schemas and modular state managers.",
    result: "Delivered a lightweight, highly responsive educational experience supporting on-the-fly language switching and rapid content additions without requiring game rebuilds.",
    architecture: {
      summary: "Decoupled state machine loading localized assets from structured JSON definitions.",
      nodes: [
        { label: "Game Controller", desc: "State-driven Unity engine handling user input, progression, and scoring." },
        { label: "JSON Data Driver", desc: "Modular parsers translating localized question sets into runtime game objects." },
        { label: "Audio & FX Core", desc: "Low-latency audio triggers synchronized with reward animation timelines." },
      ],
    },
    lessonsLearned: [
      "Decoupling game assets from logic code via declarative schemas is crucial for seamless multi-language expansion.",
      "Fine-tuning frame budgets on mobile builds ensures audio cues stay tightly synced with animation sequences.",
    ],
    githubUrl: "https://github.com/ajay9889-ai",
  },
  {
    id: "smart-attendance-system",
    title: "Smart Attendance System (RFID / IoT)",
    slug: "smart-attendance-system",
    tagline: "Automated attendance tracking with database integration and reports.",
    description: "Hardware-to-cloud automated attendance pipeline utilizing high-frequency RFID scanners, edge controllers, relational database logging, and automated administrative reports.",
    role: "IoT & Backend Developer",
    timeline: "2024",
    technologies: ["Python", "RFID Hardware", "MySQL", "Node.js", "REST APIs"],
    problem: "Manual roll-call and biometric fingerprint systems create long physical queues, register frequent false rejections, and demand tedious manual data entry for attendance records.",
    solution: "Built an end-to-end automated pipeline connecting edge RFID card readers to a Python processing layer that verifies card signatures and persists timestamps into MySQL with automated report generators.",
    result: "Sub-second verification latency (<400ms per scan), zero queuing bottlenecks during peak hours, and automated end-of-day Excel/CSV attendance summaries.",
    architecture: {
      summary: "Edge card scanning hardware streaming event packets to a relational storage and report server.",
      nodes: [
        { label: "RFID Scanner", desc: "Edge sensor detecting unique high-frequency card IDs on physical tap." },
        { label: "Ingestion Bridge", desc: "Python driver serializing hardware signals into secure REST payloads." },
        { label: "MySQL & Reports", desc: "Relational persistence engine with query aggregation for instant automated reports." },
      ],
    },
    lessonsLearned: [
      "Hardware signal debouncing is non-negotiable to prevent duplicate check-ins when users hover badges.",
      "Optimized SQL indexing on user timestamp lookups drastically speeds up aggregated attendance queries.",
    ],
    githubUrl: "https://github.com/ajay9889-ai",
  },
];

export const TIMELINE: ExperienceItem[] = [
  {
    id: "brikup",
    type: "experience",
    role: "Software Development Engineer Intern",
    organization: "BrikUp",
    location: "Bengaluru, India",
    period: "Internship",
    highlights: [
      "Built and optimized production features in React.js, Next.js, JavaScript, and Tailwind CSS.",
      "Integrated REST APIs for data retrieval, authentication, profiles, bookings, and reviews.",
      "Debugged API and data-rendering issues.",
      "Ran functional testing across login, onboarding, profile, booking, and review flows.",
      "Used Git/GitHub with branch-based development.",
    ],
    technologies: ["React.js", "Next.js", "JavaScript", "Tailwind CSS", "REST APIs", "Git", "GitHub"],
  },
  {
    id: "mca-bmsit",
    type: "education",
    role: "MCA",
    organization: "BMS Institute of Technology and Management",
    location: "Bangalore, India",
    period: "2023 - 2025",
    highlights: [
      "Specialized in Software Engineering, Full Stack Web Architecture, and Scalable Databases.",
      "HackVerse 2025 Hackathon Winner with ElderNest.",
    ],
  },
  {
    id: "bca-gfgc",
    type: "education",
    role: "BCA",
    organization: "Government First Grade College",
    location: "Sorab, Karnataka, India",
    period: "2020 - 2023",
    highlights: [
      "Comprehensive grounding in Computer Science, C, Java, Python, Web Basics, and Database Management.",
    ],
  },
];
