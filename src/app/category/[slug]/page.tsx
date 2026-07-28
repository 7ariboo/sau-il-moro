"use client";

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import Image from 'next/image';
import { PRODUCTS, getCategoryBySlug } from '@/lib/data';

export default function CategoryPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const category = getCategoryBySlug(slug);
  const categoryInfo = category || {
    name: 'COLLEZIONE',
    description: 'Artigianato Sardo',
    image: '/images/Sfondo/coltello.png',
  };

  const products = useMemo(() => {
    return PRODUCTS.filter(p => p.category === slug);
  }, [slug]);

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />

      {/* Full-width Edge-to-Edge Banner Image (no top or side gaps) */}
      <section className="pt-[100px] w-full">
        <div className="relative w-full h-[70vh] md:h-[85vh] min-h-[450px]">
          <Image
            src={categoryInfo.image}
            alt={categoryInfo.name}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>

        {/* Text Section Below Full-width Banner */}
        <div className="text-center py-10 md:py-14 border-b border-[#c8c4bc]/30 bg-stone-texture">
          <h1 className="text-deep-black text-4xl sm:text-6xl md:text-7xl font-display mb-3 uppercase tracking-[0.2em]">
            {categoryInfo.name}
          </h1>
          <p className="text-brand-rust text-sm sm:text-base md:text-lg font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed px-6">
            {categoryInfo.description}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 container mx-auto px-6">
        <p className="text-sm text-deep-black/50 uppercase tracking-widest font-bold mb-10">
          {products.length} prodott{products.length === 1 ? 'o' : 'i'} disponibil{products.length === 1 ? 'e' : 'i'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} showCart />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
              <p className="uppercase tracking-widest font-bold text-gray-400">
                Nessun prodotto attualmente disponibile in questa categoria
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
