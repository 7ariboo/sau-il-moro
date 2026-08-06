"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { ButtonCustom } from '@/components/ButtonCustom';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
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

  // Discount Code State
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; type: 'percentage' | 'fixed'; value: number; minSubtotal?: number } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);

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

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    setIsCheckingDiscount(true);
    setDiscountError('');
    try {
      const res = await fetch('/api/discounts');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const found = data.data.find((d: any) => d.code.toUpperCase() === discountInput.trim().toUpperCase());
        if (!found) {
          setDiscountError('Codice promozionale non valido.');
        } else if (found.minSubtotal && subtotal < found.minSubtotal) {
          setDiscountError(`Questo codice richiede una spesa minima di ${found.minSubtotal} €.`);
        } else {
          setAppliedDiscount(found);
          setDiscountError('');
        }
      } else {
        setDiscountError('Impossibile verificare il codice promozionale.');
      }
    } catch {
      setDiscountError('Errore durante la verifica del codice.');
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountInput('');
    setDiscountError('');
  };

  // Total calculation with discount
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedDiscount.value) / 100);
    } else {
      discountAmount = Math.min(subtotal, appliedDiscount.value);
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingCost = subtotalAfterDiscount >= 150 ? 0 : 15;
  const total = subtotalAfterDiscount + shippingCost;

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

    if (!isAgeVerified) {
      setError('È necessario confermare di essere maggiorenni (18+) e la destinazione d\'uso per completare l\'acquisto.');
      setIsProcessing(false);
      return;
    }

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
          discount: appliedDiscount ? {
            code: appliedDiscount.code,
            amount: discountAmount,
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

      <div className="container mx-auto px-6 pt-[170px] md:pt-36 pb-24">
        <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-wider">
              Checkout
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-rust mt-1">
              Spedizione in tutta Italia — Consegna in 24/48h
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
                  autoComplete="given-name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Cognome *"
                  name="surname"
                  autoComplete="family-name"
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
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Telefono per il Corriere (+39 ...) *"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
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
                autoComplete="shipping street-address"
                placeholder="Es. Via Roma 45, Interno 2"
                value={formData.address}
                onChange={handleInputChange}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Città / Comune *"
                  name="city"
                  autoComplete="shipping address-level2"
                  placeholder="Es. Cagliari, Roma, Pattada..."
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="CAP *"
                  name="zip"
                  autoComplete="shipping postal-code"
                  placeholder="Es. 09121"
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
                        autoComplete="organization"
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

              {/* Discount Code Input Box */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Codice Sconto / Promo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Es. SAUMORO10"
                    value={discountInput}
                    onChange={(e) => {
                      setDiscountInput(e.target.value.toUpperCase());
                      setDiscountError('');
                    }}
                    className="flex-1 bg-white border border-gray-200 px-3 py-2.5 text-xs font-mono font-bold uppercase focus:outline-none focus:border-brand-rust"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={isCheckingDiscount}
                    className="bg-deep-black text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-brand-rust transition-colors shrink-0 disabled:opacity-50"
                  >
                    {isCheckingDiscount ? '...' : 'Applica'}
                  </button>
                </div>
                {discountError && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{discountError}</p>
                )}
                {appliedDiscount && (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-2.5 text-xs text-green-800 font-bold uppercase tracking-wider rounded-sm mt-2">
                    <span>✓ Codice {appliedDiscount.code} applicato (-{discountAmount} €)</span>
                    <button type="button" onClick={handleRemoveDiscount} className="text-red-600 hover:underline text-[10px]">Rimuovi</button>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500 uppercase">Subtotale Articoli:</span>
                  <span>{subtotal} €</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between font-bold text-brand-rust">
                    <span className="uppercase">Sconto Applicato ({appliedDiscount?.code}):</span>
                    <span>-{discountAmount} €</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500 uppercase">Spedizione Corrente:</span>
                  <span>{shippingCost === 0 ? <span className="text-green-600 uppercase">Gratuita</span> : `${shippingCost} €`}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-display text-base uppercase">Totale Ordine:</span>
                  <span className="text-2xl font-display text-brand-rust font-bold">{total} €</span>
                </div>
              </div>

              {/* High-Visibility 18+ Age Verification & Legal Compliance (Art. 4 L. 110/1975 & Art. 704 C.P.) */}
              <div className={`p-4 rounded border-2 transition-all duration-200 ${
                !isAgeVerified && error.includes('maggiorenni') 
                  ? 'bg-red-100 border-red-600 shadow-md' 
                  : 'bg-gradient-to-br from-amber-50 via-red-50/40 to-amber-50 border-amber-400/90 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-200/80">
                  <span className="bg-red-700 text-white text-xs font-mono font-extrabold px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1 shrink-0">
                    <span>🔞</span> 18+ ANNI
                  </span>
                  <span className="text-xs font-bold text-deep-black uppercase tracking-wider">
                    Conferma Legale Obbligatoria
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="ageVerification"
                    checked={isAgeVerified}
                    onChange={(e) => {
                      setIsAgeVerified(e.target.checked);
                      if (e.target.checked && error.includes('maggiorenni')) setError('');
                    }}
                    required
                    className="mt-0.5 accent-red-700 w-5 h-5 cursor-pointer shrink-0 rounded"
                  />
                  <label htmlFor="ageVerification" className="text-xs font-bold text-deep-black cursor-pointer leading-snug">
                    Dichiaro sotto la mia responsabilità di essere maggiorenne (18+ anni) e che l&apos;acquisto è destinato esclusivamente ad uso domestico, collezionistico, espositivo o professionale consentito dalla legge (Art. 4 L. 110/1975 e Art. 704 C.P.). *
                  </label>
                </div>

                <div className="mt-3 pl-8 text-[11px] text-gray-600 font-medium leading-relaxed bg-white/60 p-2.5 rounded border border-amber-200/50">
                  ⚖️ <strong>Avviso Normativo:</strong> In Italia la vendita di utensili ed strumenti da taglio è vietata ai minori di 18 anni. La spunta di questa casella costituisce dichiarazione sostitutiva di atto di notorietà.
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
