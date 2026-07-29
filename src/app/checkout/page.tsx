"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { ButtonCustom } from '@/components/ButtonCustom';
import { ItalianCityAutocomplete } from '@/components/ItalianCityAutocomplete';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Shipping Form Data
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    shippingNotes: '',
  });

  // Invoice / Fatturazione Form Data
  const [requestInvoice, setRequestInvoice] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'private' | 'business'>('private');
  const [invoiceData, setInvoiceData] = useState({
    codiceFiscale: '',
    ragioneSociale: '',
    partitaIva: '',
    sdiOrPec: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        name: user.name || prev.name,
        surname: user.surname || prev.surname,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        zip: user.zip || prev.zip,
      }));
    }
  }, [user]);

  const shippingCost = subtotal >= 150 ? 0 : 15;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    if (requestInvoice) {
      if (invoiceType === 'private' && !invoiceData.codiceFiscale.trim()) {
        setError('Inserisci il Codice Fiscale per la fatturazione.');
        setIsProcessing(false);
        return;
      }
      if (invoiceType === 'business' && (!invoiceData.ragioneSociale.trim() || !invoiceData.partitaIva.trim())) {
        setError('Inserisci Ragione Sociale e Partita IVA per la fatturazione aziendale.');
        setIsProcessing(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
          customer: {
            email: formData.email,
            name: formData.name,
            surname: formData.surname,
            phone: formData.phone,
          },
          shipping: {
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
            country: 'Italia',
            notes: formData.shippingNotes,
          },
          invoice: requestInvoice ? {
            type: invoiceType,
            ...invoiceData
          } : null,
        }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
            customer: {
              email: formData.email,
              name: formData.name,
              surname: formData.surname,
              phone: formData.phone,
            },
            shipping: {
              address: formData.address,
              city: formData.city,
              zip: formData.zip,
              country: 'Italia',
              notes: formData.shippingNotes,
            },
            invoice: requestInvoice ? {
              type: invoiceType,
              ...invoiceData
            } : null,
            total,
            status: 'completed',
          }),
        });

        const orderData = await orderRes.json();
        if (orderData.success) {
          window.location.href = `/checkout/success?orderId=${orderData.orderId}`;
        } else {
          setError('Impossibile completare il pagamento al momento. Riprova.');
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError('Errore di connessione durante il checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-stone-texture">
        <Header />
        <div className="container mx-auto px-6 pt-40 pb-24 text-center">
          <h1 className="text-3xl font-display uppercase mb-4">Il tuo carrello è vuoto</h1>
          <p className="text-sm text-gray-500 mb-8 uppercase tracking-widest font-bold">Aggiungi un pezzo iconico prima di procedere al checkout.</p>
          <Link href="/">
            <ButtonCustom>Esplora le Collezioni</ButtonCustom>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />

      <div className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-wider">
              Checkout Rapido
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-rust mt-1">
              ⚡ Acquisto in 1 pagina — Spedizione in tutta Italia
            </p>
          </div>
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-rust">
            &larr; Torna allo shopping
          </Link>
        </div>

        <form onSubmit={handleSubmitCheckout} className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form principale (8 Colonne) */}
          <div className="lg:col-span-7 space-y-8 bg-white p-8 border border-gray-100 shadow-sm">
            
            {/* 1. Dati di Contatto & Spedizione */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-display uppercase tracking-widest text-deep-black">
                  1. Dati di Spedizione Pacco
                </h2>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Inserisci l&apos;indirizzo dove il corriere consegnerà il pacco
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Cognome *"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Telefono per il Corriere (+39 ...) *"
                  name="phone"
                  type="tel"
                  placeholder="+39 333 1234567"
                  pattern="^[+0-9\s-]{6,20}$"
                  title="Numero di telefono richiesto per il tracciamento SMS del corriere"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Input
                label="Indirizzo di Spedizione (Via/Piazza e Civico) *"
                name="address"
                placeholder="Es. Via Roma 45, Interno 2"
                value={formData.address}
                onChange={handleInputChange}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ItalianCityAutocomplete
                  cityValue={formData.city}
                  zipValue={formData.zip}
                  onSelect={(c, z) => setFormData(prev => ({ ...prev, city: c, zip: z }))}
                />
                <Input
                  label="CAP *"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Note Spedizione / Nome sul Citofono (opzionale)
                </label>
                <input
                  type="text"
                  name="shippingNotes"
                  placeholder="Es. Suonare scala B, piano 3"
                  value={formData.shippingNotes}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-brand-rust"
                />
              </div>
            </div>

            {/* 2. Dati di Fatturazione (Opzionale) */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requestInvoice"
                  checked={requestInvoice}
                  onChange={(e) => setRequestInvoice(e.target.checked)}
                  className="w-4 h-4 accent-brand-rust cursor-pointer"
                />
                <label htmlFor="requestInvoice" className="text-xs font-bold uppercase tracking-widest text-deep-black cursor-pointer">
                  Richiedo Fattura Elettronica (Privato o Azienda)
                </label>
              </div>

              {requestInvoice && (
                <div className="bg-stone-50 p-5 border border-stone-200 space-y-4 animate-fade-in">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                      <input
                        type="radio"
                        name="invoiceType"
                        checked={invoiceType === 'private'}
                        onChange={() => setInvoiceType('private')}
                        className="accent-brand-rust"
                      />
                      Privato (Codice Fiscale)
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                      <input
                        type="radio"
                        name="invoiceType"
                        checked={invoiceType === 'business'}
                        onChange={() => setInvoiceType('business')}
                        className="accent-brand-rust"
                      />
                      Azienda / P.IVA
                    </label>
                  </div>

                  {invoiceType === 'private' ? (
                    <Input
                      label="Codice Fiscale *"
                      name="codiceFiscale"
                      placeholder="RSSMRA80A01H501U"
                      value={invoiceData.codiceFiscale}
                      onChange={handleInvoiceChange}
                      required={requestInvoice && invoiceType === 'private'}
                    />
                  ) : (
                    <div className="space-y-4">
                      <Input
                        label="Ragione Sociale Azienda *"
                        name="ragioneSociale"
                        value={invoiceData.ragioneSociale}
                        onChange={handleInvoiceChange}
                        required={requestInvoice && invoiceType === 'business'}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Partita IVA *"
                          name="partitaIva"
                          value={invoiceData.partitaIva}
                          onChange={handleInvoiceChange}
                          required={requestInvoice && invoiceType === 'business'}
                        />
                        <Input
                          label="Codice SDI o PEC (opzionale)"
                          name="sdiOrPec"
                          placeholder="M5UXCR1 oppure pec@azienda.it"
                          value={invoiceData.sdiOrPec}
                          onChange={handleInvoiceChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Riepilogo Ordine & Pagamento Express (5 Colonne) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6 sticky top-28">
              <h2 className="text-lg font-display uppercase tracking-widest border-b border-gray-100 pb-4">
                Riepilogo Ordine
              </h2>

              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className="py-3 flex items-center gap-4">
                    <div className="relative w-14 h-14 bg-gray-100 shrink-0 border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Quantità: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-brand-rust">{item.price * item.quantity} €</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500 uppercase">Subtotale Articoli:</span>
                  <span>{subtotal} €</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500 uppercase">Spedizione Corrente:</span>
                  <span>{shippingCost === 0 ? <span className="text-green-600 uppercase">Gratuita</span> : `${shippingCost} €`}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-display text-base uppercase">Totale Ordine:</span>
                  <span className="text-2xl font-display text-brand-rust font-bold">{total} €</span>
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-xs font-bold uppercase tracking-widest bg-red-50 p-3 border border-red-200">
                  {error}
                </p>
              )}

              <ButtonCustom
                type="submit"
                className="w-full h-16 text-sm font-bold tracking-widest uppercase shadow-lg hover:shadow-xl"
                disabled={isProcessing}
              >
                {isProcessing ? 'Elaborazione Sicura...' : `PAGA ORA (${total} €) STRIPE / CARTE`}
              </ButtonCustom>

              <div className="text-center pt-2 space-y-2">
                <div className="flex items-center justify-center gap-3 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                  <span>🔒 Pagamento Sicuro SSL</span>
                  <span>•</span>
                  <span>🚚 Spedizione Espresso 24/48h</span>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </main>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
      <input className="w-full bg-white border border-gray-200 p-4 text-sm focus:outline-none focus:border-brand-rust transition-colors" {...props} />
    </div>
  );
}
