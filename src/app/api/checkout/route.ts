import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PRODUCTS } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, shipping } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Il carrello è vuoto' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sauilmoro.com';

    // Map items to Stripe line_items format
    const lineItems = items.map((item: { productId: string; quantity: number }) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (!product) {
        throw new Error(`Prodotto ${item.productId} non trovato`);
      }
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            description: product.shortDescription,
            images: product.images.map(img => img.startsWith('http') ? img : `${appUrl}${img}`),
          },
          unit_amount: Math.round(product.price * 100), // in cents
        },
        quantity: item.quantity,
      };
    });

    // Calculate subtotal for shipping policy (Free shipping over €150)
    const subtotal = items.reduce((acc: number, item: { productId: string; quantity: number }) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);

    const shippingOptions = [
      {
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: {
            amount: subtotal >= 150 ? 0 : 1500, // €15 or €0 in cents
            currency: 'eur',
          },
          display_name: subtotal >= 150 ? 'Spedizione Gratuita' : 'Spedizione Standard',
          delivery_estimate: {
            minimum: { unit: 'business_day' as const, value: 2 },
            maximum: { unit: 'business_day' as const, value: 4 },
          },
        },
      },
    ];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer?.email,
      shipping_options: shippingOptions,
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      metadata: {
        customerName: customer?.name || '',
        customerSurname: customer?.surname || '',
        customerPhone: customer?.phone || '',
        shippingAddress: shipping?.address || '',
        shippingCity: shipping?.city || '',
        shippingZip: shipping?.zip || '',
        itemsJson: JSON.stringify(items),
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Errore durante la creazione della sessione di pagamento' },
      { status: 500 }
    );
  }
}
