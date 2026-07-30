"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CartDrawer } from './CartDrawer';
import { FreeShippingBanner } from './FreeShippingBanner';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Ferro', href: '/category/ferro' },
];

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[100px]">

        {/* Sfondo texture pietra grigia */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#e8e6e1',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")',
          }}
        />

        {/* Linea separatrice inferiore */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c8c4bc] to-transparent" />

        {/* Contenuto del header */}
        <div className="relative h-full flex items-center justify-between px-4 md:px-8">

          {/* ── SINISTRA: Hamburger (mobile) + Logo ── */}
          <div className="flex items-center gap-3">
            {/* Hamburger - solo mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] group"
              aria-label="Menu"
            >
              <span className={`block w-6 h-[2px] bg-[#5a4a3a] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-6 h-[2px] bg-[#5a4a3a] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-[2px] bg-[#5a4a3a] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 text-[#5a4a3a] hover:text-[#b34624] transition-colors group">
              <div className="relative w-12 h-10 md:w-16 md:h-12 shrink-0">
                <Image src="/images/firma.png" alt="Sau Il Moro" fill className="object-contain transition-transform group-hover:scale-105" sizes="64px" priority />
              </div>
              <span className="font-display font-bold tracking-widest uppercase text-sm md:text-lg">
                SAU IL MORO
              </span>
            </Link>
          </div>

          {/* ── CENTRO: Nav links — solo desktop ── */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold uppercase tracking-[0.2em] text-[#5a4a3a] hover:text-[#b34624] transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#b34624] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* ── DESTRA: Cart, Account, Admin, Social ── */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Admin link */}
            {user && isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#b34624] hover:text-[#0A0A0A] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>
                Admin
              </Link>
            )}

            {/* Account */}
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 hover:text-[#b34624] transition-colors"
                title={`${user.name} ${user.surname}`}
              >
                <div className="w-8 h-8 bg-[#b34624] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {user.name[0]}{user.surname[0]}
                </div>
              </Link>
            ) : (
              <Link href="/account" className="text-[#5a4a3a] hover:text-[#b34624] transition-colors" title="Accedi">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            )}

            {/* Carrello */}
            <button onClick={() => setIsCartOpen(true)} className="relative text-[#5a4a3a] hover:text-[#b34624] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#b34624] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Separatore verticale — solo desktop */}
            <div className="hidden md:block w-[1px] h-6 bg-[#5a4a3a]/20" />

            {/* Social icons — solo desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a href="https://www.facebook.com/sauilmoro" target="_blank" rel="noopener noreferrer" className="text-[#5a4a3a] hover:text-[#b34624] transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/sauilmoro/" target="_blank" rel="noopener noreferrer" className="text-[#5a4a3a] hover:text-[#b34624] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@sauilmoro" target="_blank" rel="noopener noreferrer" className="text-[#5a4a3a] hover:text-[#b34624] transition-colors" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.82V7.63a6.34 6.34 0 1 0 6.34 6.34V9.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-0.83z"/></svg>
              </a>
              <a href="mailto:info@sauilmoro.com" className="text-[#5a4a3a] hover:text-[#b34624] transition-colors" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

        </div>
      </header>

      {/* ── Menu mobile slide-down ── */}
      <div
        className={`fixed top-[100px] left-0 right-0 z-40 transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div
          className="border-b border-[#c8c4bc]/50 shadow-lg"
          style={{
            backgroundColor: '#e8e6e1',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")',
          }}
        >
          <nav className="flex flex-col py-4 px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-sm font-display font-bold uppercase tracking-[0.15em] text-[#5a4a3a] hover:text-[#b34624] transition-colors border-b border-[#c8c4bc]/30 last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
            {user && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-sm font-display font-bold uppercase tracking-[0.15em] text-[#b34624] hover:text-[#0A0A0A] transition-colors"
              >
                ⚙ Admin
              </Link>
            )}
          </nav>
          {/* Social icons — mobile */}
          <div className="flex items-center justify-center gap-6 py-4 border-t border-[#c8c4bc]/30">
            <a href="https://www.facebook.com/sauilmoro" target="_blank" rel="noopener noreferrer" className="text-[#5a4a3a] hover:text-[#b34624] transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.instagram.com/sauilmoro/" target="_blank" rel="noopener noreferrer" className="text-[#5a4a3a] hover:text-[#b34624] transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@sauilmoro" target="_blank" rel="noopener noreferrer" className="text-[#5a4a3a] hover:text-[#b34624] transition-colors" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.82V7.63a6.34 6.34 0 1 0 6.34 6.34V9.4a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-0.83z"/></svg>
            </a>
            <a href="mailto:info@sauilmoro.com" className="text-[#5a4a3a] hover:text-[#b34624] transition-colors" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </div>
        </div>
        {/* Overlay scuro sotto il menu */}
        <div
          className="fixed inset-0 bg-black/30 -z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Dynamic Global Free Shipping Progress Banner */}
      <div className="fixed top-[100px] left-0 right-0 z-40">
        <FreeShippingBanner />
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
