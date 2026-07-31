"use client";

import React, { useState, useEffect, useRef } from 'react';
import { COMUNI_ITALIANI, REGIONI_ITALIANE, ComuneData } from '@/lib/comuni-italiani-db';

export type { ComuneData };

interface ItalianCityAutocompleteProps {
  cityValue: string;
  zipValue: string;
  onSelect: (city: string, zip: string) => void;
  required?: boolean;
}

export const ItalianCityAutocomplete: React.FC<ItalianCityAutocompleteProps> = ({
  cityValue,
  zipValue,
  onSelect,
  required = true,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Tutte le Regioni');
  const [query, setQuery] = useState(cityValue);
  const [suggestions, setSuggestions] = useState<ComuneData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(cityValue);
  }, [cityValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterCities = (searchTerm: string, region: string) => {
    let list = COMUNI_ITALIANI;
    if (region !== 'Tutte le Regioni') {
      list = list.filter(c => c.regione === region);
    }
    if (searchTerm.trim().length >= 1) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(c =>
        c.nome.toLowerCase().includes(term) ||
        c.provincia.toLowerCase().includes(term) ||
        c.cap.includes(term)
      );
    }
    return list.slice(0, 10);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSelect(val, zipValue);

    const matches = filterCities(val, selectedRegion);
    setSuggestions(matches);
    setIsOpen(matches.length > 0 && val.trim().length >= 1);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelectedRegion(region);
    const matches = filterCities(query, region);
    setSuggestions(matches);
    setIsOpen(matches.length > 0);
  };

  const handleSelectCity = (city: ComuneData) => {
    const cityName = `${city.nome} (${city.provincia})`;
    setQuery(cityName);
    onSelect(cityName, city.cap);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Città / Comune *
        </label>
        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-rust">
          🇮🇹 Database Comuni d&apos;Italia
        </span>
      </div>

      {/* Regioni Filter Dropdown + City Autocomplete Input */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        {/* Quick Region Selector */}
        <div className="sm:col-span-4">
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="w-full bg-stone-50 border border-gray-200 p-4 text-xs font-bold uppercase tracking-wider text-deep-black focus:outline-none focus:border-brand-rust transition-colors cursor-pointer"
            aria-label="Filtra per Regione"
          >
            {REGIONI_ITALIANE.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>

        {/* Input Ricerca Comune */}
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              const matches = filterCities(query, selectedRegion);
              if (matches.length > 0) {
                setSuggestions(matches);
                setIsOpen(true);
              }
            }}
            placeholder="Scrivi comune o provincia (es. Cagliari, Pattada, Roma...)"
            className="w-full bg-white border border-gray-200 p-4 text-sm focus:outline-none focus:border-brand-rust transition-colors"
            required={required}
            autoComplete="shipping address-level2"
          />

          {isOpen && suggestions.length > 0 && (
            <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-2xl max-h-64 overflow-y-auto divide-y divide-gray-100 rounded-sm">
              {suggestions.map((item, idx) => (
                <li
                  key={`${item.nome}-${item.provincia}-${idx}`}
                  onClick={() => handleSelectCity(item)}
                  className="p-3.5 hover:bg-brand-rust/10 cursor-pointer flex justify-between items-center transition-colors text-xs"
                >
                  <div>
                    <span className="font-bold text-deep-black text-sm">{item.nome}</span>{' '}
                    <span className="text-brand-rust font-bold">({item.provincia})</span>
                    <span className="block text-[10px] text-gray-400 font-semibold">{item.regione}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-brand-rust bg-brand-rust/10 px-2.5 py-1 rounded">
                    CAP {item.cap}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
