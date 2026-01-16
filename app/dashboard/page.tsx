'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      // 1. On récupère l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login'); // Si pas connecté -> Ouste !
        return;
      }

      // 2. On va chercher ses infos dans la table 'profiles'
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      } else {
        // Si pas de profil trouvé (cas des vieux comptes), on garde au moins l'email du user
        setProfile({ email: user.email, full_name: user.user_metadata.full_name });
      }
      
      setLoading(false);
    };

    getProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirection après déconnexion
    router.refresh(); // Force la mise à jour de la Navbar
  };

  if (loading) return <div className="p-10 text-center text-green-700">Chargement de ton profil...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="container mx-auto max-w-3xl">
        
        {/* Carte de Profil */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-green-700 h-32 w-full"></div> {/* Bandeau vert déco */}
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              {/* Avatar (Rond gris si pas d'image) */}
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-3xl shadow-md">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              
              {/* BOUTON EDITER (On le codera juste après) */}
              <Link href="/dashboard/edit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                ✏️ Modifier
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{profile?.full_name || 'Étudiant Anonyme'}</h1>
            <p className="text-green-600 font-medium">
              {profile?.major ? `${profile.major} à ${profile.university}` : 'Filière non renseignée'}
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Téléphone</p>
                <p className="text-gray-800">{profile?.phone || 'Non renseigné'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Statut</p>
                <p className="text-gray-800">Membre Actif ✅</p>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Danger / Déconnexion */}
        <div className="flex justify-end">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-lg hover:bg-red-100 transition border border-red-200 font-medium"
          >
            🚪 Se déconnecter
          </button>
        </div>

      </div>
    </main>
  );
}