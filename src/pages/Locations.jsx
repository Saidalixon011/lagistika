import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { locationsData } from '../data/mockData';
import { normalizeText } from '../utils/smartSearch';
import './Locations.css';

export default function Locations() {
  const [query, setQuery] = useState('');

  const filtered = locationsData.filter((loc) => {
    const q = normalizeText(query);
    if (!q) return true;
    return normalizeText(
      `${loc.country} ${loc.region} ${loc.city} ${loc.hubName}`
    ).includes(q);
  });

  return (
    <section className="locations">
      <div className="page-header">
        <h1 className="page-title">Logistika hududlari va terminallar</h1>
      </div>

      <div className="locations__search-card">
        <div className="locations__search-box">
          <Search size={18} className="locations__search-icon" />
          <input
            type="text"
            className="locations__search-input"
            placeholder="Davlat, viloyat yoki terminal nomi bo‘yicha qidirish..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="locations__grid">
        {filtered.map((loc) => (
          <article key={loc.id} className="locations__card">
            <div className="locations__title">
              <MapPin size={17} />
              <span>
                {loc.country} — {loc.city}
              </span>
            </div>
            <p className="locations__hub">{loc.hubName}</p>
            <span className="locations__badge">
              Faol yuklar: {loc.activeCargos} ta
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}