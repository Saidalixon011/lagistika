import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { formatPhone9Digits, normalizeText } from '../utils/smartSearch';
import './Drivers.css';

export default function Drivers({
  drivers = [],
  setDrivers,
  onRequestDeleteDriver,
}) {
  const [query, setQuery] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState("O'zbekiston");
  const [truckNumber, setTruckNumber] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editTruckNumber, setEditTruckNumber] = useState('');

  const handleAddDriver = (e) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanPhone = formatPhone9Digits(phone);

    if (!cleanName || cleanName.split(' ').filter(Boolean).length < 2) {
      toast.error('Ism va familiyani to‘liq kiriting!');
      return;
    }
    if (cleanPhone.replace(/\D/g, '').length !== 9) {
      toast.error('Telefon raqami 9 ta raqamdan iborat bo‘lishi kerak!');
      return;
    }

    const newItem = {
      id: Date.now(),
      fullName: cleanName,
      phone: cleanPhone,
      country: country.trim() || "O'zbekiston",
      region: 'Asosiy hudud',
      city: 'Shahar',
      truckType: 'Fura / Yuk mashinasi',
      truckNumber: truckNumber.trim() || '01 A 001 AA',
      status: 'Bo‘sh',
      rating: 4.8,
      completedTrips: 0,
      notes: 'Haydovchilar jadvalidan qo‘shildi.',
    };

    setDrivers((prev) => [newItem, ...prev]);
    setFullName('');
    setPhone('');
    setTruckNumber('');
    toast.success(`${cleanName} jadvalga qo‘shildi`);
  };

  const startEditing = (driver) => {
    setEditingId(driver.id);
    setEditName(driver.fullName);
    setEditPhone(formatPhone9Digits(driver.phone));
    setEditCountry(driver.country);
    setEditTruckNumber(driver.truckNumber || '');
  };

  const saveEditing = (id) => {
    const cleanName = editName.trim();
    const cleanPhone = formatPhone9Digits(editPhone);

    if (!cleanName) {
      toast.error('Ism familiya bo‘sh bo‘lmasligi kerak!');
      return;
    }
    if (cleanPhone.replace(/\D/g, '').length !== 9) {
      toast.error('Telefon raqami 9 ta raqam bo‘lishi kerak!');
      return;
    }

    setDrivers((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              fullName: cleanName,
              phone: cleanPhone,
              country: editCountry.trim() || item.country,
              truckNumber: editTruckNumber.trim() || item.truckNumber,
            }
          : item
      )
    );
    setEditingId(null);
    toast.success('Ma’lumot yangilandi');
  };

  const filteredDrivers = drivers.filter((driver) => {
    const normQ = normalizeText(query);
    if (!normQ) return true;
    const haystack = normalizeText(
      `${driver.id} ${driver.fullName} ${driver.phone} ${driver.country} ${driver.region} ${driver.truckNumber}`
    );
    return haystack.includes(normQ);
  });

  return (
    <section className="drivers">
      <div className="page-header">
        <h1 className="page-title">Haydovchilar jadvali</h1>
      </div>

      <form className="drivers__create-card" onSubmit={handleAddDriver}>
        <div className="drivers__create-title">
          Yangi haydovchi / raqam yaratish
        </div>
        <div className="drivers__form-grid">
          <input
            type="text"
            className="drivers__input"
            placeholder="Ism Familiya"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            inputMode="numeric"
            className="drivers__input"
            placeholder="Tel (9 ta raqam): 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(formatPhone9Digits(e.target.value))}
          />
          <input
            type="text"
            className="drivers__input"
            placeholder="Davlat (masalan: Turkiya)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="text"
            className="drivers__input"
            placeholder="Mashina raqami"
            value={truckNumber}
            onChange={(e) => setTruckNumber(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            <Plus size={17} />
            <span>Yaratish</span>
          </button>
        </div>
      </form>

      <div className="drivers__search-card">
        <div className="drivers__search-box">
          <Search size={18} className="drivers__search-icon" />
          <input
            type="text"
            className="drivers__search-input"
            placeholder="ID, ism-familiya, telefon yoki davlat bo‘yicha qidirish..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="drivers__table-wrap">
        <table className="drivers__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ism Familiya</th>
              <th>Telefon</th>
              <th>Davlat</th>
              <th>Mashina raqami</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver, index) => {
              const isEditing = editingId === driver.id;

              return (
                <tr key={driver.id}>
                  <td>{index + 1}</td>

                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="drivers__input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      <Link
                        to={`/profile/driver/${driver.id}`}
                        className="drivers__name-link"
                      >
                        {driver.fullName}
                      </Link>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        inputMode="numeric"
                        className="drivers__input"
                        value={editPhone}
                        onChange={(e) =>
                          setEditPhone(formatPhone9Digits(e.target.value))
                        }
                      />
                    ) : (
                      `+998 ${driver.phone}`
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="drivers__input"
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                      />
                    ) : (
                      driver.country
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="drivers__input"
                        value={editTruckNumber}
                        onChange={(e) => setEditTruckNumber(e.target.value)}
                      />
                    ) : (
                      driver.truckNumber || '—'
                    )}
                  </td>

                  <td>
                    <div className="drivers__actions">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            onClick={() => saveEditing(driver.id)}
                          >
                            <Check size={14} />
                            <span>Saqlash</span>
                          </button>
                          <button
                            type="button"
                            className="drivers__edit-btn"
                            onClick={() => setEditingId(null)}
                          >
                            <X size={14} />
                            <span>Bekor</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="drivers__edit-btn"
                            onClick={() => startEditing(driver)}
                          >
                            <Edit3 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="drivers__delete-btn"
                            onClick={() =>
                              onRequestDeleteDriver && onRequestDeleteDriver(driver)
                            }
                          >
                            <Trash2 size={14} />
                            <span>O‘chirish</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}