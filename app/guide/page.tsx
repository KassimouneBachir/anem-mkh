import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function GuideIndex() {
  // On récupère TOUS les articles qui ont la catégorie 'guide'
  const { data: guides } = await supabase
    .from('content_pages')
    .select('id, title, slug, content') // On prend juste ce qu'il faut
    .eq('category', 'guide');

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Guide d'arrivée 🇲🇦</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides?.map((guide) => (
            <div key={guide.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h2 className="text-xl font-bold mb-2 text-gray-800">{guide.title}</h2>
              {/* On affiche juste le début du texte (les 100 premiers caractères) */}
              <p className="text-gray-600 mb-4">{guide.content.substring(0, 100)}...</p>
              
              {/* Le lien magique vers la page dynamique */}
              <Link href={`/guide/${guide.slug}`} className="text-orange-500 font-bold hover:underline">
                Lire la suite →
              </Link>
            </div>
          ))}
        </div>

        {(!guides || guides.length === 0) && (
            <p>Aucun guide disponible pour le moment.</p>
        )}
      </div>
    </main>
  );
}