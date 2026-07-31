import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Batch sending mode
    if (body.batch && Array.isArray(body.users)) {
      const results = [];
      for (const u of body.users) {
        if (u.email) {
          const res = await sendWelcomeEmail(u.email, u.name || 'Cliente');
          results.push({ email: u.email, status: res.success ? 'sent' : 'error' });
        }
      }
      return NextResponse.json({ success: true, count: results.length, results });
    }

    // Single send mode
    const { email, name } = body;
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
