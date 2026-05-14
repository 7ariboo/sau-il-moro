import type { Metadata } from "next";
import { Stardos_Stencil, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";

const stardos = Stardos_Stencil({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-display",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sau Il Moro | Artigianato Sardo di Lusso",
  description: "E-commerce di lusso rustico che celebra l'artigianato sardo: ferro, legno, terra e carne.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${stardos.variable} ${montserrat.variable} font-sans antialiased text-deep-black bg-stone-texture`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
