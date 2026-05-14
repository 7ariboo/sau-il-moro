"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ButtonCustom } from './ButtonCustom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const shipping = subtotal >= 150 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-stone-texture z-[70] transition-transform duration-500 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-display uppercase tracking-widest">Il tuo Carrello</h2>
          <button onClick={onClose} className="hover:text-brand-rust transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 border border-gray-200 flex items-center justify-center rounded-full text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Il carrello è vuoto</p>
              <ButtonCustom variant="outline" size="sm" onClick={onClose}>Torna allo shop</ButtonCustom>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-6 animate-fade-in">
                <div className="relative w-24 aspect-square bg-white shadow-sm overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold uppercase tracking-widest leading-tight">{item.name}</h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-brand-rust transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                  <p className="text-sm font-display text-brand-rust">{item.price} €</p>
                  <div className="flex items-center border border-gray-200 w-fit">
                    <button
                      className="px-2 py-1 hover:text-brand-rust"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >-</button>
                    <span className="px-4 text-[10px] font-bold">{item.quantity}</span>
                    <button
                      className="px-2 py-1 hover:text-brand-rust"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 bg-white border-t border-gray-100 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-400">Subtotale</span>
                <span>{subtotal} €</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-gray-400">Spedizione</span>
                <span>{shipping === 0 ? 'GRATIS' : `${shipping} €`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-brand-rust italic">Mancano {150 - subtotal}€ alla spedizione gratuita!</p>
              )}
              <div className="flex justify-between text-lg font-display border-t border-gray-50 pt-4">
                <span>Totale</span>
                <span className="text-brand-rust">{total} €</span>
              </div>
            </div>
            <Link href="/checkout" onClick={onClose}>
              <ButtonCustom className="w-full">Procedi al Checkout</ButtonCustom>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
