import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { 
  BookOpen, 
  Home, 
  Plane, 
  FileText, 
  Compass, 
  GraduationCap, 
  ArrowRight, 
  Search 
} from 'lucide-react';
import styles from './Guide.module.css';

// Fonction utilitaire pour choisir une icône selon le sujet du guide
const getIcon = (slug: string) => {
  if (slug.includes('logement') || slug.includes('maison')) return <Home size={24} />;
  if (slug.includes('etude') || slug.includes('bourse')) return <GraduationCap size={24} />;
  if (slug.includes('visa') || slug.includes('voyage') || slug.includes('arrivee')) return <Plane size={24} />;
  if (slug.includes('admin') || slug.includes('papier')) return <FileText size={24} />;
  return <Compass size={24} />; // Icône par défaut
};

export default async function GuideIndex() {
  // Récupération des guides
  const { data: guides } = await supabase
    .from('content_pages')
    .select('id, title, slug, content')
    .eq('category', 'guide')
    .order('created_at', { ascending: true }); // Optionnel : trier par date

  return (
    <main className={styles.pageContainer}>
      
      {/* HERO SECTION */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Guide d'arrivée 🇲🇦</h1>
        <p className={styles.heroSubtitle}>
          Tout ce qu'il faut savoir pour réussir ton installation et ton parcours universitaire à Marrakech.
        </p>
      </div>

      <div className={styles.container}>
        
        {/* GRILLE DES GUIDES */}
        <div className={styles.grid}>
          {guides?.map((guide) => (
            <article key={guide.id} className={styles.card}>
              
              {/* Icône dynamique */}
              <div className={styles.iconHeader}>
                {getIcon(guide.slug)}
              </div>

              <h2 className={styles.cardTitle}>{guide.title}</h2>
              
              {/* Extrait propre (enlève les sauts de ligne excessifs) */}
              <p className={styles.cardExcerpt}>
                {guide.content.substring(0, 120).replace(/\n/g, ' ')}...
              </p>
              
              <Link href={`/guide/${guide.slug}`} className={styles.readMore}>
                Lire le guide <ArrowRight size={18} />
              </Link>

            </article>
          ))}

          {/* EMPTY STATE */}
          {(!guides || guides.length === 0) && (
            <div className={styles.emptyState}>
              <Search size={48} color="#9ca3af" style={{margin: '0 auto 1rem'}} />
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#374151'}}>
                Guides en cours de rédaction
              </h3>
              <p style={{color: '#6b7280', marginTop: '0.5rem'}}>
                Les articles seront bientôt disponibles.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}