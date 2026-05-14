import { NextResponse } from 'next/server';
import { PRODUCTS, searchProducts, addProduct, deleteProduct, updateProduct } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const material = searchParams.get('material');
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let products = [...PRODUCTS];

  // Filter by category
  if (category) {
    products = products.filter(p => p.category === category);
  }

  // Filter by material
  if (material) {
    products = products.filter(p => p.material.toLowerCase().includes(material.toLowerCase()));
  }

  // Search
  if (search) {
    products = searchProducts(search);
  }

  // Sort
  switch (sort) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
    default:
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Pagination
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedProducts = products.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = addProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Errore nella creazione' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    const product = updateProduct(id, updates);
    if (!product) return NextResponse.json({ success: false, error: 'Prodotto non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Errore nell\'aggiornamento' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID mancante' }, { status: 400 });

    const deleted = deleteProduct(id);
    if (!deleted) return NextResponse.json({ success: false, error: 'Prodotto non trovato' }, { status: 404 });

    return NextResponse.json({ success: true, data: deleted });
  } catch {
    return NextResponse.json({ success: false, error: 'Errore nella cancellazione' }, { status: 500 });
  }
}
