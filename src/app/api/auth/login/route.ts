import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e password sono obbligatori' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: email === 'admin@sauilmoro.it' ? 'admin-1' : `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        surname: 'Sardo',
        phone: '',
        role: email === 'admin@sauilmoro.it' ? 'admin' : 'customer',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Errore del server' },
      { status: 500 }
    );
  }
}
