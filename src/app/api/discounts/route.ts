import { NextResponse } from 'next/server';
import { DISCOUNT_CODES, addDiscountCode, deleteDiscountCode } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ success: true, data: DISCOUNT_CODES });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code || !body.value) {
      return NextResponse.json({ success: false, error: 'Dati mancanti' }, { status: 400 });
    }
    const newDiscount = addDiscountCode({
      code: body.code.toUpperCase(),
      type: body.type,
      value: parseFloat(body.value),
      minSubtotal: body.minSubtotal ? parseFloat(body.minSubtotal) : 0,
    });
    return NextResponse.json({ success: true, data: newDiscount }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Errore nella creazione' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (!code) return NextResponse.json({ success: false, error: 'Codice mancante' }, { status: 400 });
    const deleted = deleteDiscountCode(code);
    if (!deleted) return NextResponse.json({ success: false, error: 'Codice non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: deleted });
  } catch {
    return NextResponse.json({ success: false, error: 'Errore nella cancellazione' }, { status: 500 });
  }
}
