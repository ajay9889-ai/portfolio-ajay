export interface Project {
  id: string;
  title: string;
  slug: string;
  badge?: string;
  tagline: string;
  description: string;
  role: string;
  timeline: string;
  technologies: string[];
  problem: string;
  solution: string;
  result: string;
  architecture?: {
    summary: string;
    nodes: { label: string; desc: string }[];
  };
  lessonsLearned: string[];
  githubUrl?: string;
  liveUrl?: string;
  screenshots?: string[];
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface ExperienceItem {
  id: string;
  type: "experience" | "education";
  role: string;
  organization: string;
  location: string;
  period: string;
  highlights?: string[];
  technologies?: string[];
}

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  headline: string;
  subtext: string;
  about: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  message: string;
}
