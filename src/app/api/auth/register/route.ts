import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, surname, phone } = body;

    if (!email || !password || !name || !surname) {
      return NextResponse.json(
        { success: false, error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La password deve essere di almeno 6 caratteri' },
        { status: 400 }
      );
    }

    // Trigger welcome email
    await sendWelcomeEmail(email, name);

    return NextResponse.json({
      success: true,
      data: {
        id: `user-${Date.now()}`,
        email,
        name,
        surname,
        phone: phone || '',
        role: 'customer',
      },
      message: 'Account creato con successo',
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Errore del server' },
      { status: 500 }
    );
  }
}
