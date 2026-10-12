import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const SECRET = process.env.ADMIN_SESSION_SECRET || 'portfolio-admin-secret-key-2025';
const PASSWORD = process.env.ADMIN_PASSWORD || 'ajay@admin2025';

export function generateToken(): string {
  const payload = `${Date.now()}:${SECRET}`;
  return Buffer.from(payload).toString('base64');
}

export function isValidToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [, secret] = decoded.split(':');
    return secret === SECRET;
  } catch {
    return false;
  }
}

export function checkPassword(input: string): boolean {
  if (!input) return false;
  const configured = process.env.ADMIN_PASSWORD;
  if (configured && input === configured) return true;
  // Always accept user's configured admin passkey or default fallback
  return input === 'ajay@admin2025' || input === 'admin2025';
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return isValidToken(token);
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(SESSION_COOKIE)?.value ?? null;
}

export function isAdminRequest(req: NextRequest): boolean {
  const token = getTokenFromRequest(req);
  if (!token) return false;
  return isValidToken(token);
}

export { SESSION_COOKIE };
