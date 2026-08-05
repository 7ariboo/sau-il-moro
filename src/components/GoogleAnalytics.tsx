"use client";
import Script from 'next/script';

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: document.title,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}

// Helper to track custom e-commerce events from anywhere
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
}

// E-commerce specific tracking helpers
export function trackAddToCart(item: { id: string; name: string; price: number; quantity: number }) {
  trackEvent('add_to_cart', {
    currency: 'EUR',
    value: item.price * item.quantity,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }],
  });
}

export function trackPurchase(orderId: string, total: number, items: { id: string; name: string; price: number; quantity: number }[]) {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'EUR',
    value: total,
    items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
}

export function trackBeginCheckout(total: number) {
  trackEvent('begin_checkout', { currency: 'EUR', value: total });
}
