import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getContacts, markContactRead, deleteContact } from '@/lib/adminData';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const contacts = getContacts();
  return NextResponse.json({ success: true, data: contacts, count: contacts.length });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const { id, read } = await req.json();
  markContactRead(id, read);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const { id } = await req.json();
  deleteContact(id);
  return NextResponse.json({ success: true });
}
