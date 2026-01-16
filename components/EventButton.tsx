'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function EventButton({ eventId }: { eventId: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Au chargement, on vérifie si l'user est déjà inscrit
  useEffect(() => {
    const checkRegistration = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // On cherche si une ligne existe déjà dans la table participants
      const { data } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (data) setIsRegistered(true);
      setLoading(false);
    };

    checkRegistration();
  }, [eventId]);

  // 2. Action quand on clique
  const toggleRegistration = async () => {
    if (!userId) {
      router.push('/login'); // Si pas connecté, on envoie au login
      return;
    }

    setLoading(true);

    if (isRegistered) {
      // DÉSINSCRIPTION : On supprime la ligne
      await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);
      
      setIsRegistered(false);
    } else {
      // INSCRIPTION : On ajoute la ligne
      await supabase
        .from('event_participants')
        .insert([{ event_id: eventId, user_id: userId }]);
      
      setIsRegistered(true);
    }
    
    setLoading(false);
    router.refresh(); // Rafraîchit la page pour mettre à jour les compteurs si besoin
  };

  if (loading) return <button className="bg-gray-200 text-gray-500 px-6 py-2 rounded-lg animate-pulse">Chargement...</button>;

  return (
    <button
      onClick={toggleRegistration}
      className={`px-8 py-3 rounded-lg font-bold transition shadow-lg flex items-center gap-2 ${
        isRegistered
          ? "bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      {isRegistered ? (
        <>✖ Je ne viens plus</>
      ) : (
        <>✅ Je participe</>
      )}
    </button>
  );
}