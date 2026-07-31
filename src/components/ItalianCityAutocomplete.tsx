"use client";

import React, { useState, useEffect, useRef } from 'react';

export interface CityData {
  nome: string;
  provincia: string;
  cap: string;
  regione?: string;
}

// Popular and comprehensive Italian cities list for instant client-side autocomplete
const POPULAR_ITALIAN_CITIES: CityData[] = [
  // Sardegna
  { nome: 'Cagliari', provincia: 'CA', cap: '09121', regione: 'Sardegna' },
  { nome: 'Sassari', provincia: 'SS', cap: '07100', regione: 'Sardegna' },
  { nome: 'Nuoro', provincia: 'NU', cap: '08100', regione: 'Sardegna' },
  { nome: 'Oristano', provincia: 'OR', cap: '09170', regione: 'Sardegna' },
  { nome: 'Olbia', provincia: 'SS', cap: '07026', regione: 'Sardegna' },
  { nome: 'Alghero', provincia: 'SS', cap: '07041', regione: 'Sardegna' },
  { nome: 'Quartu Sant\'Elena', provincia: 'CA', cap: '09045', regione: 'Sardegna' },
  { nome: 'Iglesias', provincia: 'SU', cap: '09016', regione: 'Sardegna' },
  { nome: 'Carbonia', provincia: 'SU', cap: '09013', regione: 'Sardegna' },
  { nome: 'Arbus', provincia: 'SU', cap: '09031', regione: 'Sardegna' },
  { nome: 'Pattada', provincia: 'SS', cap: '07016', regione: 'Sardegna' },
  { nome: 'Tempio Pausania', provincia: 'SS', cap: '07029', regione: 'Sardegna' },
  { nome: 'Ozieri', provincia: 'SS', cap: '07014', regione: 'Sardegna' },
  { nome: 'Macomer', provincia: 'NU', cap: '08015', regione: 'Sardegna' },
  { nome: 'Bosa', provincia: 'OR', cap: '08013', regione: 'Sardegna' },
  { nome: 'Tortolì', provincia: 'NU', cap: '08048', regione: 'Sardegna' },
  { nome: 'Lanusei', provincia: 'NU', cap: '08045', regione: 'Sardegna' },
  { nome: 'Dorgali', provincia: 'NU', cap: '08022', regione: 'Sardegna' },
  { nome: 'Orosei', provincia: 'NU', cap: '08028', regione: 'Sardegna' },
  { nome: 'Siniscola', provincia: 'NU', cap: '08029', regione: 'Sardegna' },
  { nome: 'Sanluri', provincia: 'SU', cap: '09025', regione: 'Sardegna' },

  // Altre principali città italiane
  { nome: 'Roma', provincia: 'RM', cap: '00100', regione: 'Lazio' },
  { nome: 'Milano', provincia: 'MI', cap: '20100', regione: 'Lombardia' },
  { nome: 'Napoli', provincia: 'NA', cap: '80100', regione: 'Campania' },
  { nome: 'Torino', provincia: 'TO', cap: '10100', regione: 'Piemonte' },
  { nome: 'Palermo', provincia: 'PA', cap: '90100', regione: 'Sicilia' },
  { nome: 'Genova', provincia: 'GE', cap: '16100', regione: 'Liguria' },
  { nome: 'Bologna', provincia: 'BO', cap: '40100', regione: 'Emilia-Romagna' },
  { nome: 'Firenze', provincia: 'FI', cap: '50100', regione: 'Toscana' },
  { nome: 'Bari', provincia: 'BA', cap: '70100', regione: 'Puglia' },
  { nome: 'Catania', provincia: 'CT', cap: '95100', regione: 'Sicilia' },
  { nome: 'Venezia', provincia: 'VE', cap: '30100', regione: 'Veneto' },
  { nome: 'Verona', provincia: 'VR', cap: '37100', regione: 'Veneto' },
  { nome: 'Messina', provincia: 'ME', cap: '98100', regione: 'Sicilia' },
  { nome: 'Padova', provincia: 'PD', cap: '35100', regione: 'Veneto' },
  { nome: 'Trieste', provincia: 'TS', cap: '34100', regione: 'Friuli-Venezia Giulia' },
  { nome: 'Brescia', provincia: 'BS', cap: '25100', regione: 'Lombardia' },
  { nome: 'Parma', provincia: 'PR', cap: '43100', regione: 'Emilia-Romagna' },
  { nome: 'Taranto', provincia: 'TA', cap: '74100', regione: 'Puglia' },
  { nome: 'Prato', provincia: 'PO', cap: '59100', regione: 'Toscana' },
  { nome: 'Modena', provincia: 'MO', cap: '41100', regione: 'Emilia-Romagna' },
  { nome: 'Reggio Calabria', provincia: 'RC', cap: '89100', regione: 'Calabria' },
  { nome: 'Reggio Emilia', provincia: 'RE', cap: '42100', regione: 'Emilia-Romagna' },
  { nome: 'Perugia', provincia: 'PG', cap: '06100', regione: 'Umbria' },
  { nome: 'Livorno', provincia: 'LI', cap: '57100', regione: 'Toscana' },
  { nome: 'Ravenna', provincia: 'RA', cap: '48100', regione: 'Emilia-Romagna' },
  { nome: 'Foggia', provincia: 'FG', cap: '71100', regione: 'Puglia' },
  { nome: 'Rimini', provincia: 'RN', cap: '47900', regione: 'Emilia-Romagna' },
  { nome: 'Salerno', provincia: 'SA', cap: '84100', regione: 'Campania' },
  { nome: 'Ferrara', provincia: 'FE', cap: '44100', regione: 'Emilia-Romagna' },
  { nome: 'Monza', provincia: 'MB', cap: '20900', regione: 'Lombardia' },
  { nome: 'Bergamo', provincia: 'BG', cap: '24100', regione: 'Lombardia' },
  { nome: 'Pescara', provincia: 'PE', cap: '65100', regione: 'Abruzzo' },
  { nome: 'Trento', provincia: 'TN', cap: '38100', regione: 'Trentino-Alto Adige' },
  { nome: 'Forlì', provincia: 'FC', cap: '47100', regione: 'Emilia-Romagna' },
  { nome: 'Vicenza', provincia: 'VI', cap: '36100', regione: 'Veneto' },
  { nome: 'Terni', provincia: 'TR', cap: '05100', regione: 'Umbria' },
  { nome: 'Bolzano', provincia: 'BZ', cap: '39100', regione: 'Trentino-Alto Adige' },
  { nome: 'Piacenza', provincia: 'PC', cap: '29100', regione: 'Emilia-Romagna' },
  { nome: 'Ancona', provincia: 'AN', cap: '60100', regione: 'Marche' },
  { nome: 'Arezzo', provincia: 'AR', cap: '52100', regione: 'Toscana' },
  { nome: 'Udine', provincia: 'UD', cap: '33100', regione: 'Friuli-Venezia Giulia' },
  { nome: 'Cesena', provincia: 'FC', cap: '47521', regione: 'Emilia-Romagna' },
  { nome: 'Lecce', provincia: 'LE', cap: '73100', regione: 'Puglia' },
  { nome: 'La Spezia', provincia: 'SP', cap: '19100', regione: 'Liguria' },
  { nome: 'Alessandria', provincia: 'AL', cap: '15100', regione: 'Piemonte' },
  { nome: 'Pisa', provincia: 'PI', cap: '56100', regione: 'Toscana' },
  { nome: 'Treviso', provincia: 'TV', cap: '31100', regione: 'Veneto' },
];

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
  const [query, setQuery] = useState(cityValue);
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSelect(val, zipValue);

    if (val.trim().length >= 2) {
      const filtered = POPULAR_ITALIAN_CITIES.filter(c =>
        c.nome.toLowerCase().includes(val.toLowerCase()) ||
        c.provincia.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelectCity = (city: CityData) => {
    const cityName = `${city.nome} (${city.provincia})`;
    setQuery(cityName);
    onSelect(cityName, city.cap);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Città / Comune
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 2 && suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Cerca il tuo comune (es. Cagliari, Roma, Pattada...)"
          className="w-full bg-white border border-gray-200 p-4 text-sm focus:outline-none focus:border-brand-rust transition-colors"
          required={required}
          autoComplete="shipping address-level2"
        />
        {isOpen && suggestions.length > 0 && (
          <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
            {suggestions.map((item, idx) => (
              <li
                key={`${item.nome}-${idx}`}
                onClick={() => handleSelectCity(item)}
                className="p-3 hover:bg-brand-rust/10 cursor-pointer flex justify-between items-center transition-colors text-xs"
              >
                <div>
                  <span className="font-bold text-deep-black">{item.nome}</span>{' '}
                  <span className="text-brand-rust font-semibold">({item.provincia})</span>
                  {item.regione && (
                    <span className="text-[10px] text-gray-400 ml-2">[{item.regione}]</span>
                  )}
                </div>
                <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  CAP: {item.cap}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
