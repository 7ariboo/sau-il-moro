"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { ButtonCustom } from '@/components/ButtonCustom';
import { ProductCard } from '@/components/ProductCard';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getProductById, getProductsByCategory, getCategoryBySlug } from '@/lib/data';

export default function ProductPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '1';

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-stone-texture">
        <Header />
        <div className="container mx-auto px-6 pt-40 pb-24 text-center">
          <h1 className="text-4xl font-display mb-4">Prodotto non trovato</h1>
          <Link href="/"><ButtonCustom>Torna alla Home</ButtonCustom></Link>
        </div>
      </main>
    );
  }

  const category = getCategoryBySlug(product.category);
  const relatedProducts = getProductsByCategory(product.category).filter(p => p.id !== id).slice(0, 3);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />

      <div className="container mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumbs */}
        <nav className="mb-12">
          <ul className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 flex-wrap">
            <li><Link href="/" className="hover:text-brand-rust transition-colors">Home</Link></li>
            <li className="text-deep-black/20">/</li>
            <li><Link href={`/category/${product.category}`} className="hover:text-brand-rust transition-colors">{category?.name || product.category}</Link></li>
            <li className="text-deep-black/20">/</li>
            <li className="text-deep-black">{product.name}</li>
          </ul>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Image Gallery */}
          <div className="flex-1 space-y-4">
            <div className="relative aspect-square bg-white shadow-lg overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.isWow && (
                <div className="absolute top-4 left-4 bg-brand-rust text-pure-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                  BESTSELLER
                </div>
              )}
              {product.compareAtPrice && (
                <div className="absolute top-4 right-4 bg-deep-black text-pure-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                  -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`relative aspect-square bg-white border-2 transition-colors cursor-pointer ${i === 1 ? 'border-brand-rust' : 'border-transparent hover:border-brand-rust/30'}`}>
                  <Image
                    src={product.images[0]}
                    alt={`${product.name} vista ${i}`}
                    fill
                    className="object-cover"
                    sizes="15vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-brand-rust font-bold tracking-widest text-xs uppercase mb-2 block">
                Collezione {category?.name || product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-display mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-display text-brand-rust">{product.price} €</p>
                {product.compareAtPrice && (
                  <p className="text-xl font-display text-deep-black/30 line-through">{product.compareAtPrice} €</p>
                )}
              </div>
            </div>

            <div className="mb-10 space-y-6">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-y-4 border-t border-b border-gray-200 py-6">
                {product.details.map((detail) => (
                  <div key={detail.label}>
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">{detail.label}</p>
                    <p className="text-sm font-bold">{detail.value}</p>
                  </div>
                ))}
              </div>

              {/* Stock info */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-deep-black/50">
                  {product.inStock ? `Disponibile (${product.stockQuantity} pezzi)` : 'Esaurito'}
                </span>
              </div>

              {/* Free shipping badge */}
              {product.price >= 150 && (
                <div className="flex items-center gap-2 bg-brand-rust/5 border border-brand-rust/10 px-4 py-3 rounded-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-rust"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-rust">Spedizione gratuita</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border-2 border-deep-black h-14">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 hover:text-brand-rust transition-colors"
                >-</button>
                <span className="flex-1 text-center font-bold min-w-[3rem]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-4 hover:text-brand-rust transition-colors"
                >+</button>
              </div>
              <ButtonCustom
                className="flex-1 h-14"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {addedToCart ? '✓ Aggiunto!' : 'Aggiungi al carrello'}
              </ButtonCustom>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-deep-black/30 border border-deep-black/10 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-deep-black/5">
            <h2 className="text-3xl font-display font-bold uppercase mb-10">Potrebbe piacerti anche</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} {...p} showCart />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
