import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://conferencia-casais2026.vercel.app"),
  title: "Conferência de Casais 2026 · Igreja Hope",
  description: "Casados e Aliançados: Um casamento com propósito. Participe da nossa conferência no dia 08 de Agosto de 2026 em Palmas/TO. Inscreva-se gratuitamente.",
  keywords: ["Casais", "Conferência", "Igreja Hope", "Casamento", "Palmas"],
  authors: [{ name: "Igreja Hope" }],
  icons: {
    icon: "/logoigreja.png",
    shortcut: "/logoigreja.png",
    apple: "/logoigreja.png",
  },
  openGraph: {
    title: "Conferência de Casais 2026 · Casados & Aliançados",
    description: "Um casamento com propósito. Junte-se a nós dia 08 de Agosto de 2026 com Pr. Alan e Pra. Graciele Daniel. Inscreva-se grátis!",
    url: "https://conferencia-casais2026.vercel.app",
    siteName: "Conferência de Casais 2026",
    images: [
      {
        url: "/fotomaisfundopreto.jpg",
        width: 1200,
        height: 630,
        alt: "Conferência de Casais 2026 - Casados e Aliançados",
      },
      {
        url: "/casalfotoperfil.webp",
        width: 800,
        height: 800,
        alt: "Pr. Alan & Pra. Graciele Daniel - Casal Cheio da Graça",
      }
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conferência de Casais 2026 · Casados & Aliançados",
    description: "Um casamento com propósito. Junte-se a nós dia 08 de Agosto de 2026. Inscreva-se grátis!",
    images: ["/fotomaisfundopreto.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
