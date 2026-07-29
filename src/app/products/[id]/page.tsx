"use client";
import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { ButtonCustom } from '@/components/ButtonCustom';
import { ProductCard } from '@/components/ProductCard';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getProductById, getProductsByCategory, getCategoryBySlug } from '@/lib/data';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '1';

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Touch swipe state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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

  const totalImages = product.images.length;
  const category = getCategoryBySlug(product.category);
  const relatedProducts = getProductsByCategory(product.category).filter(p => p.id !== id).slice(0, 3);

  const goNext = () => setActiveImg(prev => (prev + 1) % totalImages);
  const goPrev = () => setActiveImg(prev => (prev - 1 + totalImages) % totalImages);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

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

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    }, quantity);
    router.push('/checkout');
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
            {/* Main image — swipeable */}
            <div
              className="relative aspect-square bg-white shadow-lg overflow-hidden select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={product.images[activeImg]}
                alt={`${product.name} — foto ${activeImg + 1}`}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Arrow buttons */}
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
                aria-label="Foto precedente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
                aria-label="Foto successiva"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>

              {/* Counter */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                {activeImg + 1} / {totalImages}
              </div>

              {product.isWow && (
                <div className="absolute top-4 left-4 bg-brand-rust text-pure-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">
                  BESTSELLER
                </div>
              )}
              {product.compareAtPrice && (
                <div className="absolute top-4 right-4 bg-deep-black text-pure-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">
                  -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </div>
              )}
            </div>

            {/* Thumbnails — grid on desktop, scrollable flex on mobile */}
            <div className="flex gap-2 overflow-x-auto md:grid md:grid-cols-5 lg:grid-cols-6 md:overflow-y-auto max-h-72 pb-2 pr-1 scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImg(i)}
                  className={`relative shrink-0 w-[72px] h-[72px] md:w-auto md:aspect-square bg-white border-2 transition-all duration-200 ${
                    i === activeImg ? 'border-brand-rust shadow-md ring-2 ring-brand-rust/20' : 'border-transparent hover:border-brand-rust/40'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} — miniatura ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                    quality={60}
                    loading="lazy"
                  />
                </button>
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
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
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

              {/* Free shipping dynamic badge */}
              {(product.price * quantity) >= 150 ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-sm">
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-green-800">
                    Spedizione Gratuita Inclusa per questo ordine!
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-brand-rust/5 border border-brand-rust/20 px-4 py-3 rounded-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-deep-black flex items-center gap-2">
                    <span>🚚</span> Spedizione Gratuita da 150€
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-rust">
                    Mancano solo {150 - (product.price * quantity)} €
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {/* Primary Fast Action: ACQUISTA ORA */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full h-16 bg-brand-rust text-white font-bold uppercase tracking-[0.15em] text-sm rounded-sm shadow-lg hover:bg-brand-rust/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>ACQUISTA ORA — {product.price * quantity} €</span>
              </button>

              {/* Secondary Action: AGGIUNGI AL CARRELLO */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border-2 border-deep-black h-14 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 hover:text-brand-rust transition-colors font-bold text-lg"
                  >-</button>
                  <span className="flex-1 text-center font-bold min-w-[3rem] text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-4 hover:text-brand-rust transition-colors font-bold text-lg"
                  >+</button>
                </div>
                <ButtonCustom
                  variant="outline"
                  className="flex-1 h-14 !border-2 !border-deep-black !text-deep-black hover:!bg-deep-black hover:!text-white font-bold tracking-widest text-xs uppercase transition-colors"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {addedToCart ? '✓ Aggiunto al Carrello' : '🛒 Aggiungi al carrello'}
                </ButtonCustom>
              </div>
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
