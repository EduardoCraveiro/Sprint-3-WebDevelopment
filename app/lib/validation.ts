import type { ContentItem, HistoryEntry } from "../types";

export function isContentItems(value: unknown): value is ContentItem[] {
  return Array.isArray(value) && value.every((item) => item && typeof item === "object" &&
    Number.isSafeInteger(item.id) && [item.title, item.description, item.category, item.collection, item.createdAt, item.updatedAt, item.image].every((field) => typeof field === "string") &&
    ["Foto", "Video", "Documento"].includes(item.type) && ["Publico", "Privado"].includes(item.privacy) &&
    typeof item.favorite === "boolean" && typeof item.deleted === "boolean") && new Set(value.map((item) => item.id)).size === value.length;
}

export function isHistory(value: unknown): value is HistoryEntry[] {
  return Array.isArray(value) && value.every((entry) => entry && Number.isSafeInteger(entry.id) &&
    [entry.action, entry.item, entry.date].every((field) => typeof field === "string"));
}
