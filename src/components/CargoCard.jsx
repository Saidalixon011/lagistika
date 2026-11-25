import React from 'react';
import { MapPin, Phone, Radio, Truck } from 'lucide-react';
import './CargoCard.css';

export default function CargoCard({ cargo }) {
  return (
    <article className="cargo-card">
      <div className="cargo-card__top">
        <span className="cargo-card__channel">
          <Radio size={13} />
          <span>{cargo.channelName}</span>
        </span>
        <span className="cargo-card__time">{cargo.timeAgo}</span>
      </div>

      <div className="cargo-card__route">
        <span>
          {cargo.fromCountry} ({cargo.fromRegion})
        </span>
        <span className="cargo-card__arrow">→</span>
        <span>
          {cargo.toCountry} ({cargo.toRegion})
        </span>
      </div>

      <div className="cargo-card__details">
        <div className="cargo-card__detail">
          <Truck size={15} />
          <span>
            {cargo.cargoType} • {cargo.weight} • {cargo.transportType}
          </span>
        </div>
        <div className="cargo-card__detail">
          <MapPin size={15} />
          <span>
            {cargo.fromCity} → {cargo.toCity}
          </span>
        </div>
      </div>

      <div className="cargo-card__bottom">
        <span className="cargo-card__price">{cargo.price}</span>
        <a
          href={`tel:${String(cargo.phone || '').replace(/\s+/g, '')}`}
          className="cargo-card__phone"
        >
          <Phone size={14} />
          <span>{cargo.phone}</span>
        </a>
      </div>
    </article>
  );
}