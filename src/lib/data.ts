import { Product, Category, Order } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'ferro',
    name: 'FERRO',
    description: 'L\'arte della forgia sarda. Coltelli fatti a mano, lame forgiate e oggetti in ferro battuto.',
    image: '/images/sardinian_forged_knife_ferro_1778776655712.png',
  },
  {
    id: 'cat-2',
    slug: 'legno',
    name: 'LEGNO',
    description: 'Il calore delle essenze sarde secolari. Taglieri, manici e oggetti in rovere, olivastro e castagno.',
    image: '/images/sardinian_carved_wood_legno_1778776910441.png',
  },
  {
    id: 'cat-3',
    slug: 'terra',
    name: 'TERRA',
    description: 'L\'argilla e l\'intreccio, radici di un popolo. Ceramiche e cestini della tradizione barbaricina.',
    image: '/images/sardinian_ceramics_terra_1778777114216.png',
  },
  {
    id: 'cat-4',
    slug: 'carne',
    name: 'CARNE',
    description: 'I sapori decisi della Barbagia. Salumi, pancetta e prodotti tipici della norcineria sarda.',
    image: '/images/sardinian_food_carne_salsiccia_1778777826833.png',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Leppa Sarda Tradizionale',
    slug: 'leppa-sarda-tradizionale',
    price: 180,
    description: 'Coltello artigianale sardo con lama in acciaio Damasco e manico in corno di montone intagliato a mano. Un pezzo unico che racchiude millenni di storia e tradizione barbaricina.',
    shortDescription: 'Lama in Damasco, manico in corno.',
    images: ['/images/sardinian_forged_knife_ferro_1778776655712.png'],
    category: 'ferro',
    material: 'Acciaio e Corno',
    tags: ['artigianato', 'coltelli', 'tradizione'],
    isWow: true,
    inStock: true,
    stockQuantity: 5,
    details: [
      { label: 'Lunghezza Lama', value: '12 cm' },
      { label: 'Acciaio', value: 'Damasco 64 strati' },
      { label: 'Manico', value: 'Corno di Montone' },
      { label: 'Provenienza', value: 'Sardegna, Italia' },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Tagliere in Olivastro',
    slug: 'tagliere-in-olivastro',
    price: 85,
    description: 'Tagliere realizzato da un unico pezzo di legno di olivastro sardo. La venatura naturale rende ogni pezzo irripetibile. Trattato con oli naturali per alimenti.',
    shortDescription: 'Legno di olivastro secolare.',
    images: ['/images/sardinian_carved_wood_legno_1778776910441.png'],
    category: 'legno',
    material: 'Legno di Olivastro',
    tags: ['cucina', 'arredamento', 'legno'],
    isWow: false,
    inStock: true,
    stockQuantity: 12,
    details: [
      { label: 'Dimensioni', value: '40x25 cm' },
      { label: 'Essenza', value: 'Olivastro Sardo' },
      { label: 'Trattamento', value: 'Olio di Lino' },
    ],
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Vaso in Ceramica Decorata',
    slug: 'vaso-ceramica-decorata',
    price: 120,
    description: 'Vaso in ceramica foggiato al tornio e decorato a mano con motivi geometrici tipici della tradizione nuorese. Cottura a gran fuoco.',
    shortDescription: 'Decorato a mano, tradizione nuorese.',
    images: ['/images/sardinian_ceramics_terra_1778777114216.png'],
    category: 'terra',
    material: 'Ceramica',
    tags: ['ceramica', 'arte', 'casa'],
    isWow: true,
    inStock: true,
    stockQuantity: 8,
    details: [
      { label: 'Altezza', value: '30 cm' },
      { label: 'Tecnica', value: 'Ingobbio e Incisione' },
    ],
    createdAt: '2024-01-03T00:00:00Z',
  },
];

// ─── Orders ────────────────────────────────────────────────────────────

export const orders: Order[] = [];

export function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ─── Newsletter ────────────────────────────────────────────────────────

export const newsletterSubscribers: { email: string; subscribedAt: string }[] = [];

// ─── Discounts ──────────────────────────────────────────────────────────

export const DISCOUNT_CODES: DiscountCode[] = [
  { code: 'SAUMORO10', type: 'percentage', value: 10, minSubtotal: 0 },
];

export function addDiscountCode(discount: DiscountCode) {
  DISCOUNT_CODES.push(discount);
  return discount;
}

export function deleteDiscountCode(code: string) {
  const index = DISCOUNT_CODES.findIndex(d => d.code === code);
  if (index !== -1) {
    return DISCOUNT_CODES.splice(index, 1)[0];
  }
  return null;
}

// ─── Settings ──────────────────────────────────────────────────────────

import { IntegrationSettings } from './types';

export let INTEGRATION_SETTINGS: IntegrationSettings = {
  stripePublicKey: '',
  stripeSecretKey: '',
  paypalClientId: '',
  mailchimpApiKey: '',
  mailchimpListId: '',
  brevoApiKey: '',
  metaPixelId: '',
  googleAnalyticsId: '',
};

export function updateIntegrationSettings(newSettings: Partial<IntegrationSettings>) {
  INTEGRATION_SETTINGS = { ...INTEGRATION_SETTINGS, ...newSettings };
  return INTEGRATION_SETTINGS;
}

// ─── Helpers ───────────────────────────────────────────────────────────

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

// ─── Data Modification ────────────────────────────────────────────────

export function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'slug'>) {
  const newProduct: Product = {
    ...product,
    id: (PRODUCTS.length + 1).toString(),
    slug: product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
    createdAt: new Date().toISOString(),
  };
  PRODUCTS.unshift(newProduct);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index !== -1) {
    PRODUCTS[index] = { ...PRODUCTS[index], ...updates };
    return PRODUCTS[index];
  }
  return null;
}

export function deleteProduct(id: string) {
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index !== -1) {
    const deleted = PRODUCTS.splice(index, 1);
    return deleted[0];
  }
  return null;
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}
