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

export interface LiveProject {
  id: string;
  title: string;
  slug: string;
  badge?: string;
  category: string;
  tagline: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  displayUrl?: string;
  accentColor?: string;
  gradient: string;
  status: 'live' | 'active' | 'deploying';
  featuredMetric?: { label: string; value: string };
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
  aboutSupport?: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl?: string;
  instagramHandle?: string;
  instagramQrCode?: string;
}

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  message: string;
}
