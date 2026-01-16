'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Loader2, Check, X } from 'lucide-react';

export default function EventButton({ eventId }: { eventId: string | number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkRegistration = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!user) {
          setUserId(null);
          setLoading(false);
          return;
        }
        setUserId(user.id);

        const { data, error } = await supabase
          .from('event_participants')
          .select('id')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setIsRegistered(!!data);
      } catch (err) {
        console.error('checkRegistration', err);
      } finally {
        setLoading(false);
      }
    };

    checkRegistration();
    return () => { mounted = false; };
  }, [eventId]);

  const toggleRegistration = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    setActionBusy(true);
    // Optimistic UI
    setIsRegistered(prev => !prev);

    try {
      if (isRegistered) {
        const { error } = await supabase
          .from('event_participants')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_participants')
          .insert([{ event_id: eventId, user_id: userId }]);
        if (error) throw error;
      }
      // optionally refresh counts
      router.refresh();
    } catch (err) {
      // revert optimistic
      setIsRegistered(prev => !prev);
      console.error('toggleRegistration', err);
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) {
    return (
      <button className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-100 text-gray-500 animate-pulse" disabled>
        <Loader2 size={16} className="animate-spin" /> Chargement...
      </button>
    );
  }

  return (
    <button
      onClick={toggleRegistration}
      disabled={actionBusy}
      className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition shadow-md ${
        isRegistered
          ? 'bg-red-50 text-red-700 border border-red-100 hover:bg-red-100'
          : 'bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500'
      } ${actionBusy ? 'opacity-80 cursor-wait' : ''}`}
    >
      {actionBusy ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {isRegistered ? 'Traitement...' : 'Traitement...'}
        </>
      ) : isRegistered ? (
        <>
          <X size={16} /> Je ne viens plus
        </>
      ) : (
        <>
          <Check size={16} /> ✅ Je participe
        </>
      )}
    </button>
  );
}