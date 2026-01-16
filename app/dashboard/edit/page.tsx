'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Les champs du formulaire
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); // L'URL actuelle
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Le nouveau fichier choisi

  // 1. Charger les données actuelles
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFullName(data.full_name || '');
        setUniversity(data.university || '');
        setMajor(data.major || '');
        setPhone(data.phone || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    };

    getProfile();
  }, [router]);

  // 2. Fonction pour gérer la sauvegarde
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let finalAvatarUrl = avatarUrl;

    // A. Si l'utilisateur a choisi une nouvelle photo, on l'upload
    if (avatarFile) {
      const fileName = `${user.id}-${Date.now()}`; // Nom unique
      const { data, error: uploadError } = await supabase.storage
        .from('avatars') // Nom de ton bucket
        .upload(fileName, avatarFile);

      if (uploadError) {
        console.error("Erreur upload:", uploadError);
        alert("Erreur lors de l'envoi de l'image");
        setUpdating(false);
        return;
      }

      // On récupère l'URL publique pour la mettre dans la BDD
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      finalAvatarUrl = publicUrl;
    }

    // B. On utilise UPSERT (Si ça existe on modifie, sinon on crée)
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id, // INDISPENSABLE pour qu'il sache qui créer/modifier
        full_name: fullName,
        university,
        major,
        phone,
        avatar_url: finalAvatarUrl,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Erreur Supabase:", error); // Regarde ta console (F12) si ça échoue encore
      alert("Erreur lors de la sauvegarde : " + error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setUpdating(false);
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl h-fit">
        <h1 className="text-2xl font-bold text-green-800 mb-6">Modifier mon profil</h1>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
            <div className="flex items-center gap-4">
              {/* Prévisualisation */}
              <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden border">
                {avatarUrl ? (
                    <img src={avatarUrl} className="h-full w-full object-cover" />
                ) : (
                    <span className="flex h-full items-center justify-center text-2xl">👤</span>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom Complet</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Université / École</label>
              <input type="text" value={university} onChange={e => setUniversity(e.target.value)} placeholder="Ex: Cadi Ayyad" className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Filière</label>
              <input type="text" value={major} onChange={e => setMajor(e.target.value)} placeholder="Ex: Biologie" className="mt-1 w-full p-2 border rounded" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
                type="button" 
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
            >
                Annuler
            </button>
            <button 
                type="submit" 
                disabled={updating}
                className="px-6 py-2 bg-green-700 text-white font-bold rounded hover:bg-green-800 transition disabled:opacity-50"
            >
                {updating ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}