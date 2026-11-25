import React, { useMemo, useState } from 'react';
import { Radio, RotateCcw, Search } from 'lucide-react';
import { smartSearchCargo } from '../utils/smartSearch';
import CargoCard from '../components/CargoCard';
import './Dashboard.css';

export default function Dashboard({
  cargos = [],
  channels = [],
  onPushChannelMessage,
  isLiveStreamActive = true,
  onToggleLiveStream,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const countries = useMemo(() => {
    const set = new Set();
    cargos.forEach((c) => {
      if (c.fromCountry) set.add(c.fromCountry);
      if (c.toCountry) set.add(c.toCountry);
    });
    return Array.from(set);
  }, [cargos]);

  const regions = useMemo(() => {
    const set = new Set();
    cargos.forEach((c) => {
      if (c.fromRegion) set.add(c.fromRegion);
      if (c.toRegion) set.add(c.toRegion);
    });
    return Array.from(set);
  }, [cargos]);

  const filteredCargos = useMemo(() => {
    return cargos.filter((cargo) => {
      const okSearch = smartSearchCargo(cargo, searchQuery);
      const okChannel =
        selectedChannel === 'all' || cargo.channelId === selectedChannel;
      const okCountry =
        selectedCountry === 'all' ||
        cargo.fromCountry === selectedCountry ||
        cargo.toCountry === selectedCountry;
      const okRegion =
        selectedRegion === 'all' ||
        cargo.fromRegion === selectedRegion ||
        cargo.toRegion === selectedRegion;
      const okStatus =
        selectedStatus === 'all' || cargo.status === selectedStatus;

      return okSearch && okChannel && okCountry && okRegion && okStatus;
    });
  }, [
    cargos,
    searchQuery,
    selectedChannel,
    selectedCountry,
    selectedRegion,
    selectedStatus,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedChannel('all');
    setSelectedCountry('all');
    setSelectedRegion('all');
    setSelectedStatus('all');
  };

  return (
    <section className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Yuklar oqimi (1s Jonli Telegram Kanallar)</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => onToggleLiveStream && onToggleLiveStream()}
          >
            <Radio size={17} />
            <span>{isLiveStreamActive ? 'Oqimni to‘xtatish' : 'Oqimni yoqish'}</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              onPushChannelMessage && onPushChannelMessage(null, null, false)
            }
          >
            <Radio size={18} />
            <span>Hozir xabar tushirish</span>
          </button>
        </div>
      </div>

      <div className="dashboard__controls">
        <div className="dashboard__search-row">
          <div className="dashboard__search-box">
            <Search size={18} className="dashboard__search-icon" />
            <input
              type="text"
              className="dashboard__search-input"
              placeholder="Rossiya, Turkiya, Eron, Xitoy, har qanday davlat yoki kombinatsiya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn-outline"
            onClick={handleResetFilters}
          >
            <RotateCcw size={16} />
            <span>Tozalash</span>
          </button>
        </div>

        <div className="dashboard__filters-row">
          <select
            className="dashboard__select"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
          >
            <option value="all">Barcha Telegram kanallar ({channels.length})</option>
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </select>

          <select
            className="dashboard__select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="all">Barcha davlatlar</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            className="dashboard__select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">Barcha viloyat / hududlar</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            className="dashboard__select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Barcha holatlar</option>
            <option value="Yangi">Yangi</option>
            <option value="Faol">Faol</option>
          </select>
        </div>

        <div className="dashboard__hint">
          <span>
            Holat: <strong>{isLiveStreamActive ? '1s Jonli (Faol)' : 'To‘xtatilgan'}</strong>
          </span>
          <span>
            Topilgan yuklar: <strong>{filteredCargos.length} ta</strong>
          </span>
        </div>
      </div>

      {filteredCargos.length === 0 ? (
        <div className="dashboard__empty">
          <p>Tanlangan qidiruv yoki filtr bo‘yicha yuk topilmadi.</p>
        </div>
      ) : (
        <div className="dashboard__grid">
          {filteredCargos.map((cargo) => (
            <CargoCard key={cargo.id} cargo={cargo} />
          ))}
        </div>
      )}
    </section>
  );
}