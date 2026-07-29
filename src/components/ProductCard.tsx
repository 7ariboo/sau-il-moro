"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  slug?: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  isWow?: boolean;
  material?: string;
  badge?: string;
  showCart?: boolean;
  compareAtPrice?: number;
  darkTheme?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, slug, name, price, image, images, isWow, material, showCart, compareAtPrice, darkTheme }) => {
  const { addItem } = useCart();
  const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const allImages = images && images.length > 0 ? images : [image || '/images/ferro.png'];
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const totalImages = allImages.length;

  const goNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setActiveIdx(prev => (prev + 1) % totalImages);
  };
  const goPrev = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setActiveIdx(prev => (prev - 1 + totalImages) % totalImages);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div className="group relative flex flex-col">
      {/* Image Container Link */}
      <Link
        href={`/products/${productSlug}`}
        className="relative block aspect-square overflow-hidden bg-white rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-500 mb-4 select-none cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {allImages.map((img, idx) => (
          <Image
            key={img}
            src={img}
            alt={`${name} — foto ${idx + 1}`}
            fill
            className={`object-cover p-2 transition-all duration-500 group-hover:scale-105 ${
              idx === activeIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={80}
          />
        ))}

        {/* Arrows on hover (desktop) */}
        {totalImages > 1 && (
          <div className="hidden md:block">
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 text-deep-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md text-sm font-bold"
              aria-label="Foto precedente"
            >
              &larr;
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 text-deep-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md text-sm font-bold"
              aria-label="Foto successiva"
            >
              &rarr;
            </button>
          </div>
        )}

        {/* Dot indicators */}
        {totalImages > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {allImages.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className={`block w-1.5 h-1.5 rounded-full transition-all ${
                  i === activeIdx ? 'bg-brand-rust scale-125' : 'bg-black/20'
                }`}
              />
            ))}
            {totalImages > 5 && (
              <span className="block w-1.5 h-1.5 rounded-full bg-black/10" />
            )}
          </div>
        )}

        {isWow && (
          <div className="absolute top-3 left-3 bg-brand-rust text-pure-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest z-10">
            WOW
          </div>
        )}

        {compareAtPrice && (
          <div className="absolute top-3 right-3 bg-deep-black text-pure-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest z-10">
            -{Math.round((1 - price / compareAtPrice) * 100)}%
          </div>
        )}

        {showCart && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem({ id, name, price, image: allImages[0] }, 1);
            }}
            className="absolute bottom-3 left-3 w-11 h-11 bg-brand-rust text-pure-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-deep-black transition-all z-20"
            aria-label="Aggiungi al carrello"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </button>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <Link href={`/products/${productSlug}`}>
          <h3 className={`text-base font-display font-bold uppercase tracking-tight transition-colors ${
            darkTheme ? 'text-white hover:text-brand-rust' : 'text-deep-black hover:text-brand-rust'
          }`}>
            {name}
          </h3>
        </Link>
        {material && (
          <p className={`text-[10px] uppercase tracking-widest font-bold ${
            darkTheme ? 'text-white/60' : 'text-deep-black/40'
          }`}>{material}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-lg font-display font-bold ${
            darkTheme ? 'text-white' : 'text-deep-black'
          }`}>{price} €</span>
          {compareAtPrice && (
            <span className={`text-sm font-display line-through ${
              darkTheme ? 'text-white/40' : 'text-deep-black/30'
            }`}>{compareAtPrice} €</span>
          )}
        </div>
      </div>
    </div>
  );
};

