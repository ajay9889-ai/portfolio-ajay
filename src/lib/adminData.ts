import fs from 'fs';
import path from 'path';

import os from 'os';

import defaultContacts from '@/data/admin/contacts.json';
import defaultExperience from '@/data/admin/experience.json';
import defaultProfile from '@/data/admin/profile.json';
import defaultProjects from '@/data/admin/projects.json';

const BUNDLED_DIR = path.join(process.cwd(), 'src/data/admin');
const TMP_DIR = path.join(os.tmpdir(), 'portfolio-admin');

// Ensure tmp directory exists
try {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }
} catch {
  // non-blocking
}

const DEFAULT_MAP: Record<string, unknown> = {
  'contacts.json': defaultContacts,
  'experience.json': defaultExperience,
  'profile.json': defaultProfile,
  'projects.json': defaultProjects,
};

function readJson<T>(filename: string): T {
  // 1. Try reading from serverless TMP_DIR (if modified during lambda session)
  try {
    const tmpPath = path.join(TMP_DIR, filename);
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf-8');
      return JSON.parse(raw) as T;
    }
  } catch {
    // non-blocking fallback
  }

  // 2. Try reading from project filesystem (local dev)
  try {
    const bundledPath = path.join(BUNDLED_DIR, filename);
    if (fs.existsSync(bundledPath)) {
      const raw = fs.readFileSync(bundledPath, 'utf-8');
      return JSON.parse(raw) as T;
    }
  } catch {
    // non-blocking fallback
  }

  // 3. Fallback to bundled compiled in-memory JSON (100% crash-proof on Vercel)
  if (filename in DEFAULT_MAP) {
    return JSON.parse(JSON.stringify(DEFAULT_MAP[filename])) as T;
  }

  return {} as T;
}

function writeJson(filename: string, data: unknown): void {
  const content = JSON.stringify(data, null, 2);

  // 1. Always attempt write to TMP_DIR
  try {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true });
    }
    const tmpPath = path.join(TMP_DIR, filename);
    fs.writeFileSync(tmpPath, content, 'utf-8');
  } catch (err) {
    console.warn('[adminData] Failed to write to TMP_DIR:', err);
  }

  // 2. In local dev, also write to bundled project path so git tracks edits
  const isServerless = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  if (!isServerless) {
    try {
      const bundledPath = path.join(BUNDLED_DIR, filename);
      fs.writeFileSync(bundledPath, content, 'utf-8');
    } catch {
      // non-blocking
    }
  }
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
