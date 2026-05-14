"use client";
import React, { useState } from 'react';
import { ButtonCustom } from './ButtonCustom';

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddDiscountModal: React.FC<AddDiscountModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minSubtotal: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onSuccess();
        onClose();
        setForm({ code: '', type: 'percentage', value: '', minSubtotal: '' });
      }
    } catch {
      alert('Errore nella creazione');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <div className="bg-[#161616] border border-white/10 w-full max-w-md rounded-xl overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-display text-white uppercase">Crea Sconto</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Codice Sconto</label>
            <input name="code" value={form.code} onChange={handleChange} required placeholder="ES: ESTATE2024" className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust uppercase" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Tipo</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust">
                <option value="percentage">Percentuale (%)</option>
                <option value="fixed">Importo Fisso (€)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Valore</label>
              <input name="value" type="number" step="0.01" value={form.value} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Spesa Minima (€)</label>
            <input name="minSubtotal" type="number" step="0.01" value={form.minSubtotal} onChange={handleChange} placeholder="0" className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-brand-rust" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Annulla</button>
            <ButtonCustom type="submit" className="flex-[2]" disabled={isSubmitting}>
              {isSubmitting ? 'Creazione...' : 'Crea Codice'}
            </ButtonCustom>
          </div>
        </form>
      </div>
    </div>
  );
};
