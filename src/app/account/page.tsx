"use client";

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ButtonCustom } from '@/components/ButtonCustom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

type Tab = 'profile' | 'orders' | 'addresses' | 'settings';

export default function AccountPage() {
  const { user, isLoading, login, register, loginWithGoogle, loginWithApple, logout } = useAuth();

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

  if (!user) {
    return (
      <AuthForms
        login={login}
        register={register}
        loginWithGoogle={loginWithGoogle}
      />
    );
  }

  return <AccountDashboard user={user} logout={logout} />;
}

// ─── Auth Forms (Login/Register/OAuth) ──────────────────────────────────

function AuthForms({
  login,
  register,
  loginWithGoogle,
}: {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string; surname: string; phone?: string; newsletter?: boolean }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
}) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    newsletter: false,
    privacy: false,
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
    setResetSuccess(false);

    if (mode === 'forgot') {
      const res = await resetPassword(form.email);
      if (res.success) {
        setResetSuccess(true);
      } else {
        setError(res.error || 'Impossibile inviare l\'email di ripristino');
      }
      setIsSubmitting(false);
      return;
    }

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
          newsletter: form.newsletter,
        });

    if (!result.success) {
      setError(result.error || 'Errore durante l\'autenticazione');
    }
    setIsSubmitting(false);
  };

  const handleOAuth = async () => {
    setIsSubmitting(true);
    setError('');
    const result = await loginWithGoogle();
    if (!result.success) {
      setError(result.error || "Errore durante l'accesso con Google");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-stone-texture">
      <Header />
      <div className="container mx-auto px-6 pt-[170px] md:pt-36 pb-24 flex justify-center">
        <div className="w-full max-w-md bg-white p-8 border border-gray-100 shadow-sm">
          {/* Tabs */}
          {mode !== 'forgot' && (
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => { setMode('login'); setError(''); setResetSuccess(false); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors border-b-2 ${
                  mode === 'login' ? 'border-brand-rust text-brand-rust' : 'border-transparent text-gray-400 hover:text-deep-black'
                }`}
              >
                Accedi
              </button>
              <button
                onClick={() => { setMode('register'); setError(''); setResetSuccess(false); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors border-b-2 ${
                  mode === 'register' ? 'border-brand-rust text-brand-rust' : 'border-transparent text-gray-400 hover:text-deep-black'
                }`}
              >
                Registrati
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="mb-6">
              <h2 className="text-2xl font-display uppercase tracking-wider text-deep-black">Ripristina Password</h2>
              <p className="text-xs text-gray-500 mt-1">Inserisci la tua email per ricevere il link di ripristino password.</p>
            </div>
          )}

          {/* Social OAuth Button (Google) */}
          {mode !== 'forgot' && (
            <>
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={handleOAuth}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 px-4 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors uppercase tracking-wider shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                  Accedi con Google
                </button>
              </div>

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-gray-400">Oppure con Email</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Nome" name="name" autoComplete="given-name" value={form.name} onChange={handleChange} required />
                <FormInput label="Cognome" name="surname" autoComplete="family-name" value={form.surname} onChange={handleChange} required />
              </div>
            )}

            <FormInput label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />

            {mode !== 'forgot' && (
              <div>
                <FormInput label="Password" name="password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={form.password} onChange={handleChange} required minLength={6} />
                {mode === 'login' && (
                  <div className="text-right mt-1.5">
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); setResetSuccess(false); }}
                      className="text-[10px] font-bold uppercase tracking-widest text-brand-rust hover:underline"
                    >
                      Password dimenticata?
                    </button>
                  </div>
                )}
              </div>
            )}

            {mode === 'register' && (
              <FormInput label="Telefono (opzionale)" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} />
            )}

            {mode === 'register' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={form.newsletter}
                    onChange={handleChange}
                    className="mt-1 accent-brand-rust"
                  />
                  <label htmlFor="newsletter" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 cursor-pointer">
                    Iscrivimi alla newsletter per accedere a collezioni esclusive
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
                  <label htmlFor="privacy" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 cursor-pointer">
                    Accetto i termini di servizio e la privacy policy *
                  </label>
                </div>
              </div>
            )}

            {resetSuccess && (
              <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest bg-emerald-50 px-4 py-3 border border-emerald-200">
                ✓ Email inviata! Controlla la tua casella di posta per reimpostare la password.
              </p>
            )}

            {error && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest bg-red-50 px-4 py-3 border border-red-100">
                {error}
              </p>
            )}

            <ButtonCustom type="submit" className="w-full h-14" disabled={isSubmitting}>
              {isSubmitting
                ? 'Attendere...'
                : mode === 'forgot'
                ? 'Invia Link di Ripristino'
                : mode === 'login'
                ? 'Accedi al Profilo'
                : 'Crea Account Ufficiale'}
            </ButtonCustom>

            {mode === 'forgot' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setResetSuccess(false); }}
                  className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-deep-black transition-colors"
                >
                  &larr; Torna all&apos;accesso
                </button>
              </div>
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
  user: { id: string; email: string; name: string; surname: string; phone: string; address?: string; city?: string; zip?: string; newsletter?: boolean; role: string };
  logout: () => void;
}) {
  const [tab, setTab] = useState<Tab>('profile');
  const { items, subtotal } = useCart();
  const { updateUserProfile } = useAuth();

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    surname: user.surname || '',
    phone: user.phone || '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Address Form state
  const [addressForm, setAddressForm] = useState({
    address: user.address || '',
    city: user.city || '',
    zip: user.zip || '',
  });
  const [addressMessage, setAddressMessage] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Newsletter Toggle state
  const [newsletterEnabled, setNewsletterEnabled] = useState(!!user.newsletter);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage('');
    const res = await updateUserProfile(profileForm);
    if (res.success) {
      setProfileMessage('Profilo aggiornato con successo!');
    } else {
      setProfileMessage(res.error || 'Errore durante l\'aggiornamento.');
    }
    setIsSavingProfile(false);
  };

  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    setAddressMessage('');
    const res = await updateUserProfile(addressForm);
    if (res.success) {
      setAddressMessage('Indirizzo di spedizione salvato con successo!');
    } else {
      setAddressMessage(res.error || 'Errore durante il salvataggio.');
    }
    setIsSavingAddress(false);
  };

  const handleNewsletterToggle = async () => {
    const nextState = !newsletterEnabled;
    setNewsletterEnabled(nextState);
    await updateUserProfile({ newsletter: nextState });
  };

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
              <div className="bg-white border border-gray-100 p-8 space-y-8 animate-fade-in">
                <h2 className="text-xl font-display uppercase tracking-widest mb-6">Dati Personali</h2>
                
                <form onSubmit={handleProfileSave} className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Nome"
                      name="name"
                      autoComplete="given-name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Cognome"
                      name="surname"
                      autoComplete="family-name"
                      value={profileForm.surname}
                      onChange={(e) => setProfileForm({ ...profileForm, surname: e.target.value })}
                      required
                    />
                  </div>
                  <FormInput
                    label="Email (non modificabile)"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={user.email}
                    disabled
                    className="bg-gray-100 cursor-not-allowed opacity-75"
                  />
                  <FormInput
                    label="Numero di Telefono (+39 ...)"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+39 333 1234567"
                    pattern="^[+0-9\s-]{6,20}$"
                    title="Inserisci un numero di telefono valido (es. +39 333 1234567)"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />

                  {profileMessage && (
                    <p className={`text-xs font-bold uppercase tracking-widest p-3 rounded-sm ${
                      profileMessage.includes('successo') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {profileMessage}
                    </p>
                  )}

                  <ButtonCustom type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Salvataggio...' : 'Salva Modifiche Profilo'}
                  </ButtonCustom>
                </form>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100 mt-8">
                  <div className="bg-brand-rust/5 p-4 text-center">
                    <p className="text-2xl font-display text-brand-rust">{items.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Nel Carrello</p>
                  </div>
                  <div className="bg-brand-rust/5 p-4 text-center">
                    <p className="text-2xl font-display text-brand-rust">{subtotal} €</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Subtotale</p>
                  </div>
                  <div className="bg-brand-rust/5 p-4 text-center col-span-2 sm:col-span-1">
                    <p className="text-2xl font-display text-brand-rust">Attivo</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Stato Account</p>
                  </div>
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div className="bg-white border border-gray-100 p-8 animate-fade-in">
                <h2 className="text-xl font-display uppercase tracking-widest mb-6">I tuoi ordini</h2>
                <div className="text-center py-16 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-30"><path d="M16 16h6"/><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16"/></svg>
                  <p className="text-xs font-bold uppercase tracking-widest">I tuoi ordini appariranno qui dopo ogni acquisto.</p>
                  <Link href="/"><ButtonCustom className="mt-6" size="sm">Inizia a fare shopping</ButtonCustom></Link>
                </div>
              </div>
            )}

            {tab === 'addresses' && (
              <div className="bg-white border border-gray-100 p-8 space-y-6 animate-fade-in">
                <h2 className="text-xl font-display uppercase tracking-widest mb-6">Indirizzo di Spedizione Predefinito</h2>
                
                <form onSubmit={handleAddressSave} className="space-y-6 max-w-xl">
                  <FormInput
                    label="Indirizzo (Via, Piazza, Numero Civico)"
                    name="address"
                    autoComplete="street-address"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Città / Comune"
                      name="city"
                      autoComplete="address-level2"
                      placeholder="Es. Cagliari, Roma, Pattada..."
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Codice Postale (CAP)"
                      name="zip"
                      autoComplete="postal-code"
                      placeholder="Es. 09121"
                      value={addressForm.zip}
                      onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                      required
                    />
                  </div>

                  {addressMessage && (
                    <p className={`text-xs font-bold uppercase tracking-widest p-3 rounded-sm ${
                      addressMessage.includes('successo') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {addressMessage}
                    </p>
                  )}

                  <ButtonCustom type="submit" disabled={isSavingAddress}>
                    {isSavingAddress ? 'Salvataggio...' : 'Salva Indirizzo Spedizione'}
                  </ButtonCustom>
                </form>
              </div>
            )}

            {tab === 'settings' && (
              <div className="bg-white border border-gray-100 p-8 space-y-8 animate-fade-in">
                <h2 className="text-xl font-display uppercase tracking-widest mb-6">Impostazioni Account</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-gray-50">
                    <div>
                      <p className="text-sm font-bold">Iscrizione Newsletter</p>
                      <p className="text-xs text-gray-400">Ricevi anteprime e promozioni riservate agli iscritti</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleNewsletterToggle}
                      className={`w-14 h-7 rounded-full relative transition-colors ${
                        newsletterEnabled ? 'bg-brand-rust' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        newsletterEnabled ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-gray-50">
                    <div>
                      <p className="text-sm font-bold">Lingua e Regione</p>
                      <p className="text-xs text-gray-400">Lingua ufficiale dell&apos;interfaccia</p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-rust">Italiano (IT)</span>
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
