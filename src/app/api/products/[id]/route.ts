import { NextResponse } from 'next/server';
import { getProductById, getProductsByCategory } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json(
      { success: false, error: 'Prodotto non trovato' },
      { status: 404 }
    );
  }

  // Get related products from the same category (exclude current)
  const related = getProductsByCategory(product.category)
    .filter(p => p.id !== id)
    .slice(0, 4);

  return NextResponse.json({
    success: true,
    data: product,
    related,
  });
}
