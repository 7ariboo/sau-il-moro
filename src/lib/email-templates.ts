export function getWelcomeEmailHtml(userName: string = 'Appassionato dell\'Artigianato') {
  return `
    <!DOCTYPE html>
    <html lang="it">
      <head>
        <meta charset="utf-8" />
        <title>Benvenuto in Sau Il Moro</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f2; color: #0A0A0A; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e8e6e1; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background-color: #b34624; padding: 36px 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; }
          .sub-header { font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px; opacity: 0.9; }
          .content { padding: 36px 30px; line-height: 1.7; color: #222222; }
          .highlight-box { background-color: #f8f7f5; border-left: 4px solid #b34624; padding: 20px; margin: 24px 0; font-style: italic; font-size: 15px; color: #444; }
          .button { display: inline-block; background-color: #b34624; color: #ffffff !important; padding: 15px 32px; text-decoration: none; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; border-radius: 2px; margin-top: 24px; }
          .footer { background-color: #e8e6e1; padding: 24px; text-align: center; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SAU IL MORO</h1>
            <div class="sub-header">Artigianato Sardo d'Eccellenza</div>
          </div>
          <div class="content">
            <h2 style="font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #0A0A0A; margin-top: 0;">Benvenuto, ${userName}!</h2>
            <p>Grazie per esserti iscritto alla community di <strong>Sau Il Moro</strong>.</p>
            <div class="highlight-box">
              "La Sardegna non si racconta. Si porta con sé."
            </div>
            <p>Ogni nostra creazione racchiude la storia, l'anima e il sapere antico dei maestri coltellinai sardi. Dai modelli iconici come l'<strong>Arburesa</strong> e la <strong>Pattadese</strong>, fino ai pezzi esclusivi in edizione limitata.</p>
            <p>Come iscritto, sarai il primo a scoprire i nuovi pezzi unici forgati nel nostro laboratorio e le edizioni speciali riservate.</p>
            <div style="text-align: center;">
              <a href="https://sauilmoro.it" class="button">Esplora lo Store</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Near di Diana Gabriele — P.IVA 14470190969 — info@sauilmoro.com</p>
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
  billingInfo?: string;
}) {
  const itemsHtml = order.items
    .map(
      item => `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; font-weight: 500;">${item.name}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold;">${(item.price * item.quantity).toFixed(2)} €</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="it">
      <head>
        <meta charset="utf-8" />
        <title>Conferma Ordine #${order.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f2; color: #0A0A0A; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e8e6e1; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background-color: #b34624; padding: 32px 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
          .sub-title { font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; opacity: 0.9; margin-top: 4px; }
          .content { padding: 32px 30px; line-height: 1.6; color: #333333; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
          .total-box { background: #f8f7f5; padding: 16px; margin-top: 20px; border-radius: 4px; text-align: right; }
          .total { font-weight: bold; font-size: 20px; color: #b34624; }
          .footer { background-color: #e8e6e1; padding: 20px; text-align: center; font-size: 11px; color: #777777; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SAU IL MORO</h1>
            <div class="sub-title">Conferma d'Acquisto Ordine #${order.id}</div>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; margin-top: 0;">Grazie per il tuo ordine, ${order.customerName}!</h2>
            <p>Abbiamo ricevuto il tuo pagamento ed il tuo ordine è stato confermato con successo.</p>

            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 28px; border-bottom: 2px solid #b34624; padding-bottom: 6px;">Riepilogo Prodotti Acquistati:</h3>
            <table class="table">
              <thead>
                <tr style="background: #f4f4f2; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                  <th style="padding: 10px; border-bottom: 2px solid #ddd;">Prodotto</th>
                  <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Qtà</th>
                  <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Prezzo</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total-box">
              <span style="font-size: 13px; text-transform: uppercase; font-weight: bold; margin-right: 12px;">Totale Ordine:</span>
              <span class="total">${order.total.toFixed(2)} €</span>
            </div>

            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 28px; border-bottom: 1px solid #e8e6e1; padding-bottom: 6px;">Indirizzo di Spedizione:</h3>
            <p style="font-size: 14px; color: #555; margin-top: 8px;">${order.shippingAddress}</p>

            ${order.billingInfo ? `
              <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; border-bottom: 1px solid #e8e6e1; padding-bottom: 6px;">Dati di Fatturazione:</h3>
              <p style="font-size: 13px; color: #555; margin-top: 8px;">${order.billingInfo}</p>
            ` : ''}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Near di Diana Gabriele — P.IVA 14470190969 — ordini@sauilmoro.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getOrderProcessingEmailHtml(orderId: string, customerName: string) {
  return `
    <!DOCTYPE html>
    <html lang="it">
      <head>
        <meta charset="utf-8" />
        <title>Ordine #${orderId} in Lavorazione</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f2; color: #0A0A0A; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e8e6e1; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background-color: #b34624; padding: 32px 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
          .content { padding: 32px 30px; line-height: 1.7; color: #333333; }
          .status-badge { display: inline-block; background-color: #e3f2fd; color: #0d47a1; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 16px; border-radius: 50px; margin: 16px 0; }
          .footer { background-color: #e8e6e1; padding: 20px; text-align: center; font-size: 11px; color: #777777; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SAU IL MORO</h1>
            <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.9; margin-top: 4px;">Aggiornamento Ordine #${orderId}</div>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; margin-top: 0;">Gentile ${customerName},</h2>
            <div class="status-badge">🛠️ Ordine in Lavorazione</div>
            <p>Il tuo ordine <strong>#${orderId}</strong> è stato preso in carico dai nostri maestri artigiani.</p>
            <p>Stiamo preparando, controllando e rifacendo la finitura del tuo pezzo artigianale nel nostro laboratorio per garantirti l'eccellenza della tradizione sarda.</p>
            <p>Riceverai una successiva notifica via email non appena il pacco verrà affidato al corriere espresso per la spedizione.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Near di Diana Gabriele — Sau Il Moro — ordini@sauilmoro.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getOrderShippedEmailHtml(
  orderId: string,
  customerName: string,
  trackingNumber: string = 'N/A',
  carrier: string = 'GLS / DHL Express'
) {
  return `
    <!DOCTYPE html>
    <html lang="it">
      <head>
        <meta charset="utf-8" />
        <title>Ordine #${orderId} Spedito</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f2; color: #0A0A0A; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e8e6e1; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background-color: #2e7d32; padding: 32px 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
          .content { padding: 32px 30px; line-height: 1.7; color: #333333; }
          .tracking-box { background: #f1f8e9; border: 1px solid #c8e6c9; padding: 20px; border-radius: 4px; margin: 24px 0; text-align: center; }
          .button { display: inline-block; background-color: #2e7d32; color: #ffffff !important; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border-radius: 2px; margin-top: 16px; }
          .footer { background-color: #e8e6e1; padding: 20px; text-align: center; font-size: 11px; color: #777777; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SAU IL MORO</h1>
            <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.9; margin-top: 4px;">Il tuo ordine #${orderId} è in viaggio! 🚚</div>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; margin-top: 0;">Gentile ${customerName},</h2>
            <p>Il tuo ordine <strong>#${orderId}</strong> è stato affidato al corriere ed è in fase di consegna (24/48h).</p>
            
            <div class="tracking-box">
              <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #2e7d32;">Corriere: ${carrier}</div>
              <div style="font-size: 16px; font-weight: bold; font-family: monospace; margin: 8px 0; color: #0A0A0A;">Tracking ID: ${trackingNumber}</div>
              <a href="https://sauilmoro.it/account" class="button">Traccia Spedizione</a>
            </div>

            <p>Ti ringraziamo ancora per aver scelto l'artigianato unico di Sau Il Moro!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Near di Diana Gabriele — Sau Il Moro — ordini@sauilmoro.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
