"use client";

import { Bell, Menu, Plus, Search } from "lucide-react";

type HeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onAdd: () => void;
  onToggleMenu: () => void;
  onToggleNotifications: () => void;
  notificationCount: number;
  notificationsOpen: boolean;
};

export function Header({
  query,
  onQueryChange,
  onAdd,
  onToggleMenu,
  onToggleNotifications,
  notificationCount,
  notificationsOpen,
}: HeaderProps) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onToggleMenu} aria-label="Abrir menu" title="Abrir menu">
        <Menu size={20} />
      </button>
      <label className="search-box">
        <Search size={18} aria-hidden="true" />
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Buscar nas suas memorias..." />
        <span className="shortcut">/</span>
      </label>
      <div className="topbar-actions">
        <div className="notifications-wrap">
          <button className="icon-button" onClick={onToggleNotifications} aria-label="Notificacoes" title="Notificacoes">
            <Bell size={19} />
            {notificationCount > 0 && <span className="notification-dot">{notificationCount}</span>}
          </button>
          {notificationsOpen && (
            <div className="notifications-panel">
              <strong>Notificacoes</strong>
              <p><span className="notice-mark coral" />Sua memoria mais recente esta pronta para organizar.</p>
              <p><span className="notice-mark green" />Seu resumo de momentos esta pronto.</p>
            </div>
          )}
        </div>
        <button className="primary-button" onClick={onAdd}><Plus size={18} />Adicionar memoria</button>
        <div className="avatar" aria-label="Perfil de Eduardo">ED</div>
      </div>
    </header>
  );
}
