import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/data';
import { Order } from '@/lib/types';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '@/lib/email';
import { getAllOrders, saveOrder, updateOrderStatus, generateOrderId } from '@/lib/orders-db';

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('Orders GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
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
        address: body.shipping?.address || '',
        city: body.shipping?.city || '',
        zip: body.shipping?.zip || '',
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

    // Save to Firestore
    await saveOrder(newOrder);

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

    const updatedOrder = await updateOrderStatus(id, status);
    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: 'Ordine non trovato' }, { status: 404 });
    }

    // Send order status update email
    if (updatedOrder.customer?.email) {
      const customerName = `${updatedOrder.customer.name || ''} ${updatedOrder.customer.surname || ''}`.trim() || 'Cliente';
      sendOrderStatusEmail(updatedOrder.customer.email, updatedOrder.id, customerName, status);
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Errore nell\'aggiornamento dell\'ordine' }, { status: 500 });
  }
}
