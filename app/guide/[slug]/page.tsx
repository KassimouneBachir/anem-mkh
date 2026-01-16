import { supabase } from "@/lib/supabaseClient";

// 1. ATTENTION : Le type de params est maintenant une Promise !
export default async function GuideDetail({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. On "attend" que les paramètres soient chargés
  const { slug } = await params;

  // 3. On demande à la BD : "Donne-moi l'article qui a ce slug là"
  const { data: article } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', slug) // On utilise la variable 'slug' qu'on vient d'attendre
    .single();

  if (!article) {
    return <div className="p-10">Article non trouvé :(</div>;
  }

  return (
    <main className="min-h-screen bg-white p-10">
      <div className="container mx-auto max-w-3xl">
        <a href="/guide" className="text-gray-500 hover:text-green-700 mb-4 inline-block">← Retour au guide</a>
        
        <h1 className="text-4xl font-bold text-green-800 mb-6">{article.title}</h1>
        
        {/* Affichage de l'image si elle existe */}
        {article.image_url && (
            <img src={article.image_url} alt={article.title} className="w-full h-64 object-cover rounded-lg mb-8" />
        )}

        <div className="prose lg:prose-xl text-gray-700 whitespace-pre-line">
          {article.content}
        </div>
      </div>
    </main>
  );
}