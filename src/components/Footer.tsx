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
          {/* Brand & P.IVA */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-rust shrink-0 bg-white/50 p-1">
                <Image src="/images/firma.png" alt="Sau Il Moro" fill className="object-contain" sizes="56px" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-deep-black">Sau Il Moro</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-rust">Artigianato Sardo d&apos;Eccellenza</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Produzione e vendita di coltelleria artigianale sarda e prodotti della tradizione barbaricina fatti a mano.
            </p>
            <div className="text-[11px] font-bold text-deep-black/70 space-y-1">
              <p>Ragione Sociale: <span className="text-deep-black">Near di Diana Gabriele</span></p>
              <p>P.IVA: <span className="font-mono text-brand-rust">14470190969</span></p>
              <p>Sede Legale: Sardegna, Italia</p>
              <p>Email: <a href="mailto:info@sauilmoro.com" className="hover:text-brand-rust transition-colors underline">info@sauilmoro.com</a></p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 w-full md:w-auto">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.25em] mb-4 text-deep-black">Collezioni</h4>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-deep-black/50">
                {CATEGORIES.map(cat => (
                  <li key={cat.slug}>
                    {cat.slug === 'ferro' ? (
                      <Link href={`/category/${cat.slug}`} className="hover:text-brand-rust transition-colors">
                        {cat.name}
                      </Link>
                    ) : (
                      <span className="text-gray-300 cursor-not-allowed">
                        {cat.name} <span className="text-[9px] text-gray-400 font-normal lowercase">(prossimamente)</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.25em] mb-4 text-deep-black">Note Legali</h4>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-deep-black/50">
                <li><Link href="/privacy" className="hover:text-brand-rust transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-brand-rust transition-colors">Cookie Policy</Link></li>
                <li><Link href="/terms" className="hover:text-brand-rust transition-colors">Termini e Condizioni</Link></li>
                <li><Link href="/checkout/success" className="hover:text-brand-rust transition-colors">Stato Ordini</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.25em] mb-4 text-deep-black">Assistenza</h4>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-deep-black/50 mb-4">
                <li><a href="mailto:ordini@sauilmoro.com" className="hover:text-brand-rust transition-colors">ordini@sauilmoro.com</a></li>
                <li className="text-[11px] normal-case text-gray-400">Lun - Sab: 09:00 - 18:00</li>
              </ul>
              <div className="flex gap-2">
                <a href="https://www.facebook.com/sauilmoro" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-brand-rust text-white flex items-center justify-center rounded-sm hover:bg-deep-black transition-colors text-xs font-bold" aria-label="Facebook">FB</a>
                <a href="https://www.instagram.com/sauilmoro/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-brand-rust text-white flex items-center justify-center rounded-sm hover:bg-deep-black transition-colors text-xs font-bold" aria-label="Instagram">IG</a>
                <a href="https://www.tiktok.com/@sauilmoro" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-brand-rust text-white flex items-center justify-center rounded-sm hover:bg-deep-black transition-colors text-xs font-bold" aria-label="TikTok">TT</a>
                <a href="mailto:info@sauilmoro.com" className="w-9 h-9 bg-brand-rust text-white flex items-center justify-center rounded-sm hover:bg-deep-black transition-colors text-xs font-bold" aria-label="Email">✉</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-deep-black/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-deep-black/40">
          <div>
            &copy; {new Date().getFullYear()} Sau Il Moro • Near di Diana Gabriele • P.IVA 14470190969 • Tutti i diritti riservati
          </div>
          <div className="flex gap-4">
            <span>Spedizioni in tutta Italia ed Europa</span>
            <span>•</span>
            <span>Pagamenti Sicuri Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

