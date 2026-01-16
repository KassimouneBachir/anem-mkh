import { supabase } from "@/lib/supabaseClient";

// Cette fonction va chercher les données AVANT d'afficher la page
async function getPresidentWord() {
  const { data, error } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', 'mot-president') // On cherche spécifiquement cette ligne
    .single(); // On en veut une seule

  if (error) {
    // JSON.stringify permet de forcer l'affichage du contenu de l'erreur
    console.error("Détail de l'erreur Supabase:", JSON.stringify(error, null, 2));
    
    // Vérification des clés (ne les partage pas ici, vérifie juste qu'elles s'affichent)
    console.log("URL Supabase détectée:", process.env.NEXT_PUBLIC_SUPABASE_URL); 
    return null;
  }
  return data;
}

export default async function AboutPage() {
  const data = await getPresidentWord();

  if (!data) {
    return <div className="p-10 text-center">Chargement des données impossible...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* En-tête de la page */}
        <h1 className="text-4xl font-bold text-green-800 mb-8 border-b-2 border-orange-500 pb-2">
          Qui sommes-nous ?
        </h1>

        {/* Bloc Mot du Président */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Zone Image (Placeholder si pas d'image) */}
          <div className="w-full md:w-1/3 flex-shrink-0">
             {data.image_url ? (
                <img src={data.image_url} alt="Le Président" className="rounded-lg w-full object-cover shadow-sm" />
             ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    Photo du Président
                </div>
             )}
          </div>

          {/* Zone Texte */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{data.title}</h2>
            {/* On affiche le texte qui vient de la BD */}
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {data.content}
            </p>
          </div>
        </div>

        {/* Section Mission (On pourrait aussi la mettre en BD, mais hardcodons pour l'exemple de structure) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded border border-green-200">
                <h3 className="font-bold text-xl text-green-800 mb-2">🎓 Accompagnement</h3>
                <p>Aider les étudiants dans leurs démarches administratives et pédagogiques.</p>
            </div>
            <div className="bg-orange-50 p-6 rounded border border-orange-200">
                <h3 className="font-bold text-xl text-orange-800 mb-2">🤝 Solidarité</h3>
                <p>Créer un esprit de famille et d'entraide entre tous les nigériens de Marrakech.</p>
            </div>
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
                <h3 className="font-bold text-xl text-gray-800 mb-2">🌍 Culture</h3>
                <p>Promouvoir la culture nigérienne au sein du royaume du Maroc.</p>
            </div>
        </div>

      </div>
    </main>
  );
}