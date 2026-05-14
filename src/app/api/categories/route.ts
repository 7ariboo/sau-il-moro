import { NextResponse } from 'next/server';
import { CATEGORIES, getProductsByCategory } from '@/lib/data';

export async function GET() {
  const categoriesWithCount = CATEGORIES.map(cat => ({
    ...cat,
    productCount: getProductsByCategory(cat.slug).length,
  }));

  return NextResponse.json({
    success: true,
    data: categoriesWithCount,
  });
}
