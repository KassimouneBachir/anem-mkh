'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2, UserPlus } from 'lucide-react';
import styles from './EventButton.module.css';

export default function EventButton({ eventId }: { eventId: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Vérification au chargement
  useEffect(() => {
    const checkRegistration = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const { data } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) setIsRegistered(true);
      setLoading(false);
    };

    checkRegistration();
  }, [eventId]);

  // 2. Action au clic
  const toggleRegistration = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      if (isRegistered) {
        // Désinscription
        const { error } = await supabase
          .from('event_participants')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', userId);
        if (error) throw error;
        setIsRegistered(false);
      } else {
        // Inscription
        const { error } = await supabase
          .from('event_participants')
          .insert([{ event_id: eventId, user_id: userId }]);
        if (error) throw error;
        setIsRegistered(true);
      }
      router.refresh();
    } catch (error: any) {
      console.error("Erreur:", error);
      alert(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDU LOADING ---
  if (loading) return (
    <button className={`${styles.btn} ${styles.loading}`} disabled>
       <Loader2 size={18} className={styles.spinner} /> Chargement...
    </button>
  );

  // --- RENDU PRINCIPAL ---
  return (
    <button
      onClick={toggleRegistration}
      // On applique la classe 'registered' ou 'unregistered' selon l'état
      className={`${styles.btn} ${isRegistered ? styles.registered : styles.unregistered}`}
    >
      {isRegistered ? (
        <>
          {/* Ce span s'affiche par défaut */}
          <span className={styles.textDefault}>
            <Check size={18} /> Inscrit(e)
          </span>
          {/* Ce span s'affiche uniquement au survol (hover) */}
          <span className={styles.textHover}>
            <X size={18} /> Se désinscrire
          </span>
        </>
      ) : (
        <>
          <UserPlus size={18} /> Je participe
        </>
      )}
    </button>
  );
}