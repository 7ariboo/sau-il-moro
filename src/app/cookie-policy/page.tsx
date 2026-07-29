import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Cookie Policy | Sau Il Moro',
  description: 'Informativa estesa sui Cookie utilizzati da Sau Il Moro in conformità alle direttive UE e provvedimenti Garante Privacy.',
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-stone-texture flex flex-col">
      <Header />
      <div className="container mx-auto px-6 pt-36 pb-24 flex-1 max-w-4xl">
        <div className="bg-white p-8 md:p-14 shadow-lg rounded-sm space-y-8">
          <header className="border-b border-gray-200 pb-6">
            <span className="text-brand-rust font-bold uppercase text-xs tracking-widest block mb-2">Direttiva ePrivacy &amp; GDPR</span>
            <h1 className="text-3xl md:text-5xl font-display font-bold uppercase">Cookie Policy</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Ultimo aggiornamento: Luglio 2026</p>
          </header>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">1. Cosa sono i Cookie</h2>
            <p>
              I cookie sono piccoli file di testo che i siti visitati inviano al terminale dell&apos;utente (computer, smartphone, tablet), dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva.
            </p>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">2. Tipologie di Cookie Utilizzati</h2>
            
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-gray-50 border-l-4 border-brand-rust">
                <h3 className="font-bold text-deep-black uppercase text-xs tracking-wider mb-1">A) Cookie Tecnici (Strettamente Necessari)</h3>
                <p className="text-xs text-gray-600">
                  Sono indispensabili per il corretto funzionamento del sito, l&apos;autenticazione dell&apos;utente, il mantenimento dei prodotti all&apos;interno del carrello d&apos;acquisto e l&apos;elaborazione sicura del pagamento via Stripe. Non richiedono il preventivo consenso dell&apos;utente.
                </p>
              </div>

              <div className="p-4 bg-gray-50 border-l-4 border-gray-400">
                <h3 className="font-bold text-deep-black uppercase text-xs tracking-wider mb-1">B) Cookie Analitici e Statistiche</h3>
                <p className="text-xs text-gray-600">
                  Consentono di raccogliere informazioni in forma anonima e aggregata sull&apos;uso del sito (numero di visitatori, pagine più lette, tempi di permanenza) al fine di migliorarne le prestazioni e la navigazione.
                </p>
              </div>

              <div className="p-4 bg-gray-50 border-l-4 border-gray-400">
                <h3 className="font-bold text-deep-black uppercase text-xs tracking-wider mb-1">C) Cookie di Profilazione e Marketing (Terze Parti)</h3>
                <p className="text-xs text-gray-600">
                  Sono utilizzati per tracciare la navigazione dell&apos;utente in rete e creare profili sui suoi gusti, abitudini, scelte, al fine di trasmettere messaggi pubblicitari in linea con le preferenze manifestate. Vengono installati solo previo tuo esplicito consenso.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">3. Gestione e Modifica del Consenso</h2>
            <p>
              Puoi in qualsiasi momento modificare o revocare il tuo consenso sui cookie direttamente tramite il Banner Cookie che appare in fondo alla pagina o modificando le impostazioni del tuo browser:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
              <li>Google Chrome: Impostazioni → Privacy e Sicurezza → Cookie e altri dati dei siti</li>
              <li>Mozilla Firefox: Opzioni → Privacy e Sicurezza → Cookie e dati dei siti web</li>
              <li>Apple Safari: Preferenze → Privacy → Blocco cookie</li>
              <li>Microsoft Edge: Impostazioni → Autorizzazioni sito → Cookie e dati memorizzati</li>
            </ul>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">4. Contatti Titolare del Trattamento</h2>
            <p>
              Per qualsiasi chiarimento in merito alla presente Cookie Policy o all&apos;esercizio dei tuoi diritti: <br />
              <strong>Near di Diana Gabriele</strong> — P.IVA: <span className="font-mono text-brand-rust font-bold">14470190969</span><br />
              Email: <a href="mailto:info@sauilmoro.it" className="text-brand-rust underline font-bold">info@sauilmoro.it</a>
            </p>
          </section>

          <footer className="pt-6 border-t border-gray-200 flex justify-between items-center text-xs">
            <Link href="/" className="text-brand-rust font-bold uppercase tracking-widest hover:underline">
              ← Torna allo Store
            </Link>
            <Link href="/privacy" className="text-deep-black/60 font-bold uppercase tracking-widest hover:text-deep-black">
              Privacy Policy →
            </Link>
          </footer>
        </div>
      </div>
      <Footer />
    </main>
  );
}
