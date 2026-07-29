"use client";
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { ButtonCustom } from '@/components/ButtonCustom';
import { CATEGORIES, PRODUCTS } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [nlEmail, setNlEmail] = useState('');
  const [nlStatus, setNlStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const featuredProducts = PRODUCTS;

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail }),
      });
      const data = await res.json();
      if (data.success) {
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

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 'calc(100vh - 100px)', marginTop: '100px' }}>
        {/* Immagine di sfondo */}
        <div className="absolute inset-0 z-0">
          {/* Desktop */}
          <Image
            src="/images/home.png"
            alt="Sau Il Moro"
            fill
            className="hidden md:block object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Mobile */}
          <Image
            src="/images/home-mobile.png"
            alt="Sau Il Moro"
            fill
            className="block md:hidden object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>

        {/* Bottone in alto a sinistra */}
        <div className="absolute top-6 left-6 md:top-10 md:left-12 z-10">
          <Link href="/category/ferro">
            <button
              className="font-display font-bold uppercase text-white transition-all active:scale-95 hover:scale-105"
              style={{
                backgroundColor: '#b34624',
                borderRadius: '9999px',
                padding: '12px 32px',
                fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)',
                letterSpacing: '0.06em',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(179,70,36,0.6)',
              }}
            >
              CHI SONO?
            </button>
          </Link>
        </div>
      </section>

      {/* Nuove Collezioni */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold uppercase tracking-tight">Nuove Collezioni</h2>
            <p className="text-sm text-deep-black/40 uppercase tracking-widest font-bold mt-2">Esplora le categorie dell&apos;artigianato sardo</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.slug}
              name={cat.name}
              image={cat.image}
              imagePosition={cat.slug === 'carne' ? 'object-[center_35%]' : 'object-center'}
            />
          ))}
        </div>
      </section>

      {/* Secondary Nav Bar — solo desktop */}
      <section className="hidden md:block bg-white border-y border-deep-black/5">
        <div className="container mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-rust">
              <Image src="/images/Sfondo/coltello.png" alt="Sau" fill className="object-cover" sizes="40px" />
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
        </div>
      </section>

      {/* Spotlight Banner con Sfondo Coltello */}
      <section className="relative w-full py-24 md:py-32 flex items-center overflow-hidden bg-deep-black">
        <div className="absolute inset-0 opacity-55">
          <Image
            src="/images/Sfondo/coltello.png"
            alt="Coltelli Artigianali Sardo"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl text-pure-white">
            <p className="text-brand-rust text-xs font-bold uppercase tracking-[0.4em] mb-4 font-bold">Esclusivo Sau Il Moro</p>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-6">Bundle Sau Il Moro</h2>
            <p className="text-lg text-pure-white/80 leading-relaxed">
              Tutti i 4 coltelli iconici in un unico set esclusivo: Arburesa + Pattadese + Gallurese + Coltello Salvezza.
              Valore 424€, tuo a soli 360€ con uno sconto speciale di 64€.
            </p>
            <div className="mt-8">
              <Link href="/products/bundle-sau-il-moro">
                <ButtonCustom variant="outline" className="!text-pure-white !border-pure-white/40 hover:!bg-brand-rust hover:!border-brand-rust">
                  Scopri il Bundle (360 €)
                </ButtonCustom>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products: Coltelli Artigianali & Bundle con foto coltello in sottofondo */}
      <section className="relative py-24 overflow-hidden bg-neutral-900 text-white">
        {/* Background photo of knife */}
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/1/DSC09907.jpg"
            alt="Sfondo Coltello Artigianale"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/90 via-neutral-900/80 to-neutral-900/95" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-white">
                Coltelli & Bundle Artigianali
              </h2>
              <p className="text-sm text-brand-rust uppercase tracking-widest font-bold mt-2">
                La Sardegna non si racconta. Si porta con sé.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} showCart />
            ))}
          </div>
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
              onChange={(e) => setNlEmail(e.target.value)}
              required
              className="flex-1 bg-white/10 border border-white/20 text-pure-white px-6 py-4 text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-rust transition-colors"
            />
            <ButtonCustom type="submit" className="shrink-0">Iscriviti</ButtonCustom>
          </form>
          {nlStatus === 'success' && (
            <p className="text-xs font-bold text-brand-rust uppercase tracking-widest mt-4">Iscrizione completata con successo!</p>
          )}
          {nlStatus === 'error' && (
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-4">Si è verificato un errore. Riprova.</p>
          )}
        </div>
      </section>
    </main>
  );
}
