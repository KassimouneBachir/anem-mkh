import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function EventsPage() {
  // 1. Récupérer les événements
  // .order('date', { ascending: true }) -> Trie du plus proche au plus lointain
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) console.error("Erreur events:", error);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
          📅 Agenda de l'ANEM
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events?.map((event) => {
            // 2. Formatage de la date en Français propre
            const dateObj = new Date(event.date);
            const dateLisible = dateObj.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });
            const heureLisible = dateObj.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
                
                {/* Image ou Placeholder coloré */}
                <div className="h-48 bg-green-100 relative">
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-green-800 font-bold text-4xl opacity-20">
                      ANEM
                    </div>
                  )}
                  {/* Badge Date flottant */}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-orange-500 shadow-sm">
                    {dateLisible}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h2>
                  
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <p className="flex items-center">
                      🕒 <span className="ml-2">{heureLisible}</span>
                    </p>
                    <p className="flex items-center">
                      📍 <span className="ml-2">{event.location}</span>
                    </p>
                  </div>

                  <p className="text-gray-600 line-clamp-3 mb-6 flex-grow">
                    {event.description}
                  </p>

                  <Link 
                    href={`/events/${event.id}`} 
                    className="block w-full text-center bg-green-700 text-white font-semibold py-2 rounded hover:bg-green-800 transition"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {(!events || events.length === 0) && (
          <p className="text-center text-gray-500 mt-10">Aucun événement prévu pour le moment.</p>
        )}
      </div>
    </main>
  );
}