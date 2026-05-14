"use client";
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ButtonCustom } from '@/components/ButtonCustom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

type Tab = 'profile' | 'orders' | 'addresses' | 'settings';

export default function AccountPage() {
  const { user, isLoading, login, register, logout } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-stone-texture">
        <Header />
        <div className="pt-40 text-center">
          <div className="w-8 h-8 border-2 border-brand-rust border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </main>
    );
  }

  if (!user) return <AuthForms login={login} register={register} />;

  return <AccountDashboard user={user} logout={logout} />;
}

// ─── Auth Forms (Login/Register) ─────────────────────────────────────

function AuthForms({
  login,
  register,
}: {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string; surname: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', name: '', surname: '', phone: '', newsletter: false, privacy: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (mode === 'register' && !form.privacy) {
      setError('Devi accettare i termini e la privacy policy');
      setIsSubmitting(false);
      return;
    }

    const result = mode === 'login'
      ? await login(form.email, form.password)
      : await register({
          email: form.email,
          password: form.password,
          name: form.name,
          surname: form.surname,
          phone: form.phone,
          newsletter: form.newsletter // This will be passed to the API
        } as any);

    if (!result.success) {
      setError(result.error || 'Errore');
    }
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-24 flex justify-center">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-10">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.3em] transition-colors border-b-2 ${
                mode === 'login' ? 'border-brand-rust text-brand-rust' : 'border-transparent text-gray-400 hover:text-deep-black'
              }`}
            >
              Accedi
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.3em] transition-colors border-b-2 ${
                mode === 'register' ? 'border-brand-rust text-brand-rust' : 'border-transparent text-gray-400 hover:text-deep-black'
              }`}
            >
              Registrati
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Nome" name="name" value={form.name} onChange={handleChange} required />
                <FormInput label="Cognome" name="surname" value={form.surname} onChange={handleChange} required />
              </div>
            )}
            <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
            {mode === 'register' && (
              <FormInput label="Telefono (opzionale)" name="phone" type="tel" value={form.phone} onChange={handleChange} />
            )}

            {mode === 'register' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="newsletter" 
                    name="newsletter" 
                    checked={form.newsletter}
                    onChange={handleChange}
                    className="mt-1 accent-brand-rust" 
                  />
                  <label htmlFor="newsletter" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-pointer">
                    Iscrivimi alla newsletter per ricevere offerte esclusive
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="privacy" 
                    name="privacy" 
                    checked={form.privacy}
                    onChange={handleChange}
                    required 
                    className="mt-1 accent-brand-rust" 
                  />
                  <label htmlFor="privacy" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-pointer">
                    Accetto i termini e la privacy policy *
                  </label>
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest bg-red-50 px-4 py-3 border border-red-100">
                {error}
              </p>
            )}

            <ButtonCustom type="submit" className="w-full h-14" disabled={isSubmitting}>
              {isSubmitting ? 'Attendere...' : mode === 'login' ? 'Accedi' : 'Crea Account'}
            </ButtonCustom>

            {mode === 'login' && (
              <p className="text-center text-xs text-gray-400 mt-4">
                Credenziali demo: <span className="font-bold text-deep-black">admin@sauilmoro.it</span> / <span className="font-bold text-deep-black">admin123</span>
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

// ─── Account Dashboard ────────────────────────────────────────────────

function AccountDashboard({
  user,
  logout,
}: {
  user: { id: string; email: string; name: string; surname: string; phone: string; role: string };
  logout: () => void;
}) {
  const [tab, setTab] = useState<Tab>('profile');
  const { items, subtotal } = useCart();

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'profile', label: 'Profilo',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
    {
      key: 'orders', label: 'Ordini',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16h6"/><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16"/></svg>
    },
    {
      key: 'addresses', label: 'Indirizzi',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    },
    {
      key: 'settings', label: 'Impostazioni',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
    },
  ];

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-24">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-display uppercase">
              Ciao, <span className="text-brand-rust">{user.name}</span>
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">{user.email}</p>
          </div>
          <div className="flex gap-3">
            {user.role === 'admin' && (
              <Link href="/admin">
                <ButtonCustom variant="outline" size="sm">Dashboard Admin</ButtonCustom>
              </Link>
            )}
            <ButtonCustom variant="outline" size="sm" onClick={logout}>Esci</ButtonCustom>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <nav className="bg-white border border-gray-100 divide-y divide-gray-50">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${
                    tab === t.key ? 'text-brand-rust bg-brand-rust/5' : 'text-gray-500 hover:text-deep-black hover:bg-gray-50'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {tab === 'profile' && (
              <div className="bg-white border border-gray-100 p-8 space-y-6 animate-fade-in">
                <h2 className="text-xl font-display uppercase tracking-widest mb-6">Il tuo profilo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField label="Nome" value={user.name} />
                  <InfoField label="Cognome" value={user.surname} />
                  <InfoField label="Email" value={user.email} />
                  <InfoField label="Telefono" value={user.phone || 'Non specificato'} />
                  <InfoField label="Ruolo" value={user.role === 'admin' ? 'Amministratore' : 'Cliente'} />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 mt-8">
                  <div className="bg-brand-rust/5 p-4 text-center">
                    <p className="text-2xl font-display text-brand-rust">{items.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Nel Carrello</p>
                  </div>
                  <div className="bg-brand-rust/5 p-4 text-center">
                    <p className="text-2xl font-display text-brand-rust">{subtotal} €</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Subtotale</p>
                  </div>
                  <div className="bg-brand-rust/5 p-4 text-center">
                    <p className="text-2xl font-display text-brand-rust">0</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Ordini</p>
                  </div>
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div className="bg-white border border-gray-100 p-8 animate-fade-in">
                <h2 className="text-xl font-display uppercase tracking-widest mb-6">I tuoi ordini</h2>
                <div className="text-center py-16 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-30"><path d="M16 16h6"/><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16"/></svg>
                  <p className="text-xs font-bold uppercase tracking-widest">Nessun ordine ancora</p>
                  <p className="text-xs text-gray-300 mt-2">I tuoi ordini appariranno qui.</p>
                  <Link href="/"><ButtonCustom className="mt-6" size="sm">Inizia a fare shopping</ButtonCustom></Link>
                </div>
              </div>
            )}

            {tab === 'addresses' && (
              <div className="bg-white border border-gray-100 p-8 animate-fade-in">
                <h2 className="text-xl font-display uppercase tracking-widest mb-6">Indirizzi di spedizione</h2>
                <div className="border-2 border-dashed border-gray-200 p-8 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Nessun indirizzo salvato</p>
                  <ButtonCustom size="sm" variant="outline">+ Aggiungi indirizzo</ButtonCustom>
                </div>
              </div>
            )}

            {tab === 'settings' && (
              <div className="bg-white border border-gray-100 p-8 space-y-8 animate-fade-in">
                <h2 className="text-xl font-display uppercase tracking-widest mb-6">Impostazioni</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-gray-50">
                    <div>
                      <p className="text-sm font-bold">Newsletter</p>
                      <p className="text-xs text-gray-400">Ricevi aggiornamenti e offerte esclusive</p>
                    </div>
                    <button className="w-12 h-6 bg-brand-rust rounded-full relative">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-gray-50">
                    <div>
                      <p className="text-sm font-bold">Lingua</p>
                      <p className="text-xs text-gray-400">Seleziona la lingua dell&apos;interfaccia</p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-rust">Italiano</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <button onClick={logout} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">
                    Disconnetti account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Helper Components ────────────────────────────────────────────────

function FormInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
      <input className="w-full bg-white border border-gray-200 p-4 text-sm focus:outline-none focus:border-brand-rust transition-colors" {...props} />
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
