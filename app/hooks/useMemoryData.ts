"use client";

import { useEffect, useState } from "react";
import type { ContentItem, HistoryEntry } from "../types";
import { isContentItems, isHistory } from "../lib/validation";

const ITEM_KEY = "humanly-jovi-items-v1";
const HISTORY_KEY = "humanly-jovi-history-v1";

// O catálogo inicial vem da API; o navegador preserva a organização da Sprint 3.
export function useMemoryData() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/memorias", { signal: controller.signal, cache: "no-store" });
        if (response.status === 401) {
          // Uma sessão expirada exige descartar o estado privado do cliente.
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.assign("/login"); return;
        }
        if (!response.ok) throw new Error("Não foi possível carregar a biblioteca. Tente novamente.");
        const data = await response.json();
        if (!isContentItems(data.items) || !isHistory(data.history)) throw new Error("A API retornou dados inválidos.");
        let savedItems = data.items;
        let savedHistory = data.history;
        try {
          const rawItems = localStorage.getItem(ITEM_KEY);
          const rawHistory = localStorage.getItem(HISTORY_KEY);
          if (rawItems) {
            const parsed = JSON.parse(rawItems);
            if (!isContentItems(parsed)) throw new Error("Itens inválidos");
            savedItems = parsed;
          }
          if (rawHistory) {
            const parsed = JSON.parse(rawHistory);
            if (!isHistory(parsed)) throw new Error("Histórico inválido");
            savedHistory = parsed;
          }
        } catch {
          setStorageWarning("Não foi possível recuperar todos os dados locais. A biblioteca usou os dados disponíveis da demonstração.");
        }
        setItems(savedItems);
        setHistory(savedHistory);
        setError("");
        setReady(true);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Falha na conexão com a API.");
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(ITEM_KEY, JSON.stringify(items));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // A escrita pode falhar por quota ou configuração de privacidade do navegador.
      const timer = window.setTimeout(() => setStorageWarning("O navegador não permitiu salvar. Exporte seus dados antes de sair."), 0);
      return () => window.clearTimeout(timer);
    }
  }, [items, history, ready]);

  return { items, setItems, history, setHistory, ready, error, storageWarning, retry: () => { setError(""); setAttempt((value) => value + 1); } };
}
