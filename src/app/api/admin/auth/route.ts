import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, generateToken, isValidToken, SESSION_COOKIE } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password || !checkPassword(password)) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }
    const token = generateToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = token ? isValidToken(token) : false;
  return NextResponse.json({ authenticated });
}
