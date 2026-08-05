"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { recordPageView, pingActiveVisitor } from '@/lib/firestore-analytics';

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('sau_visitor_id');
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('sau_visitor_id', id);
  }
  return id;
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Record page view in Firestore (persistent)
    recordPageView(pathname);

    // Also send to in-memory API (for backward compat)
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    }).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    // Ping active visitor every 60 seconds
    const visitorId = getVisitorId();
    if (visitorId) {
      pingActiveVisitor(visitorId);
      intervalRef.current = setInterval(() => {
        pingActiveVisitor(visitorId);
      }, 60000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
