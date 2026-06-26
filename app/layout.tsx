import type { Metadata } from "next";
import "./globals.css";
import CartSummary from "../components/CartSummary"; // Traemos la barra flotante

export const metadata: Metadata = {
  title: "Mega Fruver",
  description: "Frescura directa del campo a tu casa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* pb-24 da un espacio extra abajo para que el carrito no tape nada */}
      <body className="bg-[#f8fafc] text-[#1e293b] pb-24"> 
        {children}
        
        {/* La barra se quedará pegada abajo siempre */}
        <CartSummary />
      </body>
    </html>
  );
}