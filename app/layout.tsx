import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. On importe notre Navbar
import Navbar from "@/components/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ANEM Marrakech",
  description: "Site officiel des étudiants nigériens à Marrakech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* 2. On l'affiche ici, au dessus de tout */}
        <Navbar />
        
        {/* Ici, c'est le contenu changeant (page.tsx) */}
        {children}
        
      </body>
    </html>
  );
}