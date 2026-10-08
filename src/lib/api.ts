import { ProfileData, Project, SkillGroup, ExperienceItem } from "@/types";
import { PROFILE, PROJECTS, SKILL_GROUPS, TIMELINE } from "@/data/portfolioData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-t782.onrender.com/api/v1";

export async function fetchProfile(): Promise<ProfileData> {
  try {
    const res = await fetch(`${API_BASE}/profile`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    return json.data || PROFILE;
  } catch {
    return PROFILE;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    return json.data || PROJECTS;
  } catch {
    return PROJECTS;
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_BASE}/projects/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    return json.data || PROJECTS.find((p) => p.slug === slug) || null;
  } catch {
    return PROJECTS.find((p) => p.slug === slug) || null;
  }
}

export async function fetchSkills(): Promise<SkillGroup[]> {
  try {
    const res = await fetch(`${API_BASE}/skills`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    return json.data || SKILL_GROUPS;
  } catch {
    return SKILL_GROUPS;
  }
}

export async function fetchExperiences(): Promise<ExperienceItem[]> {
  try {
    const res = await fetch(`${API_BASE}/experience`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    return json.data || TIMELINE;
  } catch {
    return TIMELINE;
  }
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.error || "Failed to send message. Please try again." };
    }
    return { success: true, message: json.message || "Message sent successfully!" };
  } catch {
    return {
      success: false,
      message: "Backend server is currently unreachable. Please email me directly at " + PROFILE.email,
    };
  }
}
