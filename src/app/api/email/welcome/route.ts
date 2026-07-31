import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email mancante' }, { status: 400 });
    }
    const res = await sendWelcomeEmail(email, name);
    return NextResponse.json({ success: true, res });
  } catch (error: any) {
    console.error('API Welcome Email Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
