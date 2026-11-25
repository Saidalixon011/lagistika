import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Edit3, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { debtorsData as initialDebtorsData } from '../data/mockData';
import { formatPhone9Digits, normalizeText } from '../utils/smartSearch';
import './Debtors.css';

export default function Debtors() {
  const [debtors, setDebtors] = useState(initialDebtorsData);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState("O'zbekiston");
  const [region, setRegion] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [reason, setReason] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editStatus, setEditStatus] = useState('Kutilmoqda');

  const handleCreate = (e) => {
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

    const newDebtor = {
      id: Date.now(),
      fullName: cleanName,
      phone: cleanPhone,
      country: country.trim() || "O'zbekiston",
      region: region.trim() || 'Toshkent',
      city: region.trim() || 'Toshkent shahri',
      debtAmount: debtAmount.trim() || 'Kelishilmagan',
      status: 'Kutilmoqda',
      dueDate: '2026-12-15',
      reason: reason.trim() || 'Qarzdorlik bo‘limidan kiritildi.',
    };

    setDebtors((prev) => [newDebtor, ...prev]);
    setFullName('');
    setPhone('');
    setRegion('');
    setDebtAmount('');
    setReason('');
    toast.success(`${cleanName} qarzdorlar ro‘yxatiga qo‘shildi`);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.fullName);
    setEditPhone(formatPhone9Digits(item.phone));
    setEditAmount(item.debtAmount || '');
    setEditStatus(item.status || 'Kutilmoqda');
  };

  const saveEdit = (id) => {
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

    setDebtors((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              fullName: cleanName,
              phone: cleanPhone,
              debtAmount: editAmount.trim() || item.debtAmount,
              status: editStatus,
            }
          : item
      )
    );
    setEditingId(null);
    toast.success('Qarzdor ma’lumoti yangilandi');
  };

  const handleDelete = (item) => {
    setDebtors((prev) => prev.filter((row) => row.id !== item.id));
    toast.info(`${item.fullName} ro‘yxatdan o‘chirildi`);
  };

  const filteredDebtors = useMemo(() => {
    return debtors.filter((item) => {
      const okStatus =
        statusFilter === 'all' || item.status === statusFilter;
      const normQ = normalizeText(query);
      if (!normQ) return okStatus;

      const haystack = normalizeText(
        `${item.id} ${item.fullName} ${item.phone} ${item.country} ${item.region} ${item.debtAmount} ${item.reason}`
      );
      return okStatus && haystack.includes(normQ);
    });
  }, [debtors, query, statusFilter]);

  return (
    <section className="debtors">
      <div className="page-header">
        <h1 className="page-title">Qarzdorlar va huquqiy nazorat</h1>
      </div>

      <form className="debtors__create-card" onSubmit={handleCreate}>
        <div className="debtors__create-title">Yangi qarzdor qo‘shish</div>
        <div className="debtors__form-grid">
          <input
            type="text"
            className="debtors__input"
            placeholder="Ism Familiya"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            inputMode="numeric"
            className="debtors__input"
            placeholder="Tel (9 ta raqam): 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(formatPhone9Digits(e.target.value))}
          />
          <input
            type="text"
            className="debtors__input"
            placeholder="Davlat"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="text"
            className="debtors__input"
            placeholder="Viloyat / Hudud"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
          <input
            type="text"
            className="debtors__input"
            placeholder="Qarz summasi (masalan: $1,200)"
            value={debtAmount}
            onChange={(e) => setDebtAmount(e.target.value)}
          />
          <input
            type="text"
            className="debtors__input"
            placeholder="Sababi / izoh"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            <Plus size={17} />
            <span>Qo‘shish</span>
          </button>
        </div>
      </form>

      <div className="debtors__controls">
        <div className="debtors__search-row">
          <div className="debtors__search-box">
            <Search size={18} className="debtors__search-icon" />
            <input
              type="text"
              className="debtors__search-input"
              placeholder="Ism-familiya, telefon, davlat yoki summa bo‘yicha qidirish..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            className="debtors__select"
            style={{ maxWidth: '210px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Barcha holatlar</option>
            <option value="Kutilmoqda">Kutilmoqda</option>
            <option value="Yopilgan">Yopilgan</option>
          </select>

          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              setQuery('');
              setStatusFilter('all');
            }}
          >
            <RotateCcw size={16} />
            <span>Tozalash</span>
          </button>
        </div>
      </div>

      {filteredDebtors.length === 0 ? (
        <div className="debtors__empty">
          <p>Qidiruv yoki filtr bo‘yicha qarzdor topilmadi.</p>
        </div>
      ) : (
        <div className="debtors__table-wrap">
          <table className="debtors__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ism Familiya</th>
                <th>Telefon</th>
                <th>Hudud</th>
                <th>Summa</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredDebtors.map((item, idx) => {
                const isEditing = editingId === item.id;
                const isSettled = item.status === 'Yopilgan';

                return (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          className="debtors__input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        <Link
                          to={`/profile/debtor/${item.id}`}
                          className="debtors__name-link"
                        >
                          {item.fullName}
                        </Link>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          className="debtors__input"
                          value={editPhone}
                          onChange={(e) =>
                            setEditPhone(formatPhone9Digits(e.target.value))
                          }
                        />
                      ) : (
                        `+998 ${item.phone}`
                      )}
                    </td>
                    <td>
                      {item.country}, {item.region}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          className="debtors__input"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                        />
                      ) : (
                        <span className="debtors__amount">
                          {item.debtAmount}
                        </span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <select
                          className="debtors__select"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option value="Kutilmoqda">Kutilmoqda</option>
                          <option value="Yopilgan">Yopilgan</option>
                        </select>
                      ) : (
                        <span
                          className={`debtors__badge ${
                            isSettled ? 'debtors__badge--settled' : ''
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="debtors__actions">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="btn-primary"
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                              onClick={() => saveEdit(item.id)}
                            >
                              <Check size={14} />
                              <span>Saqlash</span>
                            </button>
                            <button
                              type="button"
                              className="debtors__edit-btn"
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
                              className="debtors__edit-btn"
                              onClick={() => startEdit(item)}
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="debtors__delete-btn"
                              onClick={() => handleDelete(item)}
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
      )}
    </section>
  );
}