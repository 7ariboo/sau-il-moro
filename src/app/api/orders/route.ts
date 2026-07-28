import { NextResponse } from 'next/server';
import { orders, generateOrderId, PRODUCTS } from '@/lib/data';
import { Order } from '@/lib/types';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '@/lib/email';

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

    const orderId = generateOrderId();

    const newOrder: Order = {
      id: orderId,
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
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'stripe',
      discountTotal: body.discountTotal || 0,
      discountCode: body.discountCode || undefined,
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);

    // Send confirmation email
    if (customer?.email) {
      const customerFullName = `${customer.name || ''} ${customer.surname || ''}`.trim() || 'Cliente';
      const fullAddress = `${body.shipping?.address || ''}, ${body.shipping?.zip || ''} ${body.shipping?.city || ''}`;
      sendOrderConfirmationEmail(customer.email, {
        id: orderId,
        customerName: customerFullName,
        items: orderItems.map((i: { name: string; quantity: number; price: number }) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total,
        shippingAddress: fullAddress,
      });
    }

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
    const targetOrder = orders[orderIndex];

    // Send order status update email
    if (targetOrder.customer?.email) {
      const customerName = `${targetOrder.customer.name || ''} ${targetOrder.customer.surname || ''}`.trim() || 'Cliente';
      sendOrderStatusEmail(targetOrder.customer.email, targetOrder.id, customerName, status);
    }

    return NextResponse.json({ success: true, data: targetOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Errore nell\'aggiornamento dell\'ordine' }, { status: 500 });
  }
}
