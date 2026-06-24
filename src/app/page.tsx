"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { ButtonCustom } from '@/components/ButtonCustom';
import { Footer } from '@/components/Footer';
import { PRODUCTS, CATEGORIES } from '@/lib/data';

export default function Home() {
  const [nlEmail, setNlEmail] = useState('');
  const [nlStatus, setNlStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const categories = CATEGORIES.filter(c => ['carne', 'legno', 'ferro'].includes(c.slug));

  const featuredProducts = PRODUCTS.filter(p => p.category === 'ferro').slice(0, 3);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail }),
      });
      if (res.ok) {
        setNlStatus('success');
        setNlEmail('');
      } else {
        setNlStatus('error');
      }
    } catch {
      setNlStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />

      {/* Hero Section — responsive: mobile portrait / desktop landscape */}
      <section
        className="relative w-full overflow-hidden"
        style={{ marginTop: '100px' }}
      >
        {/* ── DESKTOP: home.png landscape ── */}
        <Image
          src="/images/home.png"
          alt="Sau Il Moro Hero"
          width={2558}
          height={1148}
          priority
          className="w-full h-auto block hidden md:block"
        />
        {/* Pulsante desktop — in alto a destra */}
        <button
          className="hidden md:block absolute font-display font-bold uppercase text-white transition-all hover:scale-105 hover:brightness-110"
          style={{
            top: '18%', right: '5%',
            backgroundColor: '#b34624',
            borderRadius: '9999px',
            padding: 'clamp(8px, 1.2vw, 14px) clamp(18px, 2.8vw, 36px)',
            fontSize: 'clamp(0.75rem, 1.5vw, 1.15rem)',
            letterSpacing: '0.06em',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(179,70,36,0.5)',
          }}
        >
          CHI SONO?
        </button>

        {/* ── MOBILE: home-mobile.png portrait + overlay HTML ── */}
        <div className="relative block md:hidden">
          <Image
            src="/images/home-mobile.png"
            alt="Sau Il Moro Hero"
            width={1024}
            height={1024}
            priority
            className="w-full h-auto block"
          />
          {/* Testo + pulsante sovrapposti sulla zona scura in basso */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8 px-6"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)', paddingTop: '60px' }}
          >
            <p className="font-display font-bold uppercase text-white text-center mb-1" style={{ fontSize: 'clamp(1.1rem, 5vw, 1.5rem)', letterSpacing: '0.03em' }}>
              SCOPRI la sardegna
            </p>
            <p className="font-display font-bold uppercase text-white text-center mb-2" style={{ fontSize: 'clamp(1.8rem, 8vw, 2.5rem)', letterSpacing: '0.02em' }}>
              DI SAU IL MORO
            </p>
            <p className="text-white/70 italic text-center mb-5" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 1rem)' }}>
              dalla sardegna a casa tua
            </p>
            <button
              className="font-display font-bold uppercase text-white transition-all active:scale-95"
              style={{
                backgroundColor: '#b34624',
                borderRadius: '9999px',
                padding: '12px 36px',
                fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                letterSpacing: '0.06em',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(179,70,36,0.6)',
              }}
            >
              CHI SONO?
            </button>
          </div>
        </div>
      </section>

      {/* Nuove Collezioni */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Nuove Collezioni</h2>
            <p className="text-sm text-deep-black/40 uppercase tracking-widest font-bold mt-2">Esplora le categorie</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button className="w-10 h-10 border border-deep-black/10 rounded-full flex items-center justify-center hover:bg-brand-rust hover:text-pure-white hover:border-brand-rust transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="w-10 h-10 border border-deep-black/10 rounded-full flex items-center justify-center bg-white shadow-md hover:bg-brand-rust hover:text-pure-white hover:border-brand-rust transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} id={cat.slug} name={cat.name} image={cat.image} />
          ))}
        </div>
      </section>

      {/* Secondary Nav Bar */}
      <section className="bg-white border-y border-deep-black/5">
        <div className="container mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-rust">
              <Image src="/images/ferro.png" alt="Sau" fill className="object-cover" sizes="40px" />
            </div>
            <span className="text-lg font-display font-bold uppercase">Sau Il Moro</span>
          </div>
          <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-[0.2em]">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="hover:text-brand-rust transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-deep-black/5 rounded-full flex items-center justify-center hover:bg-brand-rust hover:text-pure-white transition-all cursor-pointer text-xs font-bold">FB</div>
            <div className="w-8 h-8 bg-deep-black/5 rounded-full flex items-center justify-center hover:bg-brand-rust hover:text-pure-white transition-all cursor-pointer text-xs font-bold">IG</div>
            <div className="w-8 h-8 bg-deep-black/5 rounded-full flex items-center justify-center hover:bg-brand-rust hover:text-pure-white transition-all cursor-pointer text-xs font-bold">WA</div>
          </div>
        </div>
      </section>

      {/* Spotlight Banner */}
      <section className="relative w-full py-24 md:py-32 flex items-center overflow-hidden bg-deep-black">
        <div className="absolute inset-0 opacity-60">
          <Image
            src="/images/ferro.png"
            alt="Coltelli Artigianali"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl text-pure-white">
            <p className="text-brand-rust text-xs font-bold uppercase tracking-[0.4em] mb-4">Focus On</p>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-6">Coltelli Artigianali</h2>
            <p className="text-lg text-pure-white/70 leading-relaxed">
              Scopri l&apos;eccellenza della forgia sarda.
              Una collezione di coltelli fatti a mano, forgiati per durare.
            </p>
            <div className="mt-8">
              <ButtonCustom variant="outline" className="!text-pure-white !border-pure-white/40 hover:!bg-pure-white hover:!text-deep-black">
                Scopri la forgia
              </ButtonCustom>
            </div>
          </div>
          <Link href="/category/ferro" className="relative w-24 h-24 bg-brand-rust text-pure-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Coltelli Artigianali</h2>
            <p className="text-sm text-deep-black/40 uppercase tracking-widest font-bold mt-2">Fatti a mano in Sardegna</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button className="w-10 h-10 border border-deep-black/10 rounded-full flex items-center justify-center hover:bg-brand-rust hover:text-pure-white hover:border-brand-rust transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="w-10 h-10 border border-deep-black/10 rounded-full flex items-center justify-center bg-white shadow-md hover:bg-brand-rust hover:text-pure-white hover:border-brand-rust transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} {...product} showCart={i === 0} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-deep-black py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-pure-white uppercase mb-4">Resta in contatto</h2>
          <p className="text-pure-white/50 max-w-md mx-auto mb-10">
            Iscriviti alla newsletter per ricevere anteprime, offerte esclusive e storie dalla nostra bottega.
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="La tua email..."
              value={nlEmail}
              onChange={e => setNlEmail(e.target.value)}
              required
              className="flex-1 bg-pure-white/10 border border-pure-white/20 text-pure-white px-6 py-4 text-sm focus:outline-none focus:border-brand-rust transition-colors placeholder:text-pure-white/30"
            />
            <ButtonCustom type="submit" variant="primary" size="md">
              Iscriviti
            </ButtonCustom>
          </form>
          {nlStatus === 'success' && (
            <p className="text-brand-rust mt-4 text-sm font-bold uppercase tracking-widest animate-fade-in">✓ Iscrizione completata!</p>
          )}
          {nlStatus === 'error' && (
            <p className="text-red-400 mt-4 text-sm font-bold uppercase tracking-widest animate-fade-in">Errore. Riprova più tardi.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
