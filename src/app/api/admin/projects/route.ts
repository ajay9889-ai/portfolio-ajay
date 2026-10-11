import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getProjects, addProject, updateProject, deleteProject, saveProjects } from '@/lib/adminData';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  return NextResponse.json({ success: true, data: getProjects() });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const body = await req.json();
  const entry = addProject(body);
  return NextResponse.json({ success: true, data: entry }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const { id, updates } = await req.json();
  updateProject(id, updates);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const { id } = await req.json();
  deleteProject(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const { entries } = await req.json();
  saveProjects(entries);
  return NextResponse.json({ success: true });
}
