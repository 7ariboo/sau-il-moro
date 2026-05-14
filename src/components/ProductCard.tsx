"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  isWow?: boolean;
  material?: string;
  badge?: string;
  showCart?: boolean;
  compareAtPrice?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, images, isWow, material, showCart, compareAtPrice }) => {
  const { addItem } = useCart();
  const imgSrc = image || (images && images[0]) || '/images/ferro.png';

  return (
    <div className="group relative flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-white rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-500 mb-4">
        <Link href={`/products/${id}`}>
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover p-2 transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {isWow && (
          <div className="absolute top-3 left-3 bg-brand-rust text-pure-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest">
            WOW
          </div>
        )}

        {compareAtPrice && (
          <div className="absolute top-3 right-3 bg-deep-black text-pure-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest">
            -{Math.round((1 - price / compareAtPrice) * 100)}%
          </div>
        )}

        {showCart && (
          <button
            onClick={() => addItem({ id, name, price, image: imgSrc }, 1)}
            className="absolute bottom-3 left-3 w-11 h-11 bg-brand-rust text-pure-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-deep-black transition-all z-10"
            aria-label="Aggiungi al carrello"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <Link href={`/products/${id}`}>
          <h3 className="text-base font-display font-bold uppercase tracking-tight text-deep-black hover:text-brand-rust transition-colors">
            {name}
          </h3>
        </Link>
        {material && (
          <p className="text-[10px] text-deep-black/40 uppercase tracking-widest font-bold">{material}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-display text-deep-black font-bold">{price} €</span>
          {compareAtPrice && (
            <span className="text-sm font-display text-deep-black/30 line-through">{compareAtPrice} €</span>
          )}
        </div>
      </div>
    </div>
  );
};
