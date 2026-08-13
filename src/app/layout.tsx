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

/**
 * A imagem de compartilhamento vira URL absoluta a partir daqui — se este
 * endereço estiver errado, o WhatsApp busca a imagem no domínio errado e o
 * preview aparece sem foto.
 *
 * Na Vercel o domínio de produção é resolvido sozinho. Se você usar domínio
 * próprio, defina NEXT_PUBLIC_SITE_URL (ex.: https://rifadajoselete.com.br).
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rifa.igrejahope.com.br";

const TITULO = "Rifa Solidária · Uma corrente de fé por Joselete";
const DESCRICAO =
  "50 cotas de R$ 1.000,00 concorrendo a uma canoa completa. Toda a arrecadação é destinada ao tratamento de câncer da Joselete.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO,
  description: DESCRICAO,
  keywords: ["Rifa", "Solidária", "Joselete", "Tratamento", "Câncer", "Canoa"],
  // As imagens do preview vêm dos arquivos opengraph-image.jpg e
  // twitter-image.jpg nesta mesma pasta — o Next gera as tags sozinho.
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    url: SITE_URL,
    siteName: "Rifa Solidária por Joselete",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
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
      <body className="min-h-full flex flex-col bg-[#1a1a1a] text-white">
        {children}
      </body>
    </html>
  );
}
