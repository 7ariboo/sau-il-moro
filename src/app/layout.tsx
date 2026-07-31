import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { JsonLd, getOrganizationJsonLd, getWebSiteJsonLd } from "@/components/JsonLd";

const natronDisplay = localFont({
  src: "../../public/fonts/NATRONRough-Bold.otf",
  variable: "--font-display",
  display: "swap",
});

const natronSans = localFont({
  src: "../../public/fonts/NATRONRough-Medium.otf",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sauilmoro.com"),
  title: {
    default: "Sau Il Moro — Coltelli Artigianali Sardi & Lusso Rustico",
    template: "%s | Sau Il Moro",
  },
  description: "Scopri i coltelli artigianali sardi iconici di Sau Il Moro: Arburesa, Pattadese, Gallurese e il Set Esclusivo Bundle. Pezzi unici fatti a mano in Sardegna con spedizione espresso 24/48h.",
  keywords: [
    "coltelli artigianali sardi",
    "coltello arburesa",
    "coltello pattadese",
    "coltello gallurese",
    "sau il moro",
    "artigianato sardo di lusso",
    "coltelli sardi fatti a mano",
    "coltello da scuoio sardo",
  ],
  authors: [{ name: "Near di Diana Gabriele", url: "https://sauilmoro.com" }],
  creator: "Sau Il Moro",
  publisher: "Near di Diana Gabriele",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  verification: {
    google: "fedey5p3vXzX96siepAG_jZKEr5Y9fnEfrwKDGMza1k",
  },
  icons: [
    { rel: "icon", url: "/images/firma.png" },
    { rel: "shortcut icon", url: "/images/firma.png" },
    { rel: "apple-touch-icon", url: "/images/firma.png" },
  ],
  openGraph: {
    title: "Sau Il Moro — Coltelli Artigianali Sardi & Lusso Rustico",
    description: "Creazioni iconiche dell'artigianato sardo: Arburesa, Pattadese, Gallurese. Fatti a mano in Sardegna. Spedizione espresso in tutta Italia.",
    url: "https://sauilmoro.com",
    siteName: "Sau Il Moro",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/images/5/DSC09986.jpg",
        width: 1200,
        height: 630,
        alt: "Sau Il Moro — Collezione Coltelli Artigianali Sardi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sau Il Moro — Coltelli Artigianali Sardi & Lusso Rustico",
    description: "Creazioni iconiche dell'artigianato sardo fatte a mano in Sardegna.",
    images: ["/images/5/DSC09986.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <JsonLd data={getOrganizationJsonLd()} />
        <JsonLd data={getWebSiteJsonLd()} />
      </head>
      <body className={`${natronDisplay.variable} ${natronSans.variable} font-sans antialiased text-deep-black bg-stone-texture min-h-screen flex flex-col justify-between`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex-1">
                {children}
              </div>
              <Footer />
              <CookieBanner />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

