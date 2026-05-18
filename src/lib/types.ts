export interface ProductVariant {
  id: string;
  name: string; // e.g. "Grigio", "42"
  price?: number; // Override price if different
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number; // For discounts
  description: string;
  shortDescription: string;
  images: string[];
  category: string;
  material: string;
  tags: string[];
  isWow: boolean;
  inStock: boolean;
  stockQuantity: number;
  variants?: ProductVariant[];
  details: { label: string; value: string }[];
  createdAt: string;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSubtotal?: number;
}

export interface Order {
  id: string;
  userId?: string;
  customer: {
    name: string;
    surname: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discountTotal: number;
  discountCode?: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'restocked';
  paymentStatus: 'unpaid' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paypal' | 'bank_transfer';
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: 'user' | 'admin';
  phone?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  surname: string;
  street: string;
  city: string;
  zip: string;
  isDefault: boolean;
}

export interface IntegrationSettings {
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  mailchimpApiKey: string;
  mailchimpListId: string;
  brevoApiKey: string;
  metaPixelId: string;
  googleAnalyticsId: string;
}
