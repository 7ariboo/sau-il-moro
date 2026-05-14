"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/data';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-20 border-t border-deep-black/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-rust shrink-0">
              <Image src="/images/ferro.png" alt="Sau" fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold uppercase">Sau Il Moro</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-deep-black/40">Artigianato Sardo d&apos;Eccellenza</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Categorie</h4>
              <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-deep-black/40">
                {CATEGORIES.map(cat => (
                  <li key={cat.slug}><Link href={`/category/${cat.slug}`} className="hover:text-brand-rust transition-colors">{cat.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Info</h4>
              <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-deep-black/40">
                <li><Link href="/privacy" className="hover:text-brand-rust transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-brand-rust transition-colors">Termini e Condizioni</Link></li>
                <li><Link href="/shipping" className="hover:text-brand-rust transition-colors">Spedizioni</Link></li>
                <li><Link href="/contacts" className="hover:text-brand-rust transition-colors">Contatti</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Social</h4>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-brand-rust text-pure-white flex items-center justify-center rounded-md cursor-pointer hover:bg-deep-black transition-colors text-xs font-bold">FB</div>
                <div className="w-10 h-10 bg-brand-rust text-pure-white flex items-center justify-center rounded-md cursor-pointer hover:bg-deep-black transition-colors text-xs font-bold">IG</div>
                <div className="w-10 h-10 bg-brand-rust text-pure-white flex items-center justify-center rounded-md cursor-pointer hover:bg-deep-black transition-colors text-xs font-bold">WA</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-deep-black/5 text-center text-[10px] font-bold uppercase tracking-[0.5em] text-deep-black/30">
          &copy; {new Date().getFullYear()} Sau Il Moro - Tutti i diritti riservati
        </div>
      </div>
    </footer>
  );
};
