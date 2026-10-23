"use client";

import { Bell, LogOut, Menu, Plus, Search } from "lucide-react";
import { useState } from "react";

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
  const [leaving, setLeaving] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  async function logout() {
    setLeaving(true);
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Não foi possível sair.");
      // Uma navegação completa descarta páginas autenticadas do cache do cliente.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    } catch {
      setLogoutError("Não foi possível sair. Verifique a conexão e tente novamente.");
      setLeaving(false);
    }
  }
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onToggleMenu} aria-label="Abrir menu" title="Abrir menu">
        <Menu size={20} />
      </button>
      <label className="search-box">
        <Search size={18} aria-hidden="true" />
        <input aria-label="Buscar memórias" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Buscar nas suas memorias..." />
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
        <div className="avatar" aria-label="Perfil de demonstração">PR</div>
        <button className="icon-button" onClick={logout} disabled={leaving} aria-label="Sair da conta" title="Sair da conta"><LogOut size={18} /></button>
        {logoutError && <p role="alert" className="absolute right-4 top-20 max-w-sm rounded-lg bg-rose-100 p-3 text-sm text-rose-900">{logoutError}</p>}
      </div>
    </header>
  );
}
