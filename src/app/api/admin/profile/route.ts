import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getProfile, saveProfile } from '@/lib/adminData';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  return NextResponse.json({ success: true, data: getProfile() });
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const profile = await req.json();
  saveProfile(profile);
  return NextResponse.json({ success: true });
}
