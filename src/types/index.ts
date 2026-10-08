export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: "Full Stack" | "AI & ML" | "Systems & Cloud" | "Frontend";
  technologies: string[];
  featured: boolean;
  metrics?: { label: string; value: string }[];
  githubUrl?: string;
  liveUrl?: string;
  coverImage?: string;
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level: number; icon: string; highlight?: boolean }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: "Full-time" | "Contract" | "Open Source" | "Freelance";
  description: string[];
  skills: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  availability: string;
  email: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  stats: { label: string; value: string }[];
}

export interface ContactSubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
}
