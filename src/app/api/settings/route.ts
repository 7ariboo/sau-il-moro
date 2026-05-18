import { NextResponse } from 'next/server';
import { INTEGRATION_SETTINGS, updateIntegrationSettings } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ success: true, data: INTEGRATION_SETTINGS });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const newSettings = updateIntegrationSettings(body);
    return NextResponse.json({ success: true, data: newSettings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Errore durante l\'aggiornamento delle impostazioni' }, { status: 500 });
  }
}
