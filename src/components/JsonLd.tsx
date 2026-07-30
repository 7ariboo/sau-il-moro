import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sau Il Moro',
    legalName: 'Near di Diana Gabriele',
    url: 'https://sauilmoro.it',
    logo: 'https://sauilmoro.it/images/firma.png',
    vatID: 'IT14470190969',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@sauilmoro.it',
      contactType: 'customer service',
      availableLanguage: ['Italian', 'English'],
    },
    sameAs: [
      'https://www.instagram.com/sauilmoro',
      'https://www.facebook.com/sauilmoro',
    ],
  };
}

export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sau Il Moro',
    url: 'https://sauilmoro.it',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://sauilmoro.it/category/ferro?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getProductJsonLd(product: {
  name: string;
  description: string;
  images: string[];
  price: number;
  slug?: string;
  id: string;
  inStock?: boolean;
}) {
  const baseUrl = 'https://sauilmoro.it';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(img => (img.startsWith('http') ? img : `${baseUrl}${img}`)),
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Sau Il Moro',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug || product.id}`,
      priceCurrency: 'EUR',
      price: product.price,
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Sau Il Moro',
      },
    },
  };
}
