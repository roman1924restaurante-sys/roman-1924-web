import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.roman1924.com"),
  title: "Román 1924 | Restaurante de alta cocina en Valladolid",
  description:
    "Román 1924 es un restaurante de alta cocina en Valladolid donde reinterpretamos la cocina tradicional castellana con una visión contemporánea y premium. Reserva tu mesa.",
  alternates: {
    canonical: "https://www.roman1924.com/",
  },
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Román 1924 | Restaurante de alta cocina en Valladolid",
    description:
      "Cocina tradicional castellana reinterpretada con una mirada contemporánea, elegante y centrada en el producto, en pleno corazón de Valladolid.",
    url: "https://www.roman1924.com/",
    siteName: "Román 1924",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/hero-roman.webp",
        width: 1200,
        height: 630,
        alt: "Román 1924, restaurante de alta cocina en Valladolid",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Román 1924 | Restaurante de alta cocina en Valladolid",
    description:
      "Cocina tradicional castellana reinterpretada con una mirada contemporánea, elegante y centrada en el producto.",
    images: ["/hero-roman.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-24TQXZXYFB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-24TQXZXYFB');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}