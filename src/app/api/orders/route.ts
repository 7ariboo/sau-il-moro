import { NextResponse } from 'next/server';
import { orders, generateOrderId, PRODUCTS } from '@/lib/data';
import { Order } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Carrello vuoto' }, { status: 400 });
    }

    // Map items and calculate subtotal
    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (!product) throw new Error(`Prodotto ${item.productId} non trovato`);
      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.images[0],
      };
    });

    const subtotal = orderItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= 150 ? 0 : 15;
    const total = subtotal + shipping;

    const newOrder: Order = {
      id: generateOrderId(),
      customer: {
        ...customer,
        address: body.shipping.address,
        city: body.shipping.city,
        zip: body.shipping.zip,
      },
      items: orderItems,
      subtotal,
      shipping,
      total,
      status: 'pending',
      fulfillmentStatus: 'unfulfilled',
      paymentStatus: 'paid', // Simulate successful payment
      paymentMethod: paymentMethod || 'stripe',
      discountTotal: body.discountTotal || 0,
      discountCode: body.discountCode || undefined,
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Order Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Errore nella creazione dell\'ordine' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Ordine non trovato' }, { status: 404 });
    }

    orders[orderIndex].status = status;

    return NextResponse.json({ success: true, data: orders[orderIndex] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Errore nell\'aggiornamento dell\'ordine' }, { status: 500 });
  }
}
