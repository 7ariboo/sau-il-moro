"use client";
import React from 'react';
import { useCart } from '@/context/CartContext';

export const FreeShippingBanner: React.FC = () => {
  const { subtotal, items } = useCart();
  const threshold = 150;
  const amountNeeded = Math.max(0, threshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="bg-[#b34624] text-white text-xs font-bold uppercase tracking-widest py-2 px-4 shadow-md transition-all duration-300">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {subtotal >= threshold ? (
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="bg-white text-[#b34624] w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0">✓</span>
            <span>Spedizione Gratuita Sbloccata in tutta Italia!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span>🚚</span>
            <span>
              {items.length > 0 ? (
                <>Mancano solo <strong className="underline underline-offset-2 font-black">{amountNeeded} €</strong> alla Spedizione Gratuita!</>
              ) : (
                <>Spedizione Gratuita per ordini superiori a 150 €</>
              )}
            </span>
          </div>
        )}

        {/* Progress bar line */}
        <div className="w-full sm:w-56 flex items-center gap-2">
          <div className="flex-1 h-2 bg-black/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-bold opacity-90 font-mono min-w-[32px] text-right">
            {progressPercent}%
          </span>
        </div>
      </div>
    </div>
  );
};
