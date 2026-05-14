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
  const categoryInfo = category || { name: 'COLLEZIONE', description: 'Artigianato Sardo', image: '/images/ferro.png' };

  const products = useMemo(() => {
    return PRODUCTS.filter(p => p.category === slug);
  }, [slug]);

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />

      {/* Category Hero */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={categoryInfo.image}
          alt={categoryInfo.name}
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-pure-white text-6xl md:text-8xl font-display mb-4 uppercase tracking-widest animate-fade-in">
            {categoryInfo.name}
          </h1>
          <p className="text-pure-white/80 text-sm md:text-base font-bold uppercase tracking-[0.4em] animate-fade-in max-w-xl mx-auto">
            {categoryInfo.description}
          </p>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6">
        <p className="text-sm text-deep-black/40 uppercase tracking-widest font-bold mb-8">
          {products.length} prodott{products.length === 1 ? 'o' : 'i'} disponibil{products.length === 1 ? 'e' : 'i'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} showCart />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200">
              <p className="uppercase tracking-widest font-bold text-gray-400">Nessun prodotto disponibile in questa categoria</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
