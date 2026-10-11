import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data/admin');

function readJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function writeJson(filename: string, data: unknown): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export interface ContactEntry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  receivedAt: string;
  read: boolean;
}

export function getContacts(): ContactEntry[] {
  const data = readJson<{ messages: ContactEntry[] }>('contacts.json');
  return data.messages;
}

export function addContact(entry: Omit<ContactEntry, 'id' | 'read' | 'receivedAt'>): ContactEntry {
  const data = readJson<{ messages: ContactEntry[] }>('contacts.json');
  const newEntry: ContactEntry = {
    ...entry,
    id: 'msg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    read: false,
    receivedAt: new Date().toISOString(),
  };
  data.messages.unshift(newEntry); // newest first
  writeJson('contacts.json', data);
  return newEntry;
}

export function markContactRead(id: string, read: boolean): void {
  const data = readJson<{ messages: ContactEntry[] }>('contacts.json');
  const idx = data.messages.findIndex((m) => m.id === id);
  if (idx !== -1) data.messages[idx].read = read;
  writeJson('contacts.json', data);
}

export function deleteContact(id: string): void {
  const data = readJson<{ messages: ContactEntry[] }>('contacts.json');
  data.messages = data.messages.filter((m) => m.id !== id);
  writeJson('contacts.json', data);
}

// ─── Experience ───────────────────────────────────────────────────────────────

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  highlights: string[];
  technologies: string[];
  order: number;
}

export function getExperience(): ExperienceEntry[] {
  const data = readJson<{ experience: ExperienceEntry[] }>('experience.json');
  return data.experience.sort((a, b) => a.order - b.order);
}

export function saveExperience(entries: ExperienceEntry[]): void {
  writeJson('experience.json', { experience: entries });
}

export function addExperience(entry: Omit<ExperienceEntry, 'id' | 'order'>): ExperienceEntry {
  const data = readJson<{ experience: ExperienceEntry[] }>('experience.json');
  const newEntry: ExperienceEntry = {
    ...entry,
    id: 'exp_' + Date.now().toString(36),
    order: data.experience.length,
  };
  data.experience.push(newEntry);
  writeJson('experience.json', data);
  return newEntry;
}

export function updateExperience(id: string, updates: Partial<ExperienceEntry>): void {
  const data = readJson<{ experience: ExperienceEntry[] }>('experience.json');
  const idx = data.experience.findIndex((e) => e.id === id);
  if (idx !== -1) data.experience[idx] = { ...data.experience[idx], ...updates };
  writeJson('experience.json', data);
}

export function deleteExperience(id: string): void {
  const data = readJson<{ experience: ExperienceEntry[] }>('experience.json');
  data.experience = data.experience.filter((e) => e.id !== id);
  writeJson('experience.json', data);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectEntry {
  id: string;
  title: string;
  slug: string;
  badge: string;
  tagline: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  metrics: { label: string; value: string }[];
  githubUrl: string;
  liveUrl: string;
  order: number;
}

export function getProjects(): ProjectEntry[] {
  const data = readJson<{ projects: ProjectEntry[] }>('projects.json');
  return data.projects.sort((a, b) => a.order - b.order);
}

export function saveProjects(entries: ProjectEntry[]): void {
  writeJson('projects.json', { projects: entries });
}

export function addProject(entry: Omit<ProjectEntry, 'id' | 'order'>): ProjectEntry {
  const data = readJson<{ projects: ProjectEntry[] }>('projects.json');
  const newEntry: ProjectEntry = {
    ...entry,
    id: 'proj_' + Date.now().toString(36),
    order: data.projects.length,
  };
  data.projects.push(newEntry);
  writeJson('projects.json', data);
  return newEntry;
}

export function updateProject(id: string, updates: Partial<ProjectEntry>): void {
  const data = readJson<{ projects: ProjectEntry[] }>('projects.json');
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx !== -1) data.projects[idx] = { ...data.projects[idx], ...updates };
  writeJson('projects.json', data);
}

export function deleteProject(id: string): void {
  const data = readJson<{ projects: ProjectEntry[] }>('projects.json');
  data.projects = data.projects.filter((p) => p.id !== id);
  writeJson('projects.json', data);
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  availability: string;
  email: string;
  github: string;
  linkedin: string;
  stats: { label: string; value: string }[];
}

export function getProfile(): ProfileData {
  const data = readJson<{ profile: ProfileData }>('profile.json');
  return data.profile;
}

export function saveProfile(profile: ProfileData): void {
  writeJson('profile.json', { profile });
}
