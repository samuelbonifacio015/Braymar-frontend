import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LayoutShell } from "@/components/layout/LayoutShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Braymar - Inventory Management",
  description: "Sistema de gestión de inventario Braymar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={geistSans.variable}>
      <body className="min-h-screen bg-gray-50 flex font-sans antialiased text-gray-900">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
