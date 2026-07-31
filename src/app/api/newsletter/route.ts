import { NextResponse } from 'next/server';
import { newsletterSubscribers } from '@/lib/data';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET() {
  return NextResponse.json({ success: true, data: newsletterSubscribers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Email non valida' },
        { status: 400 }
      );
    }

    const exists = newsletterSubscribers.find(s => s.email === email);
    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Email già iscritta alla newsletter' },
        { status: 409 }
      );
    }

    newsletterSubscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    });

    // Send welcome email immediately
    await sendWelcomeEmail(email);

    return NextResponse.json({
      success: true,
      message: 'Iscrizione completata! Ti abbiamo inviato un\'email di benvenuto.',
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Errore nell\'iscrizione' },
      { status: 500 }
    );
  }
}
