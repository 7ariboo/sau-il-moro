import { NextResponse } from 'next/server';
import { sendOrderProcessingEmail, sendOrderShippedEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, orderId, customerName, status, trackingNumber, carrier } = body;

    if (!email || !orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Email, orderId e status sono obbligatori' },
        { status: 400 }
      );
    }

    if (status === 'processing' || status === 'lavorazione') {
      await sendOrderProcessingEmail(email, orderId, customerName || 'Cliente');
    } else if (status === 'shipped' || status === 'spedito') {
      await sendOrderShippedEmail(email, orderId, customerName || 'Cliente', trackingNumber, carrier);
    }

    return NextResponse.json({
      success: true,
      message: `Notifica email per stato '${status}' inviata a ${email}`,
    });
  } catch (error: any) {
    console.error('Error triggering order status email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Errore durante l\'invio della notifica' },
      { status: 500 }
    );
  }
}
