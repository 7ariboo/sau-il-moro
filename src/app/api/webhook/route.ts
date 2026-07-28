import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { PRODUCTS } from '@/lib/data';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const metadata = session.metadata || {};

    const itemsRaw = metadata.itemsJson ? JSON.parse(metadata.itemsJson) : [];
    const items = itemsRaw.map((item: { productId: string; quantity: number }) => {
      const p = PRODUCTS.find(prod => prod.id === item.productId);
      return {
        name: p ? p.name : 'Prodotto Sau Il Moro',
        quantity: item.quantity,
        price: p ? p.price : 0,
      };
    });

    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = `${metadata.customerName || ''} ${metadata.customerSurname || ''}`.trim() || 'Cliente';
    const shippingAddress = `${metadata.shippingAddress || ''}, ${metadata.shippingZip || ''} ${metadata.shippingCity || ''}`.trim();
    const total = (session.amount_total || 0) / 100;

    console.log(`[STRIPE WEBHOOK] Payment completed for session ${session.id}, Total: €${total}`);

    // Send confirmation email via Resend
    if (customerEmail) {
      await sendOrderConfirmationEmail(customerEmail, {
        id: session.id.slice(-8).toUpperCase(),
        customerName,
        items,
        total,
        shippingAddress,
      });
    }
  }

  return NextResponse.json({ received: true });
}
