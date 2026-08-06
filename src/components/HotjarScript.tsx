"use client";
import Script from 'next/script';

export function HotjarScript() {
  return (
    <Script
      id="contentsquare-tracking"
      src="https://t.contentsquare.net/uxa/6eeba4b3f1d02.js"
      strategy="afterInteractive"
      defer
    />
  );
}
