import { Resend } from 'resend';
import {
  getWelcomeEmailHtml,
  getOrderConfirmationEmailHtml,
  getOrderProcessingEmailHtml,
  getOrderShippedEmailHtml,
} from './email-templates';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.SENDER_EMAIL || 'ordini@sauilmoro.com';

export async function sendWelcomeEmail(toEmail: string, name?: string) {
  if (!resend) {
    console.log(`[EMAIL SIMULATED] Welcome email to ${toEmail}`);
    return { success: true, simulated: true };
  }
  try {
    const data = await resend.emails.send({
      from: `Sau Il Moro <${fromEmail}>`,
      to: toEmail,
      subject: 'Benvenuto in Sau Il Moro — Artigianato Sardo d\'Eccellenza',
      html: getWelcomeEmailHtml(name),
    });
    console.log(`[EMAIL SENT] Welcome email to ${toEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(
  toEmail: string,
  order: {
    id: string;
    customerName: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    shippingAddress: string;
    billingInfo?: string;
  }
) {
  if (!resend) {
    console.log(`[EMAIL SIMULATED] Order Confirmation #${order.id} to ${toEmail}`);
    return { success: true, simulated: true };
  }
  try {
    const data = await resend.emails.send({
      from: `Sau Il Moro <${fromEmail}>`,
      to: toEmail,
      subject: `Conferma d'Acquisto Ordine #${order.id} — Sau Il Moro`,
      html: getOrderConfirmationEmailHtml(order),
    });
    console.log(`[EMAIL SENT] Order Confirmation #${order.id} to ${toEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendOrderProcessingEmail(
  toEmail: string,
  orderId: string,
  customerName: string
) {
  if (!resend) {
    console.log(`[EMAIL SIMULATED] Order Processing #${orderId} to ${toEmail}`);
    return { success: true, simulated: true };
  }
  try {
    const data = await resend.emails.send({
      from: `Sau Il Moro <${fromEmail}>`,
      to: toEmail,
      subject: `Ordine #${orderId} in Lavorazione — Sau Il Moro`,
      html: getOrderProcessingEmailHtml(orderId, customerName),
    });
    console.log(`[EMAIL SENT] Order Processing #${orderId} to ${toEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending order processing email:', error);
    return { success: false, error };
  }
}

export async function sendOrderShippedEmail(
  toEmail: string,
  orderId: string,
  customerName: string,
  trackingNumber?: string,
  carrier?: string
) {
  if (!resend) {
    console.log(`[EMAIL SIMULATED] Order Shipped #${orderId} to ${toEmail}`);
    return { success: true, simulated: true };
  }
  try {
    const data = await resend.emails.send({
      from: `Sau Il Moro <${fromEmail}>`,
      to: toEmail,
      subject: `Ordine #${orderId} Spedito — Sau Il Moro`,
      html: getOrderShippedEmailHtml(orderId, customerName, trackingNumber, carrier),
    });
    console.log(`[EMAIL SENT] Order Shipped #${orderId} to ${toEmail}`, data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending order shipped email:', error);
    return { success: false, error };
  }
}

export async function sendOrderStatusEmail(
  toEmail: string,
  orderId: string,
  customerName: string,
  status: string
) {
  if (status === 'processing' || status === 'lavorazione') {
    return sendOrderProcessingEmail(toEmail, orderId, customerName);
  }
  if (status === 'shipped' || status === 'spedito') {
    return sendOrderShippedEmail(toEmail, orderId, customerName);
  }

  if (!resend) {
    console.log(`[EMAIL SIMULATED] Order status update #${orderId} (${status}) to ${toEmail}`);
    return { success: true, simulated: true };
  }
  try {
    const data = await resend.emails.send({
      from: `Sau Il Moro <${fromEmail}>`,
      to: toEmail,
      subject: `Aggiornamento Ordine #${orderId} — Sau Il Moro`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Ciao ${customerName},</h2>
          <p>Lo stato del tuo ordine <strong>#${orderId}</strong> è stato aggiornato a: <strong>${status}</strong>.</p>
          <p>Grazie per aver scelto Sau Il Moro.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending order status email:', error);
    return { success: false, error };
  }
}
