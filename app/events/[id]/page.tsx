import EventButton from "@/components/EventButton";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";

// NOTE: Le type de params est maintenant une Promise !
export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. On "attend" que les paramètres soient chargés (Spécifique Next.js 15)
  const { id } = await params;

  // 2. Maintenant on peut utiliser 'id' (et pas params.id)
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    console.error("Erreur ou événement introuvable:", error);
    return <div className="p-10 text-center">Événement introuvable (ID: {id})</div>;
  }

  // On compte le nombre de participants
  const { count: participantCount } = await supabase
    .from('event_participants')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', id);

  // Formatage date complet
  const dateFull = new Date(event.date).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/events" className="text-gray-500 hover:text-green-700 mb-6 inline-block">
            ← Retour à l'agenda
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Bannière */}
            <div className="h-64 bg-gray-200 w-full relative">
                {event.image_url && <img src={event.image_url} className="w-full h-full object-cover" />}
            </div>

            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8 border-b pb-8">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        📅 {dateFull}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium ml-2">
                        👥 {participantCount || 0} participants
                    </span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                        📍 {event.location}
                    </span>
                </div>

                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                    {event.description}
                </div>
              
                {/* Bouton d'action DYNAMIQUE */}
                <div className="mt-8 pt-8 border-t flex justify-end">
                    <EventButton eventId={event.id} />
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}