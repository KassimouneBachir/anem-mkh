'use client'; // Indispensable pour gérer l'état (connecté ou pas)

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // Pour le menu mobile (bonus)

  useEffect(() => {
    // 1. Vérifier l'état au chargement de la page
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // 2. Écouter les changements (Connexion / Déconnexion) en temps réel
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold text-green-700">
          ANEM<span className="text-orange-500">.MKH</span>
        </Link>

        {/* MENU */}
        <ul className="flex space-x-6 font-medium text-gray-600 items-center">
          <li className="hidden md:block">
            <Link href="/" className="hover:text-green-600 transition">Accueil</Link>
          </li>
          <li className="hidden md:block">
            <Link href="/guide" className="hover:text-green-600 transition">Guide</Link>
          </li>
          <li className="hidden md:block">
            <Link href="/events" className="hover:text-green-600 transition">Événements</Link>
          </li>
          
          {/* BOUTON DYNAMIQUE */}
          <li>
            {user ? (
              // CAS CONNECTÉ : On affiche "Mon Compte"
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-green-800 rounded-full hover:bg-green-100 transition border border-green-200">
                <span className="text-sm">👤</span>
                {/* On essaie d'afficher le prénom, sinon "Mon Compte" */}
                <span>{user.user_metadata?.full_name?.split(' ')[0] || 'Mon Compte'}</span>
              </Link>
            ) : (
              // CAS VISITEUR : On affiche "Se connecter"
              <Link href="/login" className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition shadow">
                Se connecter
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}