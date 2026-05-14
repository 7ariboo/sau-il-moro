"use client";
import React, { useState } from 'react';
import { ButtonCustom } from './ButtonCustom';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    compareAtPrice: '',
    category: 'ferro',
    description: '',
    shortDescription: '',
    material: '',
    stockQuantity: '10',
    isWow: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: val }));
  };

  const addImage = () => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setImages(images.filter(img => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Aggiungi almeno un\'immagine');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
          stockQuantity: parseInt(form.stockQuantity),
          inStock: parseInt(form.stockQuantity) > 0,
          images: images,
          details: [
            { label: 'Provenienza', value: 'Sardegna, Italia' },
            { label: 'Artigianato', value: 'Fatto a mano' }
          ],
          tags: [form.category, 'novità']
        }),
      });
      if (res.ok) {
        onSuccess();
        onClose();
        setForm({
          name: '', price: '', compareAtPrice: '', category: 'ferro', description: '', shortDescription: '', material: '', stockQuantity: '10', isWow: false
        });
        setImages([]);
      }
    } catch (error) {
      alert('Errore nella creazione');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-[#161616] border border-white/10 w-full max-w-3xl rounded-xl overflow-hidden animate-fade-in my-auto">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-display text-white uppercase">Nuovo Prodotto (Shopify Style)</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Media Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-rust">Media / Immagini</h3>
            <div className="flex gap-4">
              <input 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                placeholder="URL Immagine (es. /images/prodotto.png o link esterno)"
                className="flex-1 bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust"
              />
              <button type="button" onClick={addImage} className="bg-white/10 hover:bg-white/20 text-white px-4 text-xs font-bold uppercase">Aggiungi</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img} className="relative aspect-square bg-white/5 border border-white/10 rounded overflow-hidden group">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(img)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-4 py-8 border-2 border-dashed border-white/5 text-center text-white/20 text-[10px] font-bold uppercase">Nessuna immagine caricata</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Nome</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Prezzo (€)</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Prezzo Barrato (€)</label>
                <input name="compareAtPrice" type="number" step="0.01" value={form.compareAtPrice} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white/40 focus:outline-none focus:border-brand-rust" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Categoria</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust">
                <option value="ferro">Ferro</option>
                <option value="legno">Legno</option>
                <option value="terra">Terra</option>
                <option value="carne">Carne</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Materiale</label>
              <input name="material" value={form.material} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Breve Descrizione</label>
            <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Descrizione Completa</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white h-24 focus:outline-none focus:border-brand-rust" />
          </div>

          <div className="flex items-center gap-10">
             <div className="space-y-2 flex-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Quantità Stock Totale</label>
              <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input name="isWow" type="checkbox" checked={form.isWow} onChange={handleChange} className="accent-brand-rust" />
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">In Evidenza (WOW)</label>
            </div>
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#161616] py-4 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Annulla</button>
            <ButtonCustom type="submit" className="flex-[2]" disabled={isSubmitting}>
              {isSubmitting ? 'Creazione in corso...' : 'Salva Prodotto'}
            </ButtonCustom>
          </div>
        </form>
      </div>
    </div>
  );
};
