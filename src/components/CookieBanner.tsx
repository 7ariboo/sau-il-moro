"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sau_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('sau_cookie_consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      date: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem('sau_cookie_consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      date: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('sau_cookie_consent', JSON.stringify({
      necessary: true,
      analytics,
      marketing,
      date: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-deep-black/95 text-white backdrop-blur-md border-t border-white/10 shadow-2xl">
      <div className="container mx-auto max-w-5xl">
        {!showPreferences ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h4 className="text-sm font-display font-bold uppercase tracking-wider text-brand-rust">
                Informativa Cookie &amp; Privacy (GDPR)
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Utilizziamo cookie tecnici essenziali per il funzionamento dello store e, previo tuo consenso, cookie analitici e di marketing per migliorare l&apos;esperienza d&apos;acquisto. Consulta la nostra{' '}
                <Link href="/privacy" className="underline hover:text-brand-rust text-white font-semibold">
                  Privacy Policy
                </Link>{' '}
                e la nostra{' '}
                <Link href="/cookie-policy" className="underline hover:text-brand-rust text-white font-semibold">
                  Cookie Policy
                </Link>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setShowPreferences(true)}
                className="flex-1 md:flex-initial px-4 py-2.5 text-xs font-bold uppercase tracking-widest border border-white/20 hover:border-white text-white rounded-sm transition-colors"
              >
                Personalizza
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="flex-1 md:flex-initial px-4 py-2.5 text-xs font-bold uppercase tracking-widest border border-white/20 hover:border-white text-white rounded-sm transition-colors"
              >
                Solo Essenziali
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 md:flex-initial px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-brand-rust text-white hover:bg-white hover:text-deep-black rounded-sm transition-colors shadow-lg"
              >
                Accetta Tutti
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h4 className="text-sm font-display font-bold uppercase tracking-wider text-brand-rust">
                Preferenze Cookie
              </h4>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ✕ Chiudi
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white/5 border border-white/10 rounded-sm space-y-1">
                <div className="flex justify-between items-center font-bold text-white">
                  <span>Cookie Tecnici (Essenziali)</span>
                  <span className="text-[10px] text-green-400 uppercase">Sempre Attivi</span>
                </div>
                <p className="text-gray-400 text-[11px]">Necessari per il carrello, la sessione di acquisto e l&apos;autenticazione.</p>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-sm space-y-1">
                <div className="flex justify-between items-center font-bold text-white">
                  <span>Cookie Analitici</span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="accent-brand-rust cursor-pointer w-4 h-4"
                  />
                </div>
                <p className="text-gray-400 text-[11px]">Ci aiutano a comprendere l&apos;uso del sito in forma aggregata e anonima. Include Contentsquare per heatmap e registrazioni sessione.</p>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-sm space-y-1">
                <div className="flex justify-between items-center font-bold text-white">
                  <span>Cookie di Marketing</span>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="accent-brand-rust cursor-pointer w-4 h-4"
                  />
                </div>
                <p className="text-gray-400 text-[11px]">Utilizzati per mostrare contenuti promozionali pertinenti.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleSaveCustom}
                className="px-6 py-2 text-xs font-bold uppercase tracking-widest bg-brand-rust text-white hover:bg-white hover:text-deep-black rounded-sm transition-colors"
              >
                Salva Preferenze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
