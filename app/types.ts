export type ContentType = "Artigo" | "Video" | "Podcast" | "Documento";
export type Privacy = "Publico" | "Privado";

export type ContentItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  type: ContentType;
  collection: string;
  privacy: Privacy;
  favorite: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
};

export type HistoryEntry = {
  id: number;
  action: string;
  item: string;
  date: string;
};

