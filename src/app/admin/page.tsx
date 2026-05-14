"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ButtonCustom } from '@/components/ButtonCustom';
import Image from 'next/image';
import { AddProductModal } from '@/components/AddProductModal';
import { EditProductModal } from '@/components/EditProductModal';
import { AddDiscountModal } from '@/components/AddDiscountModal';
import { Product, Order, DiscountCode } from '@/lib/types';

type AdminTab = 'overview' | 'products' | 'orders' | 'customers' | 'newsletter' | 'discounts';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-rust border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-display text-white uppercase">Accesso Negato</h1>
          <p className="text-white/50 text-sm">Devi essere un amministratore per accedere a questa pagina.</p>
          <Link href="/account"><ButtonCustom>Vai al Login</ButtonCustom></Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Dashboard 
        user={user} 
        refreshKey={refreshKey} 
        onAdd={() => setIsAddModalOpen(true)} 
        onAddDiscount={() => setIsDiscountModalOpen(true)}
        onEdit={(p) => setEditingProduct(p)}
        onRefresh={() => setRefreshKey(prev => prev + 1)} 
      />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />
      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />
      <AddDiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />
    </>
  );
}

function Dashboard({ 
  user, 
  refreshKey, 
  onAdd, 
  onAddDiscount,
  onEdit,
  onRefresh 
}: { 
  user: { name: string; surname: string; email: string }, 
  refreshKey: number, 
  onAdd: () => void, 
  onAddDiscount: () => void,
  onEdit: (p: Product) => void,
  onRefresh: () => void 
}) {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [search, setSearch] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    fetch('/api/products?limit=100').then(r => r.json()).then(d => d.success && setProducts(d.data));
    fetch('/api/orders').then(r => r.json()).then(d => d.success && setOrders(d.data));
    fetch('/api/discounts').then(r => r.json()).then(d => d.success && setDiscounts(d.data));
  }, [refreshKey]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch {
      alert('Errore nella cancellazione');
    }
  };

  const handleDeleteDiscount = async (code: string) => {
    if (!confirm(`Vuoi eliminare il codice ${code}?`)) return;
    try {
      const res = await fetch(`/api/discounts?code=${code}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch {
      alert('Errore nella cancellazione');
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) onRefresh();
    } catch {
      alert('Errore nell\'aggiornamento dell\'ordine');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Panoramica', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { key: 'products', label: 'Prodotti', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> },
    { key: 'orders', label: 'Ordini', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16h6"/><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16"/></svg> },
    { key: 'customers', label: 'Clienti', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { key: 'newsletter', label: 'Newsletter', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
    { key: 'discounts', label: 'Sconti', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 15l-3.5-3.5"/><path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z"/><path d="m15 9-3.5 3.5"/></svg> },
  ];

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161616] border-r border-white/5 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-rust rounded-lg flex items-center justify-center text-white font-display font-bold text-sm">SM</div>
            <div>
              <p className="text-white font-display text-sm font-bold">SAU IL MORO</p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                tab === t.key
                  ? 'bg-brand-rust text-white shadow-lg shadow-brand-rust/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-brand-rust/20 text-brand-rust rounded-full flex items-center justify-center text-xs font-bold">
              {user.name[0]}{user.surname[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{user.name} {user.surname}</p>
              <p className="text-white/30 text-[10px] truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <button className="w-full text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors py-2 border border-white/10 rounded hover:border-white/20">
                Sito
              </button>
            </Link>
            <button onClick={logout} className="flex-1 text-[10px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors py-2 border border-white/10 rounded hover:border-red-400/30">
              Esci
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-display text-white uppercase">Dashboard</h1>
              <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Panoramica generale</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard label="Fatturato" value={`${totalRevenue} €`} change="+12.5%" color="text-green-400" />
              <KpiCard label="Ordini" value={`${orders.length}`} change={orders.length > 0 ? '+1 oggi' : 'Nessuno'} color="text-brand-rust" />
              <KpiCard label="Prodotti" value={`${products.length}`} change={`${totalStock} in stock`} color="text-blue-400" />
              <KpiCard label="Conversione" value="3.2%" change="+0.4%" color="text-purple-400" />
            </div>

            <div className="bg-[#161616] border border-white/5 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-display uppercase tracking-wider">Ordini Recenti</h2>
                <button onClick={() => setTab('orders')} className="text-[10px] text-brand-rust font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Vedi tutti →
                </button>
              </div>
              {orders.length === 0 ? (
                <p className="text-white/20 text-center py-12 text-xs uppercase tracking-widest">Nessun ordine ricevuto</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-white text-xs font-bold">{order.id}</p>
                        <p className="text-white/30 text-[10px]">{order.customer.name} {order.customer.surname}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-brand-rust font-display font-bold">{order.total} €</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display text-white uppercase">Prodotti</h1>
                <p className="text-white/30 text-xs uppercase tracking-widest mt-1">{products.length} prodotti nel catalogo</p>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Cerca prodotto..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-[#161616] border border-white/10 rounded-lg py-2 px-4 text-xs text-white focus:outline-none focus:border-brand-rust w-64"
                  />
                </div>
                <ButtonCustom size="sm" onClick={onAdd}>+ Nuovo Prodotto</ButtonCustom>
              </div>
            </div>

            <div className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-6 py-4">Prodotto</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Categoria</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Prezzo</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Stock</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Stato</th>
                    <th className="text-right text-[10px] text-white/30 font-bold uppercase tracking-widest px-6 py-4">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-white/5 rounded overflow-hidden shrink-0">
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />
                          </div>
                          <div>
                            <p className="text-white text-xs font-bold">{p.name}</p>
                            <p className="text-white/30 text-[10px]">{p.material}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/5 px-2 py-1 rounded">{p.category}</span>
                      </td>
                      <td className="px-4 py-4 text-white font-display font-bold text-sm">{p.price} €</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-bold ${p.stockQuantity <= 5 ? 'text-red-400' : p.stockQuantity <= 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${p.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {p.inStock ? 'Attivo' : 'Esaurito'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => onEdit(p)} className="text-white/30 hover:text-brand-rust transition-colors p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="text-white/20 hover:text-red-500 transition-colors p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-display text-white uppercase">Ordini</h1>
              <p className="text-white/30 text-xs uppercase tracking-widest mt-1">{orders.length} ordini totali</p>
            </div>

            <div className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-6 py-4">Ordine</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Cliente</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Pagamento</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Evasione</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Totale</th>
                    <th className="text-right text-[10px] text-white/30 font-bold uppercase tracking-widest px-6 py-4">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-brand-rust text-xs font-bold">{order.id}</p>
                        <p className="text-white/30 text-[10px]">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-white text-xs font-bold">{order.customer.name} {order.customer.surname}</p>
                        <p className="text-white/30 text-[10px]">{order.customer.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                          order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.paymentStatus === 'paid' ? 'Pagato' : 'In attesa'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-[#202020] border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-white py-1 px-2 focus:outline-none focus:border-brand-rust"
                        >
                          <option value="pending">Non evasionato</option>
                          <option value="confirmed">Confermato</option>
                          <option value="processing">In lavorazione</option>
                          <option value="shipped">Spedito</option>
                          <option value="delivered">Consegnato</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-white font-display font-bold">{order.total} €</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                          Dettagli
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Discounts Tab */}
        {tab === 'discounts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display text-white uppercase">Codici Sconto</h1>
                <p className="text-white/30 text-xs uppercase tracking-widest mt-1">{discounts.length} promozioni attive</p>
              </div>
              <ButtonCustom size="sm" onClick={onAddDiscount}>+ Crea Codice</ButtonCustom>
            </div>

            <div className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-6 py-4">Codice</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Tipo</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Valore</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Spesa Min.</th>
                    <th className="text-left text-[10px] text-white/30 font-bold uppercase tracking-widest px-4 py-4">Stato</th>
                    <th className="text-right text-[10px] text-white/30 font-bold uppercase tracking-widest px-6 py-4">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {discounts.map(d => (
                    <tr key={d.code} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-bold text-xs">{d.code}</td>
                      <td className="px-4 py-4 text-white/50 text-[10px] uppercase font-bold">{d.type === 'percentage' ? 'Percentuale' : 'Fisso'}</td>
                      <td className="px-4 py-4 text-brand-rust font-display font-bold">
                        {d.type === 'percentage' ? `${d.value}%` : `${d.value} €`}
                      </td>
                      <td className="px-4 py-4 text-white/30 text-xs">{d.minSubtotal} €</td>
                      <td className="px-4 py-4"><span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded">Attivo</span></td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => handleDeleteDiscount(d.code)} className="text-white/20 hover:text-red-500 transition-colors p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {discounts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-white/20 text-xs uppercase tracking-widest">Nessun codice sconto creato</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function KpiCard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
  return (
    <div className="bg-[#161616] border border-white/5 rounded-xl p-5">
      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3">{label}</p>
      <p className="text-white text-2xl font-display font-bold">{value}</p>
      <p className={`${color} text-[10px] font-bold mt-2`}>{change}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    processing: 'bg-purple-500/20 text-purple-400',
    shipped: 'bg-cyan-500/20 text-cyan-400',
    delivered: 'bg-green-500/20 text-green-400',
  };
  const labels: Record<string, string> = {
    pending: 'In attesa',
    confirmed: 'Confermato',
    processing: 'In lavorazione',
    shipped: 'Spedito',
    delivered: 'Consegnato',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${styles[status] || 'bg-white/10 text-white/30'}`}>
      {labels[status] || status}
    </span>
  );
}
