/**
 * siteActions.ts
 * Client-side whitelist of tool actions the backend can request.
 * The backend emits `{ type: 'action', name: string, args: object }` SSE events.
 * This module validates the name and executes only known, safe DOM operations.
 * NEVER eval() anything from the model.
 */

export type ActionName =
  | 'scroll_to'
  | 'open_project'
  | 'show_resume'
  | 'open_contact_form'
  | 'change_theme'
  | 'show_skills'
  | 'send_message_to_ajay'
  | 'request_contact_message'
  | 'request_contact_details';

export interface ActionEvent {
  name: ActionName;
  args?: Record<string, unknown>;
}

/** Map section IDs used in the portfolio HTML */
const SECTION_ID_MAP: Record<string, string> = {
  hero: 'hero',
  about: 'about',
  skills: 'skills',
  work: 'work',
  projects: 'work',
  experience: 'experience',
  contact: 'contact',
  'live-projects': 'live-projects',
  'live projects': 'live-projects',
  'live': 'live-projects',
  'live demo': 'live-projects',
  'live demos': 'live-projects',
  'deployments': 'live-projects',
  eldernest: 'work',
  wisdomplay: 'work',
  'smart attendance': 'work',
  attendance: 'work',
};

/** Smooth-scroll to a named section */
function scrollTo(section: string): boolean {
  const key = (section ?? '').toLowerCase().trim();
  const id = SECTION_ID_MAP[key] ?? key;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Brief highlight ring
    el.style.transition = 'outline 0s, outline-offset 0s';
    el.style.outline = '2px solid var(--color-accent)';
    el.style.outlineOffset = '4px';
    setTimeout(() => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    }, 1800);
    return true;
  }
  return false;
}

/** Open the contact section */
function openContactForm(): boolean {
  return scrollTo('contact');
}

/** Scroll to work section and (optionally) attempt to highlight a project card */
function openProject(name: string): boolean {
  scrollTo('work');
  // Try to find a card by data-project attribute or aria-label containing the name
  const normalized = (name ?? '').toLowerCase().replace(/\s+/g, '');
  setTimeout(() => {
    const candidates = document.querySelectorAll('[data-project], article, section');
    for (const el of Array.from(candidates)) {
      const label =
        (el.getAttribute('data-project') ?? el.textContent ?? '').toLowerCase().replace(/\s+/g, '');
      if (label.includes(normalized)) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).style.transition = 'box-shadow 0.3s';
        (el as HTMLElement).style.boxShadow = '0 0 0 2px var(--color-accent)';
        setTimeout(() => ((el as HTMLElement).style.boxShadow = ''), 2000);
        break;
      }
    }
  }, 600);
  return true;
}

/** Change the page colour theme */
function changeTheme(mode: string): boolean {
  const target = (mode ?? '').toLowerCase();
  if (target === 'dark' || target === 'light') {
    document.documentElement.setAttribute('data-theme', target);
    try { localStorage.setItem('theme', target); } catch {}
    return true;
  }
  return false;
}

/** Show resume — opens contact section with a note (no direct PDF URL to expose) */
function showResume(): boolean {
  scrollTo('contact');
  return true;
}

/** Scroll to skills section, optionally with a filter hint (cosmetic) */
function showSkills(_filter?: string): boolean {
  return scrollTo('skills');
}

/**
 * Execute a whitelisted action received from the backend SSE stream.
 * Returns `true` if the action was handled, `false` if unknown / failed.
 */
export function executeSiteAction(event: ActionEvent): boolean {
  const { name, args = {} } = event;

  switch (name) {
    case 'scroll_to':
      return scrollTo(String(args.section ?? args.id ?? ''));
    case 'open_project':
      return openProject(String(args.name ?? args.project ?? ''));
    case 'show_resume':
      return showResume();
    case 'open_contact_form':
      return openContactForm();
    case 'change_theme':
      return changeTheme(String(args.mode ?? args.theme ?? ''));
    case 'show_skills':
      return showSkills(args.filter ? String(args.filter) : undefined);
    case 'send_message_to_ajay':
    case 'request_contact_message':
    case 'request_contact_details':
      // This is handled by the assistant hook / LeadForm
      return true;
    default:
      console.warn('[SiteActions] Unknown action:', name);
      return false;
  }
}

/** Type guard for action events from SSE */
export function isActionEvent(obj: unknown): obj is ActionEvent {
  if (typeof obj !== 'object' || obj === null) return false;
  const a = obj as Record<string, unknown>;
  return typeof a.name === 'string';
}
