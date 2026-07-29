import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";

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
  title: "Sau Il Moro | Artigianato Sardo di Lusso",
  description: "E-commerce di lusso rustico che celebra l'artigianato sardo: ferro, legno, terra e carne.",
  icons: {
    icon: '/images/firma.png',
    shortcut: '/images/firma.png',
    apple: '/images/firma.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
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

