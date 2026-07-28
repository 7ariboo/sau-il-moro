import { Resend } from 'resend';
import {
  getWelcomeEmailHtml,
  getOrderConfirmationEmailHtml,
  getOrderStatusUpdateEmailHtml,
} from './email-templates';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.SENDER_EMAIL || 'ordini@sauilmoro.it';

export async function sendWelcomeEmail(toEmail: string, name: string) {
  if (!resend) {
    console.log(`[EMAIL SIMULATED] Welcome email to ${toEmail}`);
    return;
  }
  try {
    await resend.emails.send({
      from: `Sau Il Moro <${fromEmail}>`,
      to: toEmail,
      subject: 'Benvenuto su Sau Il Moro - Artigianato Sardo',
      html: getWelcomeEmailHtml(name),
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
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
  }
) {
  if (!resend) {
    console.log(`[EMAIL SIMULATED] Order Confirmation #${order.id} to ${toEmail}`);
    return;
  }
  try {
    await resend.emails.send({
      from: `Sau Il Moro <${fromEmail}>`,
      to: toEmail,
      subject: `Conferma Ordine #${order.id} - Sau Il Moro`,
      html: getOrderConfirmationEmailHtml(order),
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
}

export async function sendOrderStatusEmail(
  toEmail: string,
  orderId: string,
  customerName: string,
  status: string
) {
  if (!resend) {
    console.log(`[EMAIL SIMULATED] Order status update #${orderId} (${status}) to ${toEmail}`);
    return;
  }
  try {
    await resend.emails.send({
      from: `Sau Il Moro <${fromEmail}>`,
      to: toEmail,
      subject: `Aggiornamento Ordine #${orderId} - Sau Il Moro`,
      html: getOrderStatusUpdateEmailHtml(orderId, customerName, status),
    });
  } catch (error) {
    console.error('Error sending order status email:', error);
  }
}
