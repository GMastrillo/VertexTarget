import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VertexTarget — Engenharia Digital de Alto Impacto",
  description:
    "Marketing digital, automação com IA e experiências web imersivas. Transformamos marcas em forças gravitacionais do digital. Liderada por Gabriel Mastrillo (CEO & CTO) e Denis Braghin (CEO Vendas & Marketing).",
  keywords: [
    "marketing digital",
    "automação IA",
    "desenvolvimento web",
    "WebGL",
    "Three.js",
    "Next.js",
    "VertexTarget",
    "Gabriel Mastrillo",
    "Denis Braghin",
  ],
  authors: [{ name: "Gabriel Mastrillo" }, { name: "Denis Braghin" }],
  openGraph: {
    title: "VertexTarget — Engenharia Digital de Alto Impacto",
    description:
      "Marketing digital, automação com IA e experiências web imersivas.",
    type: "website",
    locale: "pt_BR",
    siteName: "VertexTarget",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
