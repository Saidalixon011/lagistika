import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { routes } from './route/Route';
import {
  driversData as initialDriversData,
  initialCargos as initialCargosData,
  liveIncomingCargos,
  telegramChannels,
} from './data/mockData';
import { formatPhone9Digits } from './utils/smartSearch';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const STORAGE_KEYS = {
  USER: 'logistika_user_v6',
  DRIVERS: 'logistika_drivers_v6',
  CARGOS: 'logistika_cargos_v6',
};

const VALID_UZ_PREFIXES = [
  '90', '91', '93', '94', '95', '97', '98', '99',
  '88', '77', '71', '50', '33', '20',
];

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function validateStrictLogin(rawName, rawPhone) {
  const cleanedName = String(rawName).trim().replace(/\s+/g, ' ');
  const parts = cleanedName.split(' ').filter(Boolean);

  if (!cleanedName) {
    return { valid: false, field: 'name', message: 'Ism va familiyani kiriting!' };
  }
  if (parts.length < 2) {
    return {
      valid: false,
      field: 'name',
      message: 'Ism va familiyani kamida 2 ta so‘zdan iborat qilib kiriting!',
    };
  }

  const nameRegex = /^[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ'’ʻ-]+$/;
  for (const part of parts) {
    if (part.length < 3) {
      return {
        valid: false,
        field: 'name',
        message: 'Har bir so‘z kamida 3 ta harfdan iborat bo‘lsin!',
      };
    }
    if (!nameRegex.test(part)) {
      return {
        valid: false,
        field: 'name',
        message: 'Faqat harflardan foydalaning, raqam va belgi mumkin emas!',
      };
    }
    if (/^(.)\1+$/.test(part.toLowerCase())) {
      return {
        valid: false,
        field: 'name',
        message: 'Haqiqiy ism va familiya kiriting!',
      };
    }
  }

  const formattedPhone = formatPhone9Digits(rawPhone);
  const digits = formattedPhone.replace(/\D/g, '');

  if (digits.length !== 9) {
    return {
      valid: false,
      field: 'phone',
      message: 'Telefon raqami aniq 9 ta raqam bo‘lishi kerak!',
    };
  }
  if (!VALID_UZ_PREFIXES.includes(digits.slice(0, 2))) {
    return {
      valid: false,
      field: 'phone',
      message: `Noto‘g‘ri operator kodi (${digits.slice(0, 2)}). Masalan: 90, 91, 93, 94, 97, 99, 88, 77`,
    };
  }
  if (/^(\d)\1{8}$/.test(digits)) {
    return {
      valid: false,
      field: 'phone',
      message: 'Barcha raqamlar bir xil bo‘lishi mumkin emas!',
    };
  }

  return { valid: true, cleanName: cleanedName, cleanPhone: formattedPhone };
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [liveIndex, setLiveIndex] = useState(0);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);

  const [currentUser, setCurrentUser] = useState(() =>
    readStorage(STORAGE_KEYS.USER, null)
  );
  const [drivers, setDrivers] = useState(() =>
    readStorage(STORAGE_KEYS.DRIVERS, initialDriversData)
  );
  const [cargos, setCargos] = useState(() =>
    readStorage(STORAGE_KEYS.CARGOS, initialCargosData)
  );

  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState({ field: '', message: '' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CARGOS, JSON.stringify(cargos));
  }, [cargos]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  const handlePushChannelMessage = (
    preferredChannelId = null,
    customText = null,
    silent = false
  ) => {
    const targetChannel =
      telegramChannels.find((c) => c.id === preferredChannelId) ||
      telegramChannels[liveIndex % telegramChannels.length];

    if (customText && customText.trim()) {
      const manualCargo = {
        id: Date.now() + Math.random(),
        channelId: targetChannel.id,
        channelName: targetChannel.name,
        channelUrl: targetChannel.url,
        fromCountry: customText.trim(),
        fromRegion: 'Kanal xabari',
        fromCity: 'Telegram',
        toCountry: 'Xalqaro',
        toRegion: 'Yo‘nalish',
        toCity: 'Jonli xabar',
        cargoType: customText.trim(),
        weight: 'Kelishiladi',
        transportType: 'Fura',
        price: 'Kelishiladi',
        status: 'Yangi',
        timeAgo: 'Hozir (0s)',
        phone: currentUser ? `+998 ${currentUser.phone}` : '+998 90 123 45 67',
        rawText: customText.trim(),
      };
      setCargos((prev) => [manualCargo, ...prev.slice(0, 99)]);
      if (!silent) {
        toast.success(`${targetChannel.name}: xabar qo‘shildi`);
      }
      return;
    }

    const pool = preferredChannelId
      ? liveIncomingCargos.filter((item) => item.channelId === preferredChannelId)
      : liveIncomingCargos;
    const source = pool.length > 0 ? pool : liveIncomingCargos;
    const template = source[liveIndex % source.length];

    const nextCargo = {
      ...template,
      id: Date.now() + Math.random(),
      channelId: preferredChannelId || template.channelId,
      channelName: targetChannel ? targetChannel.name : template.channelName,
      channelUrl: targetChannel ? targetChannel.url : template.channelUrl,
      status: 'Yangi',
      timeAgo: 'Hozir (0s)',
    };

    setCargos((prev) => [nextCargo, ...prev.slice(0, 99)]);
    setLiveIndex((prev) => prev + 1);
    if (!silent) {
      toast.success(
        `${nextCargo.channelName}: ${nextCargo.fromCountry} → ${nextCargo.toCountry}`
      );
    }
  };

  useEffect(() => {
    if (!currentUser || !isLiveStreamActive) return;

    const timer = setInterval(() => {
      handlePushChannelMessage(null, null, true);
    }, 1000);

    return () => clearInterval(timer);
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const check = validateStrictLogin(loginName, loginPhone);
    if (!check.valid) {
      setLoginError({ field: check.field, message: check.message });
      toast.error(check.message);
      return;
    }

    setLoginError({ field: '', message: '' });
    const newDriver = {
      id: Date.now(),
      fullName: check.cleanName,
      phone: check.cleanPhone,
      country: "O'zbekiston",
      region: 'Toshkent',
      city: 'Toshkent shahri',
      truckType: 'Fura / Yuk mashinasi',
      truckNumber: '01 Y 001 AA',
      status: 'Bo‘sh',
      rating: 5.0,
      completedTrips: 0,
      notes: 'Tizimga kirish orqali haydovchilar ro‘yxatiga qo‘shildi.',
    };

    setDrivers((prev) => [newDriver, ...prev]);
    setCurrentUser({
      id: newDriver.id,
      fullName: check.cleanName,
      phone: check.cleanPhone,
    });
    setLoginName('');
    setLoginPhone('');
    toast.success(`${check.cleanName} haydovchilar ro‘yxatiga qo‘shildi`);
  };

  const handleConfirmLogout = () => {
    setCurrentUser(null);
    setIsLogoutModalOpen(false);
    setIsSidebarOpen(false);
    toast.info('Tizimdan chiqdingiz');
  };

  const handleConfirmDeleteDriver = () => {
    if (!deleteCandidate) return;
    setDrivers((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
    toast.info(`${deleteCandidate.fullName} ro‘yxatdan o‘chirildi`);
    setDeleteCandidate(null);
  };

  return (
    <>
      {!currentUser && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2 className="modal-card__title">Tizimga kirish</h2>
            <p className="modal-card__subtitle">
              Ism va familiyangizni (kamida 2 ta so‘z, faqat harflar) hamda 9
              xonali telefon raqamingizni kiriting.
            </p>

            <form className="modal-card__form" onSubmit={handleLoginSubmit}>
              <label className="modal-card__label">
                Ism va Familiya
                <input
                  type="text"
                  className={`modal-card__input ${
                    loginError.field === 'name' ? 'modal-card__input--error' : ''
                  }`}
                  placeholder="Masalan: Sardorbek Aliyev"
                  value={loginName}
                  onChange={(e) => {
                    setLoginName(e.target.value);
                    if (loginError.field === 'name') {
                      setLoginError({ field: '', message: '' });
                    }
                  }}
                />
                {loginError.field === 'name' && (
                  <span className="modal-card__error">{loginError.message}</span>
                )}
              </label>

              <label className="modal-card__label">
                Telefon raqami (9 ta raqam)
                <div
                  className={`modal-card__phone-wrap ${
                    loginError.field === 'phone'
                      ? 'modal-card__phone-wrap--error'
                      : ''
                  }`}
                >
                  <span className="modal-card__prefix">+998</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="modal-card__phone-input"
                    placeholder="90 123 45 67"
                    value={loginPhone}
                    onChange={(e) => {
                      setLoginPhone(formatPhone9Digits(e.target.value));
                      if (loginError.field === 'phone') {
                        setLoginError({ field: '', message: '' });
                      }
                    }}
                  />
                </div>
                {loginError.field === 'phone' && (
                  <span className="modal-card__error">{loginError.message}</span>
                )}
              </label>

              <button type="submit" className="btn-primary">
                Kirish va Haydovchilarga qo‘shilish
              </button>
            </form>
          </div>
        </div>
      )}

      {isLogoutModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-card__title">Tizimdan chiqish</h2>
            <p className="modal-card__subtitle">
              Haqiqatan ham tizimdan chiqmoqchimisiz?
            </p>
            <div className="modal-card__actions">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Yo‘q
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleConfirmLogout}
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteCandidate && (
        <div
          className="modal-backdrop"
          onClick={() => setDeleteCandidate(null)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-card__title">O‘chirishni tasdiqlash</h2>
            <p className="modal-card__subtitle">
              <strong>{deleteCandidate.fullName}</strong> ni ro‘yxatdan
              o‘chirasizmi?
            </p>
            <div className="modal-card__actions">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setDeleteCandidate(null)}
              >
                Yo‘q
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleConfirmDeleteDriver}
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="app-layout">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentUser={currentUser}
          onRequestLogout={() => setIsLogoutModalOpen(true)}
        />

        <div className="main-content">
          <Navbar
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            onOpenChannels={() => setIsChannelDrawerOpen(true)}
            unreadCount={cargos.filter((c) => c.status === 'Yangi').length}
            isChannelDrawerOpen={isChannelDrawerOpen}
            onCloseChannels={() => setIsChannelDrawerOpen(false)}
            channels={telegramChannels}
            cargos={cargos}
            onPushChannelMessage={handlePushChannelMessage}
            isLiveStreamActive={isLiveStreamActive}
            onToggleLiveStream={() => setIsLiveStreamActive((prev) => !prev)}
          />

          <main className="page-container">
            <Routes>
              {routes.map((route) => {
                const elementWithProps = React.cloneElement(route.element, {
                  cargos,
                  setCargos,
                  drivers,
                  setDrivers,
                  channels: telegramChannels,
                  onPushChannelMessage: handlePushChannelMessage,
                  onRequestDeleteDriver: (driver) => setDeleteCandidate(driver),
                  isLiveStreamActive,
                  onToggleLiveStream: () => setIsLiveStreamActive((prev) => !prev),
                });

                return (
                  <Route
                    key={route.id}
                    path={route.path}
                    element={elementWithProps}
                  />
                );
              })}
            </Routes>
          </main>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;