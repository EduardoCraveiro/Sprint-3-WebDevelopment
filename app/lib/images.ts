export function isImageUrl(value: string) {
  if (/^\/jovi\/mode-(aula|campus|treino|casa)\.webp$/.test(value)) return true;
  try { return ["https:", "http:"].includes(new URL(value).protocol); }
  catch { return false; }
}
