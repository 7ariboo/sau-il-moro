import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { PRODUCTS } from '@/lib/data';
import { saveOrder, generateOrderId } from '@/lib/orders-db';
import { Order } from '@/lib/types';

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
    const orderItems = itemsRaw.map((item: { productId: string; quantity: number }) => {
      const p = PRODUCTS.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        name: p ? p.name : 'Prodotto Sau Il Moro',
        quantity: item.quantity,
        price: p ? p.price : 0,
        image: p ? p.images[0] : '',
      };
    });

    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = metadata.customerName || session.customer_details?.name?.split(' ')[0] || '';
    const customerSurname = metadata.customerSurname || session.customer_details?.name?.split(' ').slice(1).join(' ') || '';
    const customerPhone = metadata.customerPhone || session.customer_details?.phone || '';
    const shippingAddress = metadata.shippingAddress || session.customer_details?.address?.line1 || '';
    const shippingCity = metadata.shippingCity || session.customer_details?.address?.city || '';
    const shippingZip = metadata.shippingZip || session.customer_details?.address?.postal_code || '';
    const total = (session.amount_total || 0) / 100;
    const shippingCost = (session.total_details?.amount_shipping || 0) / 100;
    const subtotal = (session.amount_subtotal || 0) / 100;
    const discountCode = metadata.discountCode || '';
    const discountAmount = parseFloat(metadata.discountAmount || '0');

    const orderId = generateOrderId();

    // ── Save order to Firestore ──
    const newOrder: Order = {
      id: orderId,
      customer: {
        name: customerName,
        surname: customerSurname,
        email: customerEmail || '',
        phone: customerPhone,
        address: shippingAddress,
        city: shippingCity,
        zip: shippingZip,
      },
      items: orderItems,
      subtotal,
      shipping: shippingCost,
      discountTotal: discountAmount,
      discountCode: discountCode || undefined,
      total,
      status: 'confirmed',
      fulfillmentStatus: 'unfulfilled',
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      createdAt: new Date(session.created * 1000).toISOString(),
    };

    try {
      await saveOrder(newOrder);
      console.log(`[STRIPE WEBHOOK] Order ${orderId} saved to Firestore. Total: €${total}`);
    } catch (dbErr: any) {
      console.error(`[STRIPE WEBHOOK] Failed to save order to Firestore:`, dbErr.message);
    }

    // ── Send confirmation email ──
    const fullAddress = `${shippingAddress}, ${shippingZip} ${shippingCity}`.trim();
    const fullName = `${customerName} ${customerSurname}`.trim() || 'Cliente';

    if (customerEmail) {
      await sendOrderConfirmationEmail(customerEmail, {
        id: orderId,
        customerName: fullName,
        items: orderItems.map((i: { name: string; quantity: number; price: number }) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        total,
        shippingAddress: fullAddress,
      });
    }
  }

  return NextResponse.json({ received: true });
}
