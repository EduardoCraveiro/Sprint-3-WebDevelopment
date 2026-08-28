"use client";

import { BarChart3, BookOpen, Camera, Clock3, Folder, Grid2X2, Heart, Settings, Trash2, X } from "lucide-react";

export type ViewName = "dashboard" | "library" | "collections" | "favorites" | "history" | "trash";

type SidebarProps = {
  activeView: ViewName;
  onViewChange: (view: ViewName) => void;
  mobileOpen: boolean;
  onClose: () => void;
  counts: { library: number; collections: number; favorites: number; trash: number };
};

const links: { id: ViewName; label: string; icon: typeof Grid2X2; count?: keyof SidebarProps["counts"] }[] = [
  { id: "dashboard", label: "Visao geral", icon: Grid2X2 },
  { id: "library", label: "Minha biblioteca", icon: BookOpen, count: "library" },
  { id: "collections", label: "Colecoes", icon: Folder, count: "collections" },
  { id: "favorites", label: "Favoritos", icon: Heart, count: "favorites" },
  { id: "history", label: "Historico", icon: Clock3 },
  { id: "trash", label: "Lixeira", icon: Trash2, count: "trash" },
];

export function Sidebar({ activeView, onViewChange, mobileOpen, onClose, counts }: SidebarProps) {
  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="brand-row">
        <button className="brand" onClick={() => onViewChange("dashboard")} aria-label="Ir para visao geral">
          <span className="brand-mark"><Camera size={20} /></span>
          <span>JOVI<small>memorias por Humanly</small></span>
        </button>
        <button className="icon-button sidebar-close" onClick={onClose} aria-label="Fechar menu"><X size={20} /></button>
      </div>
      <nav className="sidebar-nav" aria-label="Navegacao principal">
        <span className="nav-label">Espaco pessoal</span>
        {links.map(({ id, label, icon: Icon, count }) => (
          <button key={id} className={activeView === id ? "active" : ""} onClick={() => { onViewChange(id); onClose(); }}>
            <Icon size={18} />
            <span>{label}</span>
            {count && <em>{counts[count]}</em>}
          </button>
        ))}
      </nav>
      <div className="storage-panel">
        <div className="storage-title"><span>Armazenamento</span><strong>38%</strong></div>
        <div className="storage-track"><span /></div>
        <small>3,8 GB de 10 GB utilizados</small>
      </div>
      <button className="settings-button"><Settings size={18} />Configuracoes</button>
      <div className="sidebar-footer"><BarChart3 size={17} /><span>Dados salvos neste dispositivo</span></div>
    </aside>
  );
}
