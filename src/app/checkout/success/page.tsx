"use client";

import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { ButtonCustom } from '@/components/ButtonCustom';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />
      <div className="container mx-auto px-6 pt-40 pb-24 text-center">
        <div className="max-w-md mx-auto space-y-8 animate-fade-in">
          <div className="w-20 h-20 bg-brand-rust rounded-full flex items-center justify-center mx-auto text-pure-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h1 className="text-4xl font-display uppercase tracking-widest">Pagamento Riuscito!</h1>
          <p className="text-sm font-bold text-brand-rust uppercase tracking-widest">
            Ordine Confermato
          </p>
          <p className="text-gray-600 leading-relaxed">
            Grazie per aver scelto Sau Il Moro. Il tuo pagamento è stato elaborato con successo. Riceverai a breve una mail di conferma con il riepilogo del tuo ordine artigianale.
          </p>
          <div className="pt-4 space-y-3">
            <Link href="/account">
              <ButtonCustom className="w-full">Vai ai Tuoi Ordini</ButtonCustom>
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
