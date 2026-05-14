import { NextResponse } from 'next/server';
import { findUserByEmail, createUser, sanitizeUser } from '@/lib/auth';

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

    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Esiste già un account con questa email' },
        { status: 409 }
      );
    }

    const user = createUser({ email, password, name, surname, phone });

    return NextResponse.json({
      success: true,
      data: sanitizeUser(user),
      message: 'Account creato con successo',
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Errore del server' },
      { status: 500 }
    );
  }
}
