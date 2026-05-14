"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, image }) => {
  return (
    <Link href={`/category/${id}`} className="group relative block aspect-[3/4] overflow-hidden bg-deep-black">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
      />
      <div className="absolute top-4 left-6">
        <h3 className="text-pure-white text-4xl font-display tracking-wider drop-shadow-lg">
          {name}
        </h3>
      </div>
      <div className="absolute inset-0 border-0 border-brand-rust/20 transition-all duration-500 group-hover:border-[8px]" />
    </Link>
  );
};
