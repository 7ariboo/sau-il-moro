"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { ButtonCustom } from '@/components/ButtonCustom';
import Link from 'next/link';
import Image from 'next/image';

type CheckoutStep = 'data' | 'shipping' | 'payment' | 'success';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('data');
  const [orderId, setOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  });

  const shippingCost = subtotal >= 150 ? 0 : 15;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'data') setStep('shipping');
    else if (step === 'shipping') setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/orders', {
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
          },
          paymentMethod: 'carta',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.data.id);
        setStep('success');
        clearCart();
      } else {
        alert(data.error || 'Errore nella creazione dell\'ordine');
      }
    } catch {
      alert('Errore di connessione. Riprova.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'success') {
    return (
      <main className="min-h-screen bg-stone-texture">
        <Header />
        <div className="container mx-auto px-6 pt-40 pb-24 text-center">
          <div className="max-w-md mx-auto space-y-8 animate-fade-in">
            <div className="w-20 h-20 bg-brand-rust rounded-full flex items-center justify-center mx-auto text-pure-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h1 className="text-4xl font-display uppercase tracking-widest">Ordine Confermato</h1>
            {orderId && (
              <p className="text-sm font-bold text-brand-rust uppercase tracking-widest">
                Ordine #{orderId}
              </p>
            )}
            <p className="text-gray-600 leading-relaxed">
              Grazie per aver scelto Sau Il Moro. Abbiamo ricevuto il tuo ordine e stiamo preparando il tuo pacco artigianale. Riceverai una mail di conferma a breve.
            </p>
            <Link href="/">
              <ButtonCustom className="w-full">Torna alla Home</ButtonCustom>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-stone-texture">
        <Header />
        <div className="container mx-auto px-6 pt-40 pb-24 text-center">
          <div className="max-w-md mx-auto space-y-8 animate-fade-in">
            <div className="w-20 h-20 bg-deep-black/5 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-deep-black/30"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <h1 className="text-3xl font-display uppercase">Carrello vuoto</h1>
            <p className="text-gray-500">Aggiungi prodotti al carrello per procedere al checkout.</p>
            <Link href="/"><ButtonCustom>Esplora i prodotti</ButtonCustom></Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />

      <div className="container mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Checkout Form */}
          <div className="flex-[2] space-y-12">
            {/* Steps Indicator */}
            <div className="flex items-center gap-8 border-b border-gray-200 pb-8 overflow-x-auto whitespace-nowrap">
              <StepIndicator label="Dati" active={step === 'data'} completed={step !== 'data'} />
              <div className="w-8 h-px bg-gray-200" />
              <StepIndicator label="Spedizione" active={step === 'shipping'} completed={step === 'payment'} />
              <div className="w-8 h-px bg-gray-200" />
              <StepIndicator label="Pagamento" active={step === 'payment'} completed={false} />
            </div>

            <form onSubmit={nextStep} className="space-y-8">
              {step === 'data' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-display uppercase tracking-widest">Informazioni di Contatto</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    <Input label="Telefono" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                    <Input label="Nome" name="name" value={formData.name} onChange={handleInputChange} required />
                    <Input label="Cognome" name="surname" value={formData.surname} onChange={handleInputChange} required />
                  </div>
                  <ButtonCustom type="submit" className="w-full md:w-auto">Continua alla Spedizione</ButtonCustom>
                </div>
              )}

              {step === 'shipping' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-display uppercase tracking-widest">Indirizzo di Spedizione</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input label="Indirizzo" name="address" value={formData.address} onChange={handleInputChange} required />
                    </div>
                    <Input label="Città" name="city" value={formData.city} onChange={handleInputChange} required />
                    <Input label="CAP" name="zip" value={formData.zip} onChange={handleInputChange} required />
                  </div>
                  <div className="flex gap-4">
                    <ButtonCustom type="button" variant="outline" onClick={() => setStep('data')}>Indietro</ButtonCustom>
                    <ButtonCustom type="submit" className="flex-1">Vai al Pagamento</ButtonCustom>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-xl font-display uppercase tracking-widest">Pagamento Sicuro</h2>
                  <div className="bg-white p-8 border border-gray-200 space-y-6">
                    <div className="flex items-center justify-between p-4 border border-brand-rust/20 bg-brand-rust/5 mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest">Carta di Credito / Debito</span>
                      <div className="flex gap-2">
                        <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-[6px] font-bold">VISA</div>
                        <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-[6px] font-bold">MC</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Input label="Numero Carta" placeholder="0000 0000 0000 0000" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Scadenza" placeholder="MM/AA" />
                        <Input label="CVC" placeholder="123" />
                      </div>
                      <Input label="Nome sulla Carta" placeholder="Nome Cognome" />
                    </div>

                    <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      I tuoi dati sono protetti da crittografia SSL a 256 bit.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <ButtonCustom type="button" variant="outline" onClick={() => setStep('shipping')}>Indietro</ButtonCustom>
                    <ButtonCustom
                      type="button"
                      className="flex-1"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Elaborazione...' : `Paga ${total} €`}
                    </ButtonCustom>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="flex-1">
            <div className="bg-white p-8 border border-gray-100 sticky top-32">
              <h2 className="text-xl font-display uppercase tracking-widest mb-8">Riepilogo Ordine</h2>
              <div className="space-y-6 mb-8 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-stone-100 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest leading-tight">{item.name}</h4>
                      <p className="text-xs text-gray-400">Qtà: {item.quantity}</p>
                      <p className="text-sm font-display text-brand-rust mt-1">{item.price * item.quantity} €</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-6">
                {/* Discount Code Input */}
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="Codice Sconto" 
                    className="flex-1 bg-gray-50 border border-gray-200 p-3 text-xs uppercase tracking-widest focus:outline-none focus:border-brand-rust"
                    id="discount-input"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const input = document.getElementById('discount-input') as HTMLInputElement;
                      if (input.value.toUpperCase() === 'SAUMORO10') {
                        alert('Codice Sconto Applicato!');
                      } else {
                        alert('Codice non valido');
                      }
                    }}
                    className="bg-deep-black text-white px-4 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Applica
                  </button>
                </div>

                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-gray-400">Subtotale</span>
                  <span>{subtotal} €</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-gray-400">Spedizione</span>
                  <span>{shippingCost === 0 ? 'GRATIS' : `${shippingCost} €`}</span>
                </div>
                {shippingCost > 0 && subtotal < 150 && (
                  <p className="text-[10px] text-brand-rust">Aggiungi {150 - subtotal}€ per la spedizione gratuita!</p>
                )}
                <div className="flex justify-between text-xl font-display border-t border-gray-50 pt-4">
                  <span>Totale</span>
                  <span className="text-brand-rust">{total} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StepIndicator({ label, active, completed }: { label: string, active: boolean, completed: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${active ? 'text-brand-rust' : completed ? 'text-deep-black' : 'text-gray-300'}`}>
      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
        active ? 'border-brand-rust bg-brand-rust text-pure-white' :
        completed ? 'border-deep-black bg-deep-black text-pure-white' : 'border-gray-200'
      }`}>
        {completed ? '✓' : ''}
      </div>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
      <input
        className="w-full bg-white border border-gray-200 p-4 text-sm focus:outline-none focus:border-brand-rust transition-colors"
        {...props}
      />
    </div>
  );
}
