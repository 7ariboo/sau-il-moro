"use client";

import React from 'react';
import { Header } from '@/components/Header';
import { ButtonCustom } from '@/components/ButtonCustom';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />
      <div className="container mx-auto px-6 pt-40 pb-24 text-center">
        <div className="max-w-md mx-auto space-y-8 animate-fade-in">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h1 className="text-3xl font-display uppercase tracking-widest">Pagamento Annullato</h1>
          <p className="text-gray-600 leading-relaxed">
            Il pagamento non è stato completato. I prodotti sono ancora salvati nel tuo carrello se desideri riprovare.
          </p>
          <div className="pt-4 space-y-3">
            <Link href="/checkout">
              <ButtonCustom className="w-full">Ritorna al Checkout</ButtonCustom>
            </Link>
            <Link href="/">
              <ButtonCustom variant="outline" className="w-full">Torna alla Home</ButtonCustom>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
