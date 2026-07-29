"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  imagePosition?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, image, imagePosition = 'object-center' }) => {
  const isAvailable = id === 'ferro';

  if (!isAvailable) {
    return (
      <div className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-deep-black shadow-lg cursor-not-allowed opacity-85 select-none">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover ${imagePosition} filter grayscale-[30%] brightness-75`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />

        <div className="absolute top-6 left-6 right-6">
          <h3 className="text-pure-white/90 text-3xl font-display tracking-widest uppercase">
            {name}
          </h3>
          <div className="mt-3 inline-block bg-brand-rust/90 text-white text-[9px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-sm shadow-md">
            Prossimamente
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/category/${id}`} className="group relative block aspect-[3/4] overflow-hidden rounded-lg bg-deep-black shadow-lg">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover ${imagePosition} transition-all duration-700 group-hover:scale-105 group-hover:brightness-90`}
      />
      {/* Subtle overlay gradient at the top for title legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

      <div className="absolute top-6 left-6 right-6">
        <h3 className="text-pure-white text-3xl font-display tracking-widest drop-shadow-md uppercase">
          {name}
        </h3>
        <p className="text-white/80 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">
          Scopri la collezione &rarr;
        </p>
      </div>

      <div className="absolute inset-0 border-0 border-brand-rust/40 transition-all duration-500 group-hover:border-[6px] rounded-lg" />
    </Link>
  );
};
