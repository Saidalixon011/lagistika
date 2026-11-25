import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { debtorsData, mechanicsData } from '../data/mockData';
import './Profile.css';

export default function Profile({ drivers = [] }) {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const person = useMemo(() => {
    const numId = Number(id);
    if (type === 'driver') {
      const d = drivers.find((item) => Number(item.id) === numId);
      return d ? { ...d, roleLabel: 'Haydovchi' } : null;
    }
    if (type === 'debtor') {
      const d = debtorsData.find((item) => Number(item.id) === numId);
      return d ? { ...d, roleLabel: 'Qarzdor' } : null;
    }
    if (type === 'mechanic') {
      const m = mechanicsData.find((item) => Number(item.id) === numId);
      return m ? { ...m, roleLabel: 'Usta / Servis' } : null;
    }
    return null;
  }, [type, id, drivers]);

  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  if (!person) {
    return (
      <section className="profile">
        <button
          type="button"
          className="profile__back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span>Orqaga</span>
        </button>
        <div className="profile__not-found">
          <p>Bunday profil topilmadi.</p>
        </div>
      </section>
    );
  }

  const initials = person.fullName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setNotes((prev) => [note.trim(), ...prev]);
    setNote('');
    toast.success('Izoh saqlandi');
  };

  return (
    <section className="profile">
      <button
        type="button"
        className="profile__back-btn"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        <span>Orqaga qaytish</span>
      </button>

      <div className="profile__card">
        <div className="profile__header">
          <div className="profile__identity">
            <div className="profile__avatar">{initials}</div>
            <div>
              <span className="profile__role-badge">{person.roleLabel}</span>
              <h1 className="profile__name">{person.fullName}</h1>
              <div className="profile__place">
                <MapPin size={15} />
                <span>
                  {person.country}, {person.region}, {person.city}
                </span>
              </div>
            </div>
          </div>

          <a
            href={`tel:+998${String(person.phone).replace(/\s+/g, '')}`}
            className="btn-primary"
          >
            <Phone size={17} />
            <span>+998 {person.phone}</span>
          </a>
        </div>

        <div className="profile__grid">
          <div className="profile__info-box">
            <div className="profile__info-label">Davlat</div>
            <div className="profile__info-value">{person.country}</div>
          </div>
          <div className="profile__info-box">
            <div className="profile__info-label">Viloyat / Hudud</div>
            <div className="profile__info-value">{person.region}</div>
          </div>
          <div className="profile__info-box">
            <div className="profile__info-label">Shahar</div>
            <div className="profile__info-value">{person.city}</div>
          </div>

          {type === 'driver' && (
            <>
              <div className="profile__info-box">
                <div className="profile__info-label">Telefon</div>
                <div className="profile__info-value">+998 {person.phone}</div>
              </div>
              <div className="profile__info-box">
                <div className="profile__info-label">Mashina raqami</div>
                <div className="profile__info-value">{person.truckNumber}</div>
              </div>
              <div className="profile__info-box">
                <div className="profile__info-label">Holati</div>
                <div className="profile__info-value">{person.status}</div>
              </div>
            </>
          )}
        </div>

        <div className="profile__note-section">
          <div className="profile__note-title">Qo‘shimcha izohlar</div>
          <p className="profile__note-text">
            {person.notes || person.reason || person.address}
          </p>
          {notes.map((item, i) => (
            <p key={i} className="profile__note-text">
              • {item}
            </p>
          ))}
          <form className="profile__note-form" onSubmit={handleAddNote}>
            <input
              type="text"
              className="profile__note-input"
              placeholder="Yangi izoh yozing..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Saqlash</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}