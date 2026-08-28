"use client";

/* eslint-disable @next/next/no-img-element -- URLs das capas sao cadastradas pelo usuario. */

import { Check, Eye, EyeOff, Heart, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { ContentItem } from "../types";

type ContentCardProps = {
  item: ContentItem;
  selected: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  onPrivacy: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ContentCard({ item, selected, onSelect, onFavorite, onPrivacy, onEdit, onDelete }: ContentCardProps) {
  return (
    <article className={`content-card ${selected ? "selected" : ""}`}>
      <div className="cover-wrap">
        <img src={item.image} alt="" />
        <span className={`type-badge type-${item.type.toLowerCase()}`}>{item.type}</span>
        <button className={`select-button ${selected ? "active" : ""}`} onClick={onSelect} aria-label={`Selecionar ${item.title} para comparar`} title="Comparar">
          {selected ? <Check size={15} /> : <span />}
        </button>
      </div>
      <div className="card-body">
        <div className="card-topline"><span>{item.category}</span><span>{item.updatedAt.split("-").reverse().join("/")}</span></div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="card-footer">
          <button className={`icon-button ${item.favorite ? "favorite" : ""}`} onClick={onFavorite} aria-label="Alternar favorito" title="Favorito"><Heart size={17} fill={item.favorite ? "currentColor" : "none"} /></button>
          <button className="icon-button" onClick={onPrivacy} aria-label="Alternar privacidade" title={item.privacy}>{item.privacy === "Publico" ? <Eye size={17} /> : <EyeOff size={17} />}</button>
          <span className="privacy-label">{item.privacy}</span>
          <div className="card-actions">
            <button className="icon-button" onClick={onEdit} aria-label="Editar item" title="Editar"><Pencil size={16} /></button>
            <button className="icon-button danger" onClick={onDelete} aria-label="Mover para lixeira" title="Mover para lixeira"><Trash2 size={16} /></button>
            <button className="icon-button muted" aria-label="Mais opcoes" title="Mais opcoes"><MoreHorizontal size={17} /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
