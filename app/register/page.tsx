'use client'; // Indispensable pour utiliser useState

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Création du compte Auth (Email/Pass)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Création immédiate du Profil public
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, // On lie les deux IDs
            full_name: fullName,
            // On laisse les autres champs vides pour l'instant, l'étudiant les remplira plus tard
          }
        ]);
        
      if (profileError) {
        console.error("Erreur création profil:", profileError);
        // On ne bloque pas l'utilisateur pour ça, mais c'est bon à savoir
      }
    }

    alert('Inscription réussie !');
    router.push('/dashboard'); // Ou router.push('/') selon ton choix
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">Rejoindre l'ANEM</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom Complet</label>
            <input 
              type="text" 
              required
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Création en cours...' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà membre ? <Link href="/login" className="text-orange-500 hover:underline">Se connecter</Link>
        </p>
      </div>
    </main>
  );
}