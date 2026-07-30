import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | Sau Il Moro',
  description: 'Informativa sulla Privacy ai sensi del Regolamento UE 2016/679 (GDPR) di Sau Il Moro.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-texture flex flex-col">
      <Header />
      <div className="container mx-auto px-6 pt-36 pb-24 flex-1 max-w-4xl">
        <div className="bg-white p-8 md:p-14 shadow-lg rounded-sm space-y-8">
          <header className="border-b border-gray-200 pb-6">
            <span className="text-brand-rust font-bold uppercase text-xs tracking-widest block mb-2">Conformità Regolamento UE 2016/679 (GDPR)</span>
            <h1 className="text-3xl md:text-5xl font-display font-bold uppercase">Privacy Policy</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Ultimo aggiornamento: Luglio 2026</p>
          </header>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">1. Titolare del Trattamento dei Dati</h2>
            <p>
              Il Titolare del trattamento dei dati personali raccolti tramite il sito web <strong>sauilmoro.it</strong> è:<br />
              <strong>Near di Diana Gabriele</strong> (marchio registrato Sau Il Moro)<br />
              Partita IVA: <span className="font-mono text-brand-rust font-bold">14470190969</span><br />
              Sede Legale: Sardegna, Italia<br />
              Email di contatto: <a href="mailto:info@sauilmoro.com" className="text-brand-rust underline font-bold">info@sauilmoro.com</a>
            </p>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">2. Tipologia di Dati Raccolti</h2>
            <p>Raccogliamo ed elaboriamo i seguenti dati personali forniti direttamente dall&apos;utente:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Dati identificativi e di contatto:</strong> Nome, cognome, indirizzo email, numero di telefono.</li>
              <li><strong>Dati di spedizione e fatturazione:</strong> Indirizzo di consegna, CAP, città, paese, codice fiscale / P.IVA per l&apos;emissione della ricevuta fiscale o fattura.</li>
              <li><strong>Dati di pagamento:</strong> I pagamenti con carta sono elaborati in modo sicuro direttamente tramite <strong>Stripe Inc.</strong> Nessun dato relativo alle carte di credito viene salvato sui nostri server.</li>
              <li><strong>Dati di navigazione:</strong> Indirizzo IP, tipo di browser, log di accesso (raccolti in forma anonima o aggregata).</li>
            </ul>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">3. Finalità e Base Giuridica del Trattamento</h2>
            <p>I dati personali vengono trattati per le seguenti finalità:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Esecuzione del contratto d&apos;acquisto:</strong> Gestione degli ordini, spedizione dei prodotti e assistenza post-vendita (base giuridica: art. 6.1.b GDPR).</li>
              <li><strong>Adempimento di obblighi di legge:</strong> Obblighi fiscali, contabili e amministrativi legati alla vendita e-commerce (base giuridica: art. 6.1.c GDPR).</li>
              <li><strong>Invio di comunicazioni transazionali:</strong> Conferma dell&apos;ordine, aggiornamento sullo stato della spedizione via email/Resend (base giuridica: art. 6.1.b GDPR).</li>
              <li><strong>Marketing previo consenso:</strong> Invio di newsletter o promozioni riservate via email, solo se esplicitamente autorizzato dall&apos;utente (base giuridica: art. 6.1.a GDPR).</li>
            </ol>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">4. Destinatari dei Dati e Fornitori Terzi</h2>
            <p>Per l&apos;erogazione dei servizi, i dati possono essere condivisi esclusivamente con i seguenti responsabili del trattamento fornitori di servizi tecnici e logistici:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Stripe Inc.:</strong> Gestione ed elaborazione sicura dei pagamenti online (PCI-DSS compliant).</li>
              <li><strong>Firebase (Google LLC):</strong> Autenticazione utenti e memorizzazione sicura del database ordini (server UE).</li>
              <li><strong>Resend Inc.:</strong> Servizio di recapito transazionale delle email di conferma e spedizione ordine.</li>
              <li><strong>Corrieri Espresso Partner:</strong> Per la consegna fisica della merce acquistata presso l&apos;indirizzo indicato.</li>
            </ul>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">5. Conservazione dei Dati</h2>
            <p>
              I dati personali legati alla gestione degli ordini vengono conservati per un periodo minimo di 10 anni in conformità con la normativa fiscale e contabile italiana. I dati degli account registrati rimangono attivi fino a richiesta di cancellazione da parte dell&apos;utente.
            </p>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">6. Diritti dell&apos;Interessato (Art. 15-22 GDPR)</h2>
            <p>In qualunque momento l&apos;utente ha il diritto di:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Accedere ai propri dati personali e chiederne copia.</li>
              <li>Richiedere la rettifica o l&apos;aggiornamento dei dati inesatti.</li>
              <li>Richiedere la cancellazione dei dati (&quot;Diritto all&apos;oblio&quot;).</li>
              <li>Richiedere la limitazione del trattamento o opporsi allo stesso.</li>
              <li>Proporre reclamo all&apos;Autorità Garante per la Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-brand-rust underline">www.garanteprivacy.it</a>).</li>
            </ul>
            <p className="pt-2">
              Per esercitare i tuoi diritti puoi inviare una richiesta scritta via email a: <a href="mailto:info@sauilmoro.com" className="text-brand-rust underline font-bold">info@sauilmoro.com</a>.
            </p>
          </section>

          <footer className="pt-6 border-t border-gray-200 flex justify-between items-center text-xs">
            <Link href="/" className="text-brand-rust font-bold uppercase tracking-widest hover:underline">
              ← Torna allo Store
            </Link>
            <Link href="/terms" className="text-deep-black/60 font-bold uppercase tracking-widest hover:text-deep-black">
              Termini e Condizioni →
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
