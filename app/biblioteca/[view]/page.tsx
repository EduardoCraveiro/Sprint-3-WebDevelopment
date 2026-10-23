import { notFound } from "next/navigation";

export default async function LibraryView({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  if (!["itens", "colecoes", "favoritos", "historico", "lixeira"].includes(view)) notFound();
  return null;
}
