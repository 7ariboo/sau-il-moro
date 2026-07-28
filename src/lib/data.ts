import { Product, Category, Order, DiscountCode } from './types';

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
    name: 'Arburesa',
    slug: 'arburesa',
    price: 120,
    description: 'Essenziale, robusta e senza fronzoli. L\'Arburesa nasce dalla tradizione dei pastori sardi, pensata per chi ha bisogno di un coltello affidabile in ogni situazione.\n\nUna linea pulita, una lama affilata e un\'impugnatura che trasmette subito solidità. È uno di quei coltelli che non stanno in vetrina: stanno in tasca, pronti a fare il loro lavoro.\n\nChe tu sia davanti alla brace, in campagna o semplicemente ami gli oggetti fatti come una volta, l\'Arburesa è un pezzo di Sardegna da portare sempre con te.',
    shortDescription: 'La tradizione sarda da portare sempre con te.',
    images: [
      '/images/1/DSC09907.jpg',
      '/images/1/DSC09910.jpg',
      '/images/1/DSC09912.jpg',
      '/images/1/DSC09943.jpg',
      '/images/1/DSC09944.jpg',
      '/images/1/DSC09945.jpg',
      '/images/1/DSC09948.jpg',
      '/images/1/DSC09949.jpg',
    ],
    category: 'ferro',
    material: 'Acciaio e Corno',
    tags: ['artigianato', 'coltelli', 'tradizione', 'pastore'],
    isWow: true,
    inStock: true,
    stockQuantity: 5,
    details: [
      { label: 'Tipologia', value: 'Coltello a serramanico' },
      { label: 'Tradizione', value: 'Pastorale sarda' },
      { label: 'Provenienza', value: 'Sardegna, Italia' },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Galluresa',
    slug: 'galluresa',
    price: 135,
    description: 'Compatta, resistente e pronta all\'uso. La Galluresa rappresenta la tradizione del nord della Sardegna, con un design deciso e una presa sicura.\n\nÈ il coltello ideale per chi cerca affidabilità, semplicità e uno stile che racconta una terra fatta di granito, vento e fuoco.\n\nNon è solo un coltello: è un pezzo di Sardegna che puoi tenere sempre con te.',
    shortDescription: 'Carattere forte, anima sarda.',
    images: [
      '/images/2/DSC09914.jpg',
      '/images/2/DSC09916.jpg',
      '/images/2/DSC09918.jpg',
      '/images/2/DSC09920.jpg',
      '/images/2/DSC09960.jpg',
      '/images/2/DSC09961.jpg',
      '/images/2/DSC09962.jpg',
      '/images/2/DSC09963.jpg',
      '/images/2/DSC09964.jpg',
      '/images/2/DSC09966.jpg',
    ],
    category: 'ferro',
    material: 'Acciaio e Corno',
    tags: ['artigianato', 'coltelli', 'gallura', 'tradizione'],
    isWow: true,
    inStock: true,
    stockQuantity: 4,
    details: [
      { label: 'Tipologia', value: 'Coltello a serramanico' },
      { label: 'Tradizione', value: 'Gallurese' },
      { label: 'Provenienza', value: 'Sardegna, Italia' },
    ],
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Pattadese',
    slug: 'pattadese',
    price: 150,
    description: 'Tra i coltelli più iconici della Sardegna, la Pattadese è riconoscibile al primo sguardo grazie alla sua lama sottile e slanciata.\n\nUnisce precisione, leggerezza ed eleganza, mantenendo tutto il carattere della coltelleria artigianale sarda. È il coltello perfetto per chi apprezza la tradizione, ma pretende anche praticità e qualità.\n\nUn classico senza tempo, costruito per durare e accompagnarti ovunque.',
    shortDescription: 'L\'eleganza della tradizione sarda.',
    images: [
      '/images/3/DSC09922.jpg',
      '/images/3/DSC09924.jpg',
      '/images/3/DSC09951.jpg',
      '/images/3/DSC09952.jpg',
      '/images/3/DSC09953.jpg',
      '/images/3/DSC09954.jpg',
      '/images/3/DSC09955.jpg',
      '/images/3/DSC09956.jpg',
      '/images/3/DSC09957.jpg',
    ],
    category: 'ferro',
    material: 'Acciaio e Corno',
    tags: ['artigianato', 'coltelli', 'pattada', 'eleganza'],
    isWow: true,
    inStock: true,
    stockQuantity: 3,
    details: [
      { label: 'Tipologia', value: 'Coltello a serramanico' },
      { label: 'Tradizione', value: 'Pattadese' },
      { label: 'Provenienza', value: 'Sardegna, Italia' },
    ],
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Coltello Salvezza',
    slug: 'coltello-salvezza',
    price: 25,
    description: 'Da una semplice scheda… a un vero coltello.\n\nIl Coltello Salvezza è pensato per chi vuole avere una lama sempre a disposizione senza occupare spazio. Chiuso ha le dimensioni di una normale carta da portafoglio; in pochi secondi si trasforma in un pratico coltello pieghevole.\n\nPerfetto da tenere nel portafoglio, nello zaino, in auto o nell\'attrezzatura da outdoor.\n\nCompatto, leggero e sorprendentemente funzionale, è l\'accessorio ideale per affrontare le piccole situazioni quotidiane in cui avere una lama può fare la differenza.\n\nPerché le cose migliori sono quelle che hai con te quando servono.',
    shortDescription: 'Sempre con te, quando serve davvero.',
    images: [
      '/images/4/DSC09939.jpg',
      '/images/4/DSC09941.jpg',
      '/images/4/DSC09977.jpg',
      '/images/4/DSC09979.jpg',
      '/images/4/DSC09981.jpg',
      '/images/4/DSC09986.jpg',
      '/images/4/DSC09988.jpg',
    ],
    category: 'ferro',
    material: 'Acciaio Inox',
    tags: ['coltelli', 'edc', 'portafoglio', 'outdoor'],
    isWow: false,
    inStock: true,
    stockQuantity: 20,
    details: [
      { label: 'Tipologia', value: 'Coltello pieghevole tascabile' },
      { label: 'Formato chiuso', value: 'Dimensione carta di credito' },
      { label: 'Provenienza', value: 'Sardegna, Italia' },
    ],
    createdAt: '2024-01-04T00:00:00Z',
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
