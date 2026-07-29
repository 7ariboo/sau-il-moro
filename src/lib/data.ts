import { Product, Category, Order, DiscountCode, IntegrationSettings } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'ferro',
    name: 'FERRO',
    description: 'L\'arte della forgia sarda. Coltelli fatti a mano, lame forgiate e oggetti in ferro battuto.',
    image: '/images/Sfondo/coltello.png',
  },
  {
    id: 'cat-2',
    slug: 'legno',
    name: 'LEGNO',
    description: 'Il calore delle essenze sarde secolari. Taglieri, manici e oggetti in rovere, olivastro e castagno.',
    image: '/images/Sfondo/capretta.png',
  },
  {
    id: 'cat-3',
    slug: 'terra',
    name: 'TERRA',
    description: 'L\'argilla e l\'intreccio, radici di un popolo. Ceramiche e cestini della tradizione barbaricina.',
    image: '/images/Sfondo/mare.png',
  },
  {
    id: 'cat-4',
    slug: 'carne',
    name: 'CARNE',
    description: 'I sapori decisi della Barbagia. Salumi, pancetta e prodotti tipici della norcineria sarda.',
    image: '/images/Sfondo/salumi.png',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: '5',
    name: 'Bundle Sau Il Moro',
    slug: 'bundle-sau-il-moro',
    price: 360,
    compareAtPrice: 424,
    description: 'Il set completo definitivo di Sau Il Moro. Include i 4 pezzi iconici della nostra collezione artigianale:\n\n• Arburesa (120€)\n• Pattadese (150€)\n• Galluresa (130€)\n• Coltello Salvezza (24€)\n\nValore totale: 424€ — Tuo a soli 360€ con un risparmio immediato di 64€!\n\nLa Sardegna non si racconta. Si porta con sé. Ogni coltello racchiude tradizione, carattere e il sapere di una terra che ha fatto della semplicità una forza. Costruiti per durare, pensati per essere usati. Proprio come piace a Sau il Moro.',
    shortDescription: 'Arburesa + Pattadese + Gallurese + Coltello Salvezza (Risparmi 64€)',
    images: [
      '/images/5/DSC09968.jpg',
      '/images/5/DSC09969.jpg',
      '/images/5/DSC09970.jpg',
      '/images/5/DSC09972.jpg',
      '/images/5/DSC09973.jpg',
      '/images/5/DSC09974.jpg',
      '/images/5/DSC09975.jpg',
      '/images/4/DSC09986.jpg',
      '/images/4/DSC09939.jpg',
      '/images/4/DSC09941.jpg',
      '/images/4/DSC09977.jpg',
    ],
    category: 'ferro',
    material: 'Acciaio, Corno e Inox',
    tags: ['bundle', 'offerta', 'coltelli', 'set completo', 'risparmio'],
    isWow: true,
    inStock: true,
    stockQuantity: 10,
    details: [
      { label: 'Contenuto', value: '4 Coltelli Artigianali Sardi' },
      { label: 'Prodotti inclusi', value: 'Arburesa, Pattadese, Galluresa, Coltello Salvezza' },
      { label: 'Risparmio', value: '64 € (Valore 424 €)' },
      { label: 'Provenienza', value: 'Sardegna, Italia' },
    ],
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '1',
    name: 'Arburesa',
    slug: 'arburesa',
    price: 120,
    description: 'Essenziale, robusta e senza fronzoli. L\'Arburesa nasce dalla tradizione dei pastori sardi, pensata per chi ha bisogno di un coltello affidabile in ogni situazione.\n\nUna linea pulita, una lama affilata e un\'impugnatura che trasmette subito solidità. È uno di quei coltelli che non stanno in vetrina: stanno in tasca, pronti a fare il loro lavoro.\n\nChe tu sia davanti alla brace, in campagna o semplicemente ami gli oggetti fatti come una volta, l\'Arburesa è un pezzo di Sardegna da portare sempre con te.',
    shortDescription: 'La tradizione sarda da portare sempre con te.',
    images: [
      '/images/1/DSC09943.jpg',
      '/images/1/DSC09907.jpg',
      '/images/1/DSC09910.jpg',
      '/images/1/DSC09912.jpg',
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
    id: '3',
    name: 'Pattadese',
    slug: 'pattadese',
    price: 150,
    description: 'Tra i coltelli più iconici della Sardegna, la Pattadese è riconoscibile al primo sguardo grazie alla sua lama sottile e slanciata.\n\nUnisce precisione, leggerezza ed eleganza, mantenendo tutto il carattere della coltelleria artigianale sarda. È il coltello perfetto per chi apprezza la tradizione, ma pretende anche praticità e qualità.\n\nUn classico senza tempo, costruito per durare e accompagnarti ovunque.',
    shortDescription: 'L\'eleganza della tradizione sarda.',
    images: [
      '/images/3/DSC09953.jpg',
      '/images/3/DSC09922.jpg',
      '/images/3/DSC09924.jpg',
      '/images/3/DSC09951.jpg',
      '/images/3/DSC09952.jpg',
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
    id: '2',
    name: 'Galluresa',
    slug: 'galluresa',
    price: 130,
    description: 'Compatta, resistente e pronta all\'uso. La Galluresa rappresenta la tradizione del nord della Sardegna, con un design deciso e una presa sicura.\n\nÈ il coltello ideale per chi cerca affidabilità, semplicità e uno stile che racconta una terra fatta di granito, vento e fuoco.\n\nNon è solo un coltello: è un pezzo di Sardegna che puoi tenere sempre con te.',
    shortDescription: 'Carattere forte, anima sarda.',
    images: [
      '/images/2/DSC09920.jpg',
      '/images/2/DSC09914.jpg',
      '/images/2/DSC09916.jpg',
      '/images/2/DSC09918.jpg',
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
    id: '4',
    name: 'Coltello Salvezza',
    slug: 'coltello-salvezza',
    price: 24,
    description: 'Da una semplice scheda… a un vero coltello.\n\nIl Coltello Salvezza è pensato per chi vuole avere una lama sempre a disposizione senza occupare spazio. Chiuso ha le dimensioni di una normale carta da portafoglio; in pochi secondi si trasforma in un pratico coltello pieghevole.\n\nPerfetto da tenere nel portafoglio, nello zaino, in auto o nell\'attrezzatura da outdoor.\n\nCompatto, leggero e sorprendentemente funzionale, è l\'accessorio ideale per affrontare le piccole situazioni quotidiane in cui avere una lama può fare la differenza.\n\nPerché le cose migliori sono quelle che hai con te quando servono.',
    shortDescription: 'Sempre con te, quando serve davvero.',
    images: [
      '/images/4/DSC09986.jpg',
      '/images/4/DSC09939.jpg',
      '/images/4/DSC09941.jpg',
      '/images/4/DSC09977.jpg',
      '/images/4/DSC09979.jpg',
      '/images/4/DSC09981.jpg',
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

export function generateOrderId(): string {
  return `SM-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter(p => p.category === categorySlug);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
}

export function addProduct(newProduct: Omit<Product, 'id' | 'createdAt'>): Product {
  const p: Product = {
    ...newProduct,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  PRODUCTS.push(p);
  return p;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const idx = PRODUCTS.findIndex(p => p.id === id);
  if (idx === -1) return null;
  PRODUCTS[idx] = { ...PRODUCTS[idx], ...updates };
  return PRODUCTS[idx];
}

export function deleteProduct(id: string): boolean {
  const idx = PRODUCTS.findIndex(p => p.id === id);
  if (idx === -1) return false;
  PRODUCTS.splice(idx, 1);
  return true;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

export const newsletterSubscribers: { email: string; subscribedAt: string }[] = [];

export const DISCOUNT_CODES: DiscountCode[] = [
  { code: 'SAUMORO10', type: 'percentage', value: 10 },
  { code: 'BENVENUTO', type: 'fixed', value: 15, minSubtotal: 50 },
];

export function addDiscountCode(codeData: DiscountCode): DiscountCode {
  DISCOUNT_CODES.push(codeData);
  return codeData;
}

export function deleteDiscountCode(code: string): boolean {
  const idx = DISCOUNT_CODES.findIndex(d => d.code === code);
  if (idx === -1) return false;
  DISCOUNT_CODES.splice(idx, 1);
  return true;
}

export const INTEGRATION_SETTINGS: IntegrationSettings = {
  stripePublicKey: '',
  stripeSecretKey: '',
  paypalClientId: '',
  mailchimpApiKey: '',
  mailchimpListId: '',
  brevoApiKey: '',
  metaPixelId: '',
  googleAnalyticsId: '',
};

export function updateIntegrationSettings(updates: Partial<IntegrationSettings>): IntegrationSettings {
  Object.assign(INTEGRATION_SETTINGS, updates);
  return INTEGRATION_SETTINGS;
}
