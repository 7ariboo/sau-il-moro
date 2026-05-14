"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CartDrawer } from './CartDrawer';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-md' : 'bg-white'}`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-rust shrink-0">
                <Image src="/images/ferro.png" alt="Sau Il Moro" fill className="object-cover" sizes="48px" />
              </div>
              <h1 className="text-xl md:text-2xl font-display text-deep-black">
                SAU <span className="text-brand-rust">IL MORO</span>
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {['FERRO', 'LEGNO', 'TERRA', 'CARNE'].map((item) => (
              <Link
                key={item}
                href={`/category/${item.toLowerCase()}`}
                className={`text-xs font-bold tracking-[0.2em] transition-colors ${
                  pathname === `/category/${item.toLowerCase()}`
                    ? 'text-brand-rust'
                    : 'text-deep-black hover:text-brand-rust'
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center h-full gap-4">
            {/* User Account */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-rust hover:text-deep-black transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 hover:text-brand-rust transition-colors"
                    title={`${user.name} ${user.surname}`}
                  >
                    <div className="w-8 h-8 bg-brand-rust text-pure-white rounded-full flex items-center justify-center text-xs font-bold">
                      {user.name[0]}{user.surname[0]}
                    </div>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/account"
                  className="hover:text-brand-rust transition-colors"
                  title="Accedi"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </Link>
              )}
            </div>

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-brand-rust transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-rust text-pure-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Social (diagonal rust) */}
            <div className="hidden md:flex bg-brand-rust h-20 px-8 items-center gap-4 clip-diagonal-header text-pure-white -mr-6 ml-4">
              <Link href="#" className="hover:scale-110 transition-transform" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </Link>
              <Link href="#" className="hover:scale-110 transition-transform" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </Link>
            </div>

            {/* Mobile menu */}
            <button className="lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
