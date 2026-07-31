import { NextResponse } from 'next/server';
import { users, sanitizeUser } from '@/lib/auth';

export async function GET() {
  const safeUsers = users.map(u => sanitizeUser(u));
  return NextResponse.json({ success: true, data: safeUsers });
}
