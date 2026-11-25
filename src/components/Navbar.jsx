import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  ExternalLink,
  Menu,
  Radio,
  Send,
  Truck,
  X,
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({
  onToggleSidebar,
  onOpenChannels,
  unreadCount = 0,
  isChannelDrawerOpen,
  onCloseChannels,
  channels = [],
  cargos = [],
  onPushChannelMessage,
  isLiveStreamActive = true,
  onToggleLiveStream,
}) {
  const [openedId, setOpenedId] = useState(null);
  const [draft, setDraft] = useState('');

  const openedChannel = channels.find((c) => c.id === openedId) || null;
  const channelMessages = openedChannel
    ? cargos.filter((c) => c.channelId === openedChannel.id)
    : [];

  const handleClose = () => {
    setOpenedId(null);
    onCloseChannels();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!openedChannel || !draft.trim()) return;
    onPushChannelMessage(openedChannel.id, draft, false);
    setDraft('');
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <button
            type="button"
            className="menu-btn"
            onClick={onToggleSidebar}
            aria-label="Menyu"
          >
            <Menu size={22} />
          </button>
          <div className="brand-badge">
            <Truck size={22} className="brand-icon" />
            <span className="brand-title">LAGIMAX</span>
          </div>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="notif-btn"
            onClick={onOpenChannels}
            aria-label="Telegram kanallar"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>
        </div>
      </header>

      {isChannelDrawerOpen && (
        <div className="channel-drawer-backdrop" onClick={handleClose}>
          <aside
            className="channel-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="channel-drawer__header">
                <div className="channel-drawer__title-group">
                  {openedChannel && (
                    <button
                      type="button"
                      className="channel-drawer__back"
                      onClick={() => setOpenedId(null)}
                      aria-label="Orqaga"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <h2 className="channel-drawer__title">
                    {openedChannel
                      ? openedChannel.name
                      : `Telegram Kanallar (${channels.length})`}
                  </h2>
                </div>

                <button
                  type="button"
                  className="channel-drawer__close"
                  onClick={handleClose}
                  aria-label="Yopish"
                >
                  <X size={18} />
                </button>
              </div>

              {!openedChannel ? (
                <div className="tg-chat-list">
                  {channels.map((ch) => {
                    const list = cargos.filter((c) => c.channelId === ch.id);
                    const latest = list[0];
                    const preview = latest
                      ? `${latest.fromCountry} (${latest.fromRegion}) → ${latest.toCountry} (${latest.toRegion}) • ${latest.cargoType}`
                      : ch.lastMessage;
                    const badgeCount =
                      list.length > 0 ? list.length : ch.unreadCount;

                    return (
                      <div
                        key={ch.id}
                        className="tg-chat-row"
                        onClick={() => setOpenedId(ch.id)}
                      >
                        <div className="tg-avatar">{ch.avatarText}</div>
                        <div className="tg-chat-body">
                          <div className="tg-chat-top">
                            <span className="tg-chat-name">{ch.name}</span>
                            <span className="tg-chat-time">
                              {latest ? latest.timeAgo : ch.time}
                            </span>
                          </div>
                          <div className="tg-chat-bottom">
                            <span className="tg-chat-preview">{preview}</span>
                            <span className="tg-unread-badge">
                              {badgeCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="tg-room" style={{ flex: 1 }}>
                  <div className="tg-room__banner">
                    <a
                      href={openedChannel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="tg-channel-link"
                    >
                      <span>{openedChannel.url}</span>
                      <ExternalLink size={13} />
                    </a>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                      onClick={() =>
                        onPushChannelMessage(openedChannel.id, null, false)
                      }
                    >
                      <Radio size={14} />
                      <span>Xabar tushirish</span>
                    </button>
                  </div>

                  {channelMessages.length === 0 ? (
                    <div className="tg-msg-bubble">
                      <span className="tg-msg-text">
                        {openedChannel.lastMessage}
                      </span>
                    </div>
                  ) : (
                    channelMessages.map((msg) => (
                      <div key={msg.id} className="tg-msg-bubble">
                        <div className="tg-msg-route">
                          {msg.fromCountry} ({msg.fromRegion}) → {msg.toCountry} (
                          {msg.toRegion})
                        </div>
                        <div className="tg-msg-text">
                          {msg.rawText || `${msg.cargoType} • ${msg.weight}`}
                        </div>
                        <div className="tg-msg-meta">
                          <span>
                            {msg.price} • {msg.phone}
                          </span>
                          <span>{msg.timeAgo}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="channel-drawer__actions">
              {openedChannel ? (
                <form className="tg-compose-form" onSubmit={handleSend}>
                  <input
                    type="text"
                    className="tg-compose-input"
                    placeholder="Kanalga xabar yozish..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <button type="submit" className="btn-primary">
                    <Send size={16} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    onToggleLiveStream && onToggleLiveStream()
                  }
                >
                  <Radio size={17} />
                  <span>
                    {isLiveStreamActive
                      ? '1s Jonli oqim faol (To‘xtatish)'
                      : '1s Jonli oqimni yoqish'}
                  </span>
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}