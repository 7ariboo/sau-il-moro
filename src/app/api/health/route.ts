import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'healthy',
    version: '1.0.0',
    name: 'Sau Il Moro E-Commerce API',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/products',
      productDetail: '/api/products/:id',
      categories: '/api/categories',
      orders: '/api/orders',
      newsletter: '/api/newsletter',
      health: '/api/health',
    },
  });
}
