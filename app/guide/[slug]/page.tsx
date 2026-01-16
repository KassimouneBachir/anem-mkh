import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, BookOpen } from 'lucide-react';
import styles from './GuideDetail.module.css';

// Type pour Next.js 15
export default async function GuideDetail({ params }: { params: Promise<{ slug: string }> }) {
  
  // 1. Récupération des paramètres
  const { slug } = await params;

  // 2. Récupération de l'article
  const { data: article } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Guide introuvable 😕</h1>
          <Link href="/guide" className="text-green-600 hover:underline mt-4 block">
            Retourner à la liste
          </Link>
        </div>
      </div>
    );
  }

  // 3. Calculs & Formatage
  // Estimation temps de lecture : moyenne de 200 mots/minute
  const wordCount = article.content?.split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  // Date de création (ou mise à jour si tu as le champ)
  const dateFormatted = new Date(article.created_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <main className={styles.pageContainer}>
      
      {/* Navigation Retour */}
      <nav className={styles.navBar}>
        <Link href="/guide" className={styles.backLink}>
          <ArrowLeft size={20} />
          Retour aux guides
        </Link>
      </nav>

      <article className={styles.articleContainer}>
        
        {/* En-tête de l'article */}
        <header className={styles.header}>
          <div className={styles.metaData}>
            <div className={styles.metaItem}>
              <Calendar size={16} />
              <span>{dateFormatted}</span>
            </div>
            <div className={styles.dot} />
            <div className={styles.metaItem}>
              <Clock size={16} />
              <span>{readTime} min de lecture</span>
            </div>
          </div>

          <h1 className={styles.title}>{article.title}</h1>
        </header>

        {/* Image Principale (Si dispo) */}
        {article.image_url && (
          <div className={styles.imageWrapper}>
            <img 
              src={article.image_url} 
              alt={article.title} 
              className={styles.mainImage} 
            />
          </div>
        )}

        {/* Contenu Texte */}
        <div className={styles.content}>
          {article.content}
        </div>

        {/* Footer Article */}
        <footer className={styles.footer}>
          <div className={styles.shareBox}>
            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
              <BookOpen size={20} />
              J'espère que ce guide t'a été utile !
            </span>
          </div>
        </footer>

      </article>
    </main>
  );
}