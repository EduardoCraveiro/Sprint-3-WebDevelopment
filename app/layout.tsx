import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: "JOVI Memorias | Humanly",
    description: "Organize os momentos registrados pela experiencia JOVI.",
    icons: { icon: `${baseUrl}/jovi/mode-campus.webp` },
    openGraph: {
      title: "JOVI Memorias | Humanly",
      description: "Organize os momentos registrados pela experiencia JOVI.",
      images: [{ url: `${baseUrl}/jovi/mode-campus.webp`, alt: "JOVI Memorias" }],
    },
    twitter: { card: "summary_large_image", images: [`${baseUrl}/jovi/mode-campus.webp`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
