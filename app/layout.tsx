import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      {/* On ajoute 'flex flex-col min-h-screen' au body pour le layout */}
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        
        <Navbar />
        
        {/* MODIFICATION ICI : Ajout de 'pt-20' */}
        <main className="flex-grow pt-20">
          {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}