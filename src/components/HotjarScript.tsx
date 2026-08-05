"use client";
import Script from 'next/script';
import { useState, useEffect } from 'react';

export function HotjarScript() {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('sau_cookie_consent');
      if (consent) {
        const parsed = JSON.parse(consent);
        setIsAllowed(parsed.analytics === true);
      }
    } catch {}

    // Re-check when consent changes (e.g. user clicks accept)
    const handleStorage = () => {
      try {
        const consent = localStorage.getItem('sau_cookie_consent');
        if (consent) {
          const parsed = JSON.parse(consent);
          setIsAllowed(parsed.analytics === true);
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    
    // Also listen for custom consent event
    const interval = setInterval(() => {
      try {
        const consent = localStorage.getItem('sau_cookie_consent');
        if (consent) {
          const parsed = JSON.parse(consent);
          if (parsed.analytics === true) {
            setIsAllowed(true);
            clearInterval(interval);
          }
        }
      } catch {}
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (!isAllowed) return null;

  return (
    <Script
      src="https://t.contentsquare.net/uxa/6eeba4b3f1d02.js"
      strategy="afterInteractive"
      defer
    />
  );
}
