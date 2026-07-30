import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Termini e Condizioni di Vendita | Sau Il Moro',
  description: 'Termini e Condizioni generali di vendita e-commerce di Sau Il Moro (Direttiva UE sui diritti dei consumatori 2011/83/UE).',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-stone-texture flex flex-col">
      <Header />
      <div className="container mx-auto px-6 pt-36 pb-24 flex-1 max-w-4xl">
        <div className="bg-white p-8 md:p-14 shadow-lg rounded-sm space-y-8">
          <header className="border-b border-gray-200 pb-6">
            <span className="text-brand-rust font-bold uppercase text-xs tracking-widest block mb-2">Conformità Direttiva UE 2011/83/UE (Codice del Consumo)</span>
            <h1 className="text-3xl md:text-5xl font-display font-bold uppercase">Termini e Condizioni di Vendita</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Ultimo aggiornamento: Luglio 2026</p>
          </header>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">1. Dati del Venditore</h2>
            <p>
              I prodotti acquistati sul sito web <strong>sauilmoro.it</strong> sono venduti direttamente da:<br />
              <strong>Near di Diana Gabriele</strong> (titolare del brand Sau Il Moro)<br />
              Partita IVA: <span className="font-mono text-brand-rust font-bold">14470190969</span><br />
              Sede Legale: Sardegna, Italia<br />
              Email Assistenza Clienti: <a href="mailto:ordini@sauilmoro.com" className="text-brand-rust underline font-bold">ordini@sauilmoro.com</a>
            </p>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">2. Oggetto e Prodotti Artigianali</h2>
            <p>
              Le presenti Condizioni Generali regolano la vendita dei prodotti artigianali della tradizione sarda presenti sul sito (coltelleria forgiata a mano, manufatti in legno, ceramica e norcineria).<br />
              Trattandosi di prodotti realizzati interamente a mano o con materiali naturali (corno, legno secolare, ferro battuto), eventuali piccole variazioni nelle venature, nel colore o nelle dimensioni rappresentano un pregio e la prova dell&apos;unicità del pezzo artigianale e non un difetto di fabbricazione.
            </p>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">3. Prezzi e Modalità di Pagamento</h2>
            <p>
              Tutti i prezzi indicati sul sito sono espressi in Euro (€) ed inclusivi di IVA di legge. Le spese di spedizione vengono calcolate chiaramente al momento del checkout.<br />
              Spedizione gratuita per ordini pari o superiori a <strong>150 €</strong>.<br />
              I pagamenti avvengono in modo totalmente sicuro tramite l&apos;infrastruttura <strong>Stripe Inc.</strong> (supporta carte di credito, carte di debito, Apple Pay e Google Pay).
            </p>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">4. Spedizione e Consegna</h2>
            <p>
              Le spedizioni vengono effettuate tramite Corriere Espresso in tutta Italia ed Europa.<br />
              I tempi medi di consegna sono di <strong>2-4 giorni lavorativi</strong> per l&apos;Italia continentale e le isole.<br />
              Al momento della spedizione, il cliente riceverà un&apos;email di conferma con il codice di tracciamento (tracking number).
            </p>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">5. Diritto di Recesso (14 Giorni - Direttiva UE)</h2>
            <p>
              Ai sensi dell&apos;art. 52 del Codice del Consumo (D.Lgs. 206/2005) e della Direttiva UE 2011/83/UE, il cliente consumatore ha il diritto di recedere dal contratto di acquisto, senza indicarne le ragioni, entro <strong>14 (quattordici) giorni</strong> dalla ricezione dei beni.
            </p>
            <div className="p-4 bg-gray-50 border-l-4 border-brand-rust text-xs space-y-2">
              <p><strong>Come esercitare il recesso:</strong> Invia un&apos;email a <a href="mailto:ordini@sauilmoro.com" className="text-brand-rust underline font-bold">ordini@sauilmoro.com</a> indicando il numero d&apos;ordine e la volontà di restituire il prodotto.</p>
              <p><strong>Restituzione:</strong> I prodotti devono essere restituiti integri, nella confezione originale e in perfetto stato di conservazione entro 14 giorni dalla comunicazione del recesso. Le spese dirette di spedizione per la restituzione sono a carico del cliente.</p>
              <p><strong>Rimborso:</strong> A ricezione del reso e verifica dell&apos;integrità, provvederemo al rimborso completo dell&apos;importo pagato sullo stesso metodo di pagamento utilizzato in fase d&apos;acquisto entro 5 giorni lavorativi.</p>
            </div>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">6. Garanzia Legale di Conformità (24 Mesi)</h2>
            <p>
              Tutti i prodotti venduti sono coperti dalla Garanzia Legale di Conformità di <strong>24 mesi</strong> prevista dagli articoli 128 e ss. del Codice del Consumo per i consumatori. In caso di difetto di conformità preesistente alla consegna, il cliente ha diritto al ripristino, senza spese, della conformità del bene mediante riparazione o sostituzione.
            </p>
          </section>

          <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-lg font-display font-bold uppercase text-deep-black">7. Risoluzione Online delle Controversie (ODR)</h2>
            <p>
              Ai sensi dell&apos;Art. 14 del Regolamento UE n. 524/2013, si informa il consumatore che per la risoluzione delle controversie online è disponibile la piattaforma europea ODR gestita dalla Commissione Europea, accessibile al seguente indirizzo:<br />
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-brand-rust font-bold underline">https://ec.europa.eu/consumers/odr</a>
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
    </main>
  );
}
