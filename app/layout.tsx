import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: "NEXO | Central de conteudo",
    description: "Organize, compare e acompanhe seus conteudos em um so lugar.",
    icons: { icon: `${baseUrl}/og.png` },
    openGraph: {
      title: "NEXO | Central de conteudo",
      description: "Organize, compare e acompanhe seus conteudos em um so lugar.",
      images: [{ url: `${baseUrl}/og.png`, width: 1536, height: 909, alt: "NEXO - Central de conteudo" }],
    },
    twitter: { card: "summary_large_image", images: [`${baseUrl}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
