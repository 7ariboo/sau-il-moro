export function getWelcomeEmailHtml(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f2; color: #0A0A0A; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e8e6e1; border-radius: 8px; overflow: hidden; }
          .header { background-color: #b34624; padding: 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
          .content { padding: 30px; line-height: 1.6; color: #333333; }
          .button { display: inline-block; background-color: #b34624; color: #ffffff !important; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-top: 20px; }
          .footer { background-color: #e8e6e1; padding: 20px; text-align: center; font-size: 12px; color: #777777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sau Il Moro</h1>
          </div>
          <div class="content">
            <h2>Benvenuto in Sau Il Moro, ${userName}!</h2>
            <p>Grazie per esserti registrato sul nostro store artigianale.</p>
            <p>La Sardegna non si racconta. Si porta con sé. Ogni nostro pezzo racchiude tradizione, carattere e il sapere di una terra antica.</p>
            <p>Esplora le nostre collezioni di coltelli, legno, ceramica e salumi tradizionali.</p>
            <a href="https://sauilmoro.it" class="button">Visita lo Store</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Sau Il Moro — Artigianato Sardo d'Eccellenza</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getOrderConfirmationEmailHtml(order: {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  shippingAddress: string;
}) {
  const itemsHtml = order.items
    .map(
      item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${item.name} x ${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">${(item.price * item.quantity).toFixed(2)} €</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f2; color: #0A0A0A; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e8e6e1; border-radius: 8px; overflow: hidden; }
          .header { background-color: #b34624; padding: 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
          .content { padding: 30px; line-height: 1.6; color: #333333; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .total { font-weight: bold; font-size: 18px; color: #b34624; }
          .footer { background-color: #e8e6e1; padding: 20px; text-align: center; font-size: 12px; color: #777777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Conferma Ordine #${order.id}</h1>
          </div>
          <div class="content">
            <h2>Grazie per il tuo ordine, ${order.customerName}!</h2>
            <p>Abbiamo ricevuto il tuo ordine e stiamo preparando i tuoi pezzi artigianali con la massima cura.</p>

            <h3>Riepilogo Ordine:</h3>
            <table class="table">
              <thead>
                <tr style="background: #f8f8f8; text-align: left;">
                  <th style="padding: 10px; border-bottom: 2px solid #ddd;">Prodotto</th>
                  <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Prezzo</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <p style="text-align: right; margin-top: 20px;" class="total">
              Totale Ordine: ${order.total.toFixed(2)} €
            </p>

            <h3 style="margin-top: 30px;">Indirizzo di Spedizione:</h3>
            <p>${order.shippingAddress}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Sau Il Moro — Artigianato Sardo d'Eccellenza</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getOrderStatusUpdateEmailHtml(orderId: string, customerName: string, newStatus: string) {
  const statusMessages: Record<string, string> = {
    processing: 'Il tuo ordine è attualmente in lavorazione nel nostro laboratorio.',
    shipped: 'Il tuo ordine è stato spedito! Presto riceverai i tuoi prodotti sardi.',
    delivered: 'Il tuo ordine è stato consegnato. Speriamo che i nostri prodotti ti piacciano!',
    cancelled: 'Il tuo ordine è stato annullato. Se hai domande, contattaci.',
  };

  const message = statusMessages[newStatus] || `Lo stato del tuo ordine è cambiato in: ${newStatus}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f2; color: #0A0A0A; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e8e6e1; border-radius: 8px; overflow: hidden; }
          .header { background-color: #b34624; padding: 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
          .content { padding: 30px; line-height: 1.6; color: #333333; }
          .footer { background-color: #e8e6e1; padding: 20px; text-align: center; font-size: 12px; color: #777777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Aggiornamento Ordine #${orderId}</h1>
          </div>
          <div class="content">
            <h2>Ciao ${customerName},</h2>
            <p>${message}</p>
            <p>Grazie per aver scelto Sau Il Moro!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Sau Il Moro — Artigianato Sardo d'Eccellenza</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
