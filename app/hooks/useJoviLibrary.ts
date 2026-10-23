"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ContentItem, ContentType, Privacy } from "../types";
import { VIEW_PATHS, type ViewName } from "../lib/navigation";
import { isImageUrl } from "../lib/images";
import { useMemoryData } from "./useMemoryData";

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

export function useJoviLibrary() {
  const { items, setItems, history, setHistory, ready, error, storageWarning, retry } = useMemoryData();
  const pathname = usePathname();
  const router = useRouter();
  const activeView = (Object.keys(VIEW_PATHS) as ViewName[]).find((view) => VIEW_PATHS[view] === pathname) ?? "dashboard";
  const setActiveView = (view: ViewName) => { setQuery(""); setCategory("Todas"); router.push(VIEW_PATHS[view]); };
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("recentes");
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<"form" | "compare" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [recommendationId, setRecommendationId] = useState<number | null>(null);

  const activeItems = useMemo(() => items.filter((item) => !item.deleted), [items]);
  const deletedItems = useMemo(() => items.filter((item) => item.deleted), [items]);
  const categories = useMemo(() => [...new Set(activeItems.map((item) => item.category))], [activeItems]);
  const collections = useMemo(() => [...new Set(activeItems.map((item) => item.collection))], [activeItems]);

  const visibleItems = useMemo(() => {
    let result = activeView === "trash" ? deletedItems : activeItems;
    if (activeView === "favorites") result = result.filter((item) => item.favorite);
    if (category !== "Todas") result = result.filter((item) => item.category === category);
    const normalized = query.toLowerCase().trim();
    if (normalized) result = result.filter((item) => `${item.title} ${item.description} ${item.category} ${item.collection}`.toLowerCase().includes(normalized));
    return [...result].sort((a, b) => {
      if (sort === "manual") return 0;
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
    if (patch.deleted) setSelected((current) => current.filter((selectedId) => selectedId !== id));
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
    const cleanedForm = { ...form, title: form.title.trim(), description: form.description.trim(), category: form.category.trim(), collection: form.collection.trim(), image: form.image.trim() };
    if (!cleanedForm.title || !cleanedForm.description || !cleanedForm.category || !cleanedForm.collection || !isImageUrl(cleanedForm.image)) return;
    if (editingId) {
      const target = items.find((item) => item.id === editingId);
      setItems((current) => current.map((item) => item.id === editingId ? { ...item, ...cleanedForm, updatedAt: new Date().toISOString().slice(0, 10) } : item));
      if (target) logAction("Editado", target.title);
    } else {
      const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
      const now = new Date().toISOString().slice(0, 10);
      setItems((current) => [{ ...cleanedForm, id: nextId, favorite: false, deleted: false, createdAt: now, updatedAt: now }, ...current]);
      logAction("Adicionado", form.title);
    }
    setModal(null);
  };

  const toggleSelect = (id: number) => {
    setSelected((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : current.length < 2 ? [...current, id] : [current[1], id]);
  };

  const moveItem = (id: number, direction: -1 | 1) => {
    const position = visibleItems.findIndex((item) => item.id === id);
    const adjacent = visibleItems[position + direction];
    if (!adjacent) return;
    const ordered = [...visibleItems];
    [ordered[position], ordered[position + direction]] = [ordered[position + direction], ordered[position]];
    const visibleIds = new Set(ordered.map((item) => item.id));
    setSort("manual");
    setItems((current) => {
      let index = 0;
      return current.map((item) => visibleIds.has(item.id) ? ordered[index++] : item);
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
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const recentCount = activeItems.filter((item) => item.createdAt >= weekStart.toISOString().slice(0, 10) && item.createdAt <= today).length;

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

  return { activeView, setActiveView, query, setQuery, category, setCategory, sort, setSort, selected, setSelected, modal, setModal, editingId, form, setForm, mobileOpen, setMobileOpen, notificationsOpen, setNotificationsOpen, items, setItems, history, activeItems, categories, collections, visibleItems, logAction, patchItem, openAdd, openEdit, saveItem, toggleSelect, moveItem, exportData, randomizeRecommendation, recommendation, usagePercent, favoritePercent, recentCount, counts, viewTitle, ready, error, storageWarning, retry };
}
