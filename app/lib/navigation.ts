export type ViewName = "dashboard" | "library" | "collections" | "favorites" | "history" | "trash";

export const VIEW_PATHS: Record<ViewName, string> = {
  dashboard: "/biblioteca", library: "/biblioteca/itens", collections: "/biblioteca/colecoes",
  favorites: "/biblioteca/favoritos", history: "/biblioteca/historico", trash: "/biblioteca/lixeira",
};
