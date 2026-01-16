import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // <--- 1. Import du footer

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
      {/* On ajoute 'flex flex-col min-h-screen' au body.
         Cela permet au site de prendre toute la hauteur,
         et au Footer de rester tout en bas.
      */}
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        
        <Navbar />
        
        {/* 'flex-grow' permet au contenu de pousser le footer vers le bas */}
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer /> {/* <--- 2. Ajout du footer ici */}
        
      </body>
    </html>
  );
}