"use client";

/* eslint-disable @next/next/no-img-element -- URLs das capas sao cadastradas pelo usuario. */

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Download,
  Folder,
  Heart,
  Lightbulb,
  Plus,
  RefreshCw,
  RotateCcw,
  SearchX,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { INITIAL_HISTORY, INITIAL_ITEMS } from "../data";
import type { ContentItem, ContentType, HistoryEntry, Privacy } from "../types";
import { ContentCard } from "./ContentCard";
import { Header } from "./Header";
import { Sidebar, type ViewName } from "./Sidebar";

const ITEM_KEY = "humanly-jovi-items-v1";
const HISTORY_KEY = "humanly-jovi-history-v1";

const emptyForm = {
  title: "",
  description: "",
  category: "Campus",
  type: "Foto" as ContentType,
  collection: "Vida no campus",
  privacy: "Privado" as Privacy,
  image: "/jovi/mode-campus.webp",
};

type FormState = typeof emptyForm;

function formatToday() {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function StatCard({ label, value, note, icon: Icon, tone }: { label: string; value: number; note: string; icon: typeof Folder; tone: string }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
      <div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
    </article>
  );
}

export default function JoviLibrary() {
  const [items, setItems] = useState<ContentItem[]>(INITIAL_ITEMS);
  const [history, setHistory] = useState<HistoryEntry[]>(INITIAL_HISTORY);
  const [activeView, setActiveView] = useState<ViewName>("dashboard");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("recentes");
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<"form" | "compare" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [recommendationId, setRecommendationId] = useState(INITIAL_ITEMS[1].id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedItems = localStorage.getItem(ITEM_KEY);
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedItems) setItems(JSON.parse(storedItems));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(ITEM_KEY, JSON.stringify(items));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [items, history, ready]);

  const activeItems = useMemo(() => items.filter((item) => !item.deleted), [items]);
  const deletedItems = useMemo(() => items.filter((item) => item.deleted), [items]);
  const categories = useMemo(() => [...new Set(activeItems.map((item) => item.category))], [activeItems]);
  const collections = useMemo(() => [...new Set(activeItems.map((item) => item.collection))], [activeItems]);

  const visibleItems = useMemo(() => {
    let result = activeView === "trash" ? deletedItems : activeItems;
    if (activeView === "favorites") result = result.filter((item) => item.favorite);
    if (category !== "Todas") result = result.filter((item) => item.category === category);
    const normalized = query.toLowerCase().trim();
    if (normalized) result = result.filter((item) => `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(normalized));
    return [...result].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "antigos") return a.updatedAt.localeCompare(b.updatedAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [activeItems, activeView, category, deletedItems, query, sort]);

  const logAction = (action: string, item: string) => {
    setHistory((current) => [{ id: Date.now(), action, item, date: formatToday() }, ...current].slice(0, 30));
  };

  const patchItem = (id: number, patch: Partial<ContentItem>, action: string) => {
    const target = items.find((item) => item.id === id);
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString().slice(0, 10) } : item));
    if (target) logAction(action, target.title);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, category: item.category, type: item.type, collection: item.collection, privacy: item.privacy, image: item.image });
    setModal("form");
  };

  const saveItem = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) {
      const target = items.find((item) => item.id === editingId);
      setItems((current) => current.map((item) => item.id === editingId ? { ...item, ...form, updatedAt: new Date().toISOString().slice(0, 10) } : item));
      if (target) logAction("Editado", target.title);
    } else {
      const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
      const now = new Date().toISOString().slice(0, 10);
      setItems((current) => [{ ...form, id: nextId, favorite: false, deleted: false, createdAt: now, updatedAt: now }, ...current]);
      logAction("Adicionado", form.title);
    }
    setModal(null);
  };

  const toggleSelect = (id: number) => {
    setSelected((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : current.length < 2 ? [...current, id] : [current[1], id]);
  };

  const moveItem = (id: number, direction: -1 | 1) => {
    setItems((current) => {
      const from = current.findIndex((item) => item.id === id);
      const to = Math.max(0, Math.min(current.length - 1, from + direction));
      if (from === to) return current;
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    const target = items.find((item) => item.id === id);
    if (target) logAction("Reorganizado", target.title);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ items: activeItems, history }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jovi-memorias.json";
    link.click();
    URL.revokeObjectURL(url);
    logAction("Exportado", `${activeItems.length} itens`);
  };

  const randomizeRecommendation = () => {
    if (!activeItems.length) return;
    const randomIndex = Math.floor(Math.random() * activeItems.length);
    setRecommendationId(activeItems[randomIndex].id);
  };

  const recommendation = activeItems.find((item) => item.id === recommendationId) ?? activeItems[0];
  const usagePercent = Math.min(100, Math.round((activeItems.length / 20) * 100));
  const favoritePercent = activeItems.length ? Math.round((activeItems.filter((item) => item.favorite).length / activeItems.length) * 100) : 0;

  const counts = {
    library: activeItems.length,
    collections: collections.length,
    favorites: activeItems.filter((item) => item.favorite).length,
    trash: deletedItems.length,
  };

  const viewTitle: Record<ViewName, string> = {
    dashboard: "Visao geral",
    library: "Minha biblioteca",
    collections: "Colecoes",
    favorites: "Favoritos",
    history: "Historico",
    trash: "Lixeira",
  };

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onViewChange={setActiveView} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} counts={counts} />
      {mobileOpen && <button className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />}
      <div className="app-main">
        <Header
          query={query}
          onQueryChange={setQuery}
          onAdd={openAdd}
          onToggleMenu={() => setMobileOpen(true)}
          onToggleNotifications={() => setNotificationsOpen((value) => !value)}
          notificationCount={2}
          notificationsOpen={notificationsOpen}
        />
        <main className="workspace">
          <div className="page-heading">
            <div><span className="eyebrow">Humanly × JOVI</span><h1>{viewTitle[activeView]}</h1><p>Organize os momentos capturados ao longo da sua rotina.</p></div>
            <button className="secondary-button" onClick={exportData}><Download size={17} />Exportar dados</button>
          </div>

          {activeView === "dashboard" && (
            <>
              <section className="stats-grid" aria-label="Resumo da biblioteca">
                <StatCard label="Itens salvos" value={activeItems.length} note={`${usagePercent}% da meta mensal`} icon={Folder} tone="coral" />
                <StatCard label="Colecoes" value={collections.length} note="Organizadas por contexto" icon={BarChart3} tone="blue" />
                <StatCard label="Favoritos" value={counts.favorites} note={`${favoritePercent}% da biblioteca`} icon={Heart} tone="yellow" />
                <StatCard label="Esta semana" value={Math.min(activeItems.length, 4)} note="2 a mais que semana passada" icon={Sparkles} tone="green" />
              </section>

              {recommendation && (
                <section className="recommendation-band">
                  <div className="recommendation-copy"><span><Lightbulb size={17} />Sugestao para voce</span><h2>{recommendation.title}</h2><p>{recommendation.description}</p></div>
                  <img src={recommendation.image} alt="" />
                  <button className="icon-button" onClick={randomizeRecommendation} aria-label="Gerar outra sugestao" title="Outra sugestao"><RefreshCw size={18} /></button>
                </section>
              )}
            </>
          )}

          {activeView === "collections" ? (
            <section className="collections-grid">
              {collections.map((collection, index) => {
                const collectionItems = activeItems.filter((item) => item.collection === collection);
                return (
                  <button className="collection-tile" key={collection} onClick={() => { setActiveView("library"); setQuery(collection); }}>
                    <span className={`collection-icon collection-${index % 4}`}><Folder size={22} /></span>
                    <strong>{collection}</strong><small>{collectionItems.length} {collectionItems.length === 1 ? "item" : "itens"}</small>
                    <div className="collection-faces">{collectionItems.slice(0, 3).map((item) => <img key={item.id} src={item.image} alt="" />)}</div>
                  </button>
                );
              })}
              <button className="collection-tile add-collection" onClick={openAdd}><Plus size={22} /><strong>Nova colecao</strong><small>Adicione o primeiro item</small></button>
            </section>
          ) : activeView === "history" ? (
            <section className="history-panel">
              {history.length ? history.map((entry) => (
                <div className="history-row" key={entry.id}><span className="history-mark" /><div><strong>{entry.action}</strong><p>{entry.item}</p></div><time>{entry.date}</time></div>
              )) : <EmptyState label="Nenhuma atividade registrada" />}
            </section>
          ) : activeView === "trash" ? (
            <section className="trash-panel">
              {visibleItems.length ? visibleItems.map((item) => (
                <div className="trash-row" key={item.id}><img src={item.image} alt="" /><div><strong>{item.title}</strong><small>Excluido recentemente</small></div><button className="secondary-button" onClick={() => patchItem(item.id, { deleted: false }, "Restaurado")}><RotateCcw size={16} />Restaurar</button><button className="icon-button danger" onClick={() => { setItems((current) => current.filter((currentItem) => currentItem.id !== item.id)); logAction("Removido definitivamente", item.title); }} aria-label="Excluir definitivamente"><Trash2 size={17} /></button></div>
              )) : <EmptyState label="A lixeira esta vazia" />}
            </section>
          ) : (
            <section className="content-section">
              <div className="section-toolbar">
                <div><h2>{activeView === "dashboard" ? "Adicionados recentemente" : viewTitle[activeView]}</h2><span>{visibleItems.length} itens encontrados</span></div>
                <div className="filter-row">
                  <select aria-label="Filtrar por categoria" value={category} onChange={(event) => setCategory(event.target.value)}><option>Todas</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
                  <select aria-label="Ordenar memorias" value={sort} onChange={(event) => setSort(event.target.value)}><option value="recentes">Mais recentes</option><option value="antigos">Mais antigos</option><option value="az">A - Z</option></select>
                </div>
              </div>
              {visibleItems.length ? (
                <div className="content-grid">
                  {(activeView === "dashboard" ? visibleItems.slice(0, 4) : visibleItems).map((item) => (
                    <ContentCard key={item.id} item={item} selected={selected.includes(item.id)} onSelect={() => toggleSelect(item.id)} onFavorite={() => patchItem(item.id, { favorite: !item.favorite }, item.favorite ? "Removido dos favoritos" : "Favoritado")} onPrivacy={() => patchItem(item.id, { privacy: item.privacy === "Publico" ? "Privado" : "Publico" }, "Privacidade alterada")} onEdit={() => openEdit(item)} onDelete={() => patchItem(item.id, { deleted: true }, "Movido para lixeira")} />
                  ))}
                </div>
              ) : <EmptyState label="Nenhum item combina com sua busca" />}
              {activeView === "library" && visibleItems.length > 1 && (
                <div className="reorder-panel"><strong>Ordem manual</strong><span>Use as setas para reorganizar rapidamente.</span>{visibleItems.slice(0, 5).map((item) => <div key={item.id}><span>{item.title}</span><button className="icon-button" onClick={() => moveItem(item.id, -1)} aria-label="Mover para cima"><ArrowUp size={15} /></button><button className="icon-button" onClick={() => moveItem(item.id, 1)} aria-label="Mover para baixo"><ArrowDown size={15} /></button></div>)}</div>
              )}
            </section>
          )}
        </main>
        <footer className="app-footer"><strong>HUMANLY × JOVI</strong><span>Biblioteca de momentos</span><small>© 2026 Humanly | Projeto academico FIAP</small></footer>
      </div>

      {selected.length > 0 && (
        <div className="compare-bar"><span><strong>{selected.length}</strong> de 2 itens selecionados</span><button className="secondary-button" disabled={selected.length !== 2} onClick={() => setModal("compare")}>Comparar lado a lado</button><button className="icon-button" onClick={() => setSelected([])} aria-label="Limpar selecao"><X size={18} /></button></div>
      )}

      {modal === "form" && (
        <dialog open className="modal-backdrop" aria-label="Adicionar ou editar item">
          <button className="modal-dismiss" onClick={() => setModal(null)} aria-label="Fechar janela" />
          <div className="modal" role="document" aria-labelledby="form-title">
            <div className="modal-header"><div><span className="eyebrow">Biblioteca</span><h2 id="form-title">{editingId ? "Editar item" : "Adicionar novo item"}</h2></div><button className="icon-button" onClick={() => setModal(null)} aria-label="Fechar"><X size={19} /></button></div>
            <form onSubmit={saveItem}>
              <label className="full-field"><span>Titulo</span><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: Tendencias de design para 2027" /></label>
              <label className="full-field"><span>Descricao</span><textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} placeholder="Uma descricao curta da memoria" /></label>
              <div className="form-grid">
                <label><span>Categoria</span><input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
                <label><span>Tipo</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as ContentType })}><option>Foto</option><option>Video</option><option>Documento</option></select></label>
                <label><span>Colecao</span><input required value={form.collection} onChange={(event) => setForm({ ...form, collection: event.target.value })} /></label>
                <label><span>Privacidade</span><select value={form.privacy} onChange={(event) => setForm({ ...form, privacy: event.target.value as Privacy })}><option>Privado</option><option>Publico</option></select></label>
              </div>
              <label className="full-field"><span>URL da imagem</span><input type="url" required value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} /></label>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Cancelar</button><button className="primary-button" type="submit">{editingId ? "Salvar alteracoes" : "Adicionar item"}</button></div>
            </form>
          </div>
        </dialog>
      )}

      {modal === "compare" && (
        <dialog open className="modal-backdrop" aria-label="Comparacao de itens">
          <button className="modal-dismiss" onClick={() => setModal(null)} aria-label="Fechar janela" />
          <div className="modal compare-modal" role="document" aria-labelledby="compare-title">
            <div className="modal-header"><div><span className="eyebrow">Analise</span><h2 id="compare-title">Comparacao lado a lado</h2></div><button className="icon-button" onClick={() => setModal(null)} aria-label="Fechar"><X size={19} /></button></div>
            <div className="compare-grid">{selected.map((id) => items.find((item) => item.id === id)).filter(Boolean).map((item) => item && <div key={item.id}><img src={item.image} alt="" /><span className="type-badge">{item.type}</span><h3>{item.title}</h3><p>{item.description}</p><dl><dt>Categoria</dt><dd>{item.category}</dd><dt>Colecao</dt><dd>{item.collection}</dd><dt>Visibilidade</dt><dd>{item.privacy}</dd></dl></div>)}</div>
          </div>
        </dialog>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="empty-state"><SearchX size={28} /><strong>{label}</strong><span>Tente ajustar os filtros ou adicionar uma nova memoria.</span></div>;
}
