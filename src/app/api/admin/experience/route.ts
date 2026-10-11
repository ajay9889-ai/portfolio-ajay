import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getExperience, addExperience, updateExperience, deleteExperience, saveExperience } from '@/lib/adminData';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  return NextResponse.json({ success: true, data: getExperience() });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const body = await req.json();
  const entry = addExperience(body);
  return NextResponse.json({ success: true, data: entry }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const { id, updates } = await req.json();
  updateExperience(id, updates);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const { id } = await req.json();
  deleteExperience(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  // Reorder: save entire sorted list
  if (!isAdminRequest(req)) return unauthorized();
  const { entries } = await req.json();
  saveExperience(entries);
  return NextResponse.json({ success: true });
}
