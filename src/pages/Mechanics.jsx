import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Plus, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { mechanicsData as initialMechanics } from '../data/mockData';
import { formatPhone9Digits, normalizeText } from '../utils/smartSearch';
import './Mechanics.css';

export default function Mechanics() {
  const [mechanics, setMechanics] = useState(initialMechanics);
  const [query, setQuery] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState("O'zbekiston");
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const cleanPhone = formatPhone9Digits(phone);
    if (!fullName.trim() || cleanPhone.replace(/\D/g, '').length !== 9) {
      toast.error('Usta nomi va 9 xonali telefon raqamini kiriting!');
      return;
    }

    const item = {
      id: Date.now(),
      fullName: fullName.trim(),
      phone: cleanPhone,
      country: country.trim() || "O'zbekiston",
      region: city.trim() || 'Asosiy hudud',
      city: city.trim() || 'Shahar',
      specialty: specialty.trim() || 'Yuk mashinalari servisi',
      address: 'Manzil kelishiladi',
      rating: 4.9,
    };

    setMechanics((prev) => [item, ...prev]);
    setFullName('');
    setPhone('');
    setCity('');
    setSpecialty('');
    toast.success('Yangi usta qo‘shildi');
  };

  const filtered = mechanics.filter((m) => {
    const q = normalizeText(query);
    if (!q) return true;
    return normalizeText(
      `${m.fullName} ${m.phone} ${m.country} ${m.city} ${m.specialty}`
    ).includes(q);
  });

  return (
    <section className="mechanics">
      <div className="page-header">
        <h1 className="page-title">Ustalar va texnik servis</h1>
      </div>

      <form className="mechanics__card" onSubmit={handleAdd}>
        <div className="mechanics__grid">
          <input
            type="text"
            className="mechanics__input"
            placeholder="Usta yoki servis nomi"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            inputMode="numeric"
            className="mechanics__input"
            placeholder="Tel (9 ta raqam): 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(formatPhone9Digits(e.target.value))}
          />
          <input
            type="text"
            className="mechanics__input"
            placeholder="Davlat"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="text"
            className="mechanics__input"
            placeholder="Shahar / Hudud"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            className="mechanics__input"
            placeholder="Yo‘nalishi"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            <Plus size={17} />
            <span>Qo‘shish</span>
          </button>
        </div>
      </form>

      <div className="mechanics__card">
        <div className="mechanics__search-box">
          <Search size={18} className="mechanics__search-icon" />
          <input
            type="text"
            className="mechanics__search-input"
            placeholder="Usta, davlat, shahar yoki xizmat bo‘yicha qidirish..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mechanics__list">
        {filtered.map((m) => (
          <article key={m.id} className="mechanics__item">
            <Link to={`/profile/mechanic/${m.id}`} className="mechanics__name">
              {m.fullName}
            </Link>
            <p className="mechanics__spec">{m.specialty}</p>
            <div className="mechanics__meta">
              <span>
                <MapPin size={14} /> {m.country}, {m.city}
              </span>
              <span>
                <Phone size={14} /> +998 {m.phone}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}