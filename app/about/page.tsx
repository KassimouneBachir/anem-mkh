import { supabase } from "@/lib/supabaseClient";
import { Quote, GraduationCap, HeartHandshake, Globe, AlertCircle } from 'lucide-react';
import styles from './About.module.css';

// --- FONCTION DE RÉCUPÉRATION ---
async function getPresidentWord() {
  const { data, error } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', 'mot-president')
    .single();

  if (error) {
    console.error("Erreur Supabase:", JSON.stringify(error, null, 2));
    return null;
  }
  return data;
}

// --- COMPOSANT PAGE ---
export default async function AboutPage() {
  const data = await getPresidentWord();

  // --- GESTION ERREUR ---
  if (!data) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Oups !</h2>
          <p style={{ color: '#6b7280' }}>Impossible de charger le contenu pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.pageContainer}>
      {/* Fond dégradé */}
      <div className={styles.heroBackground} />

      <div className={styles.inner}>
        
        {/* EN-TÊTE */}
        <div className={styles.headerSection}>
          <span className={styles.badge}>À Propos</span>
          <h1 className={styles.mainTitle}>
            Qui sommes <span className={styles.highlight}>nous ?</span>
          </h1>
          <p className={styles.subTitle}>
            Découvrez l'association, notre vision et l'équipe qui œuvre pour la communauté nigérienne à Marrakech.
          </p>
        </div>

        {/* CARTE PRÉSIDENT */}
        <div className={styles.presidentCard}>
          {/* Barre colorée du haut */}
          <div className={styles.gradientLine} />
          
          <div className={styles.cardContent}>
            
            {/* Colonne Image */}
            <div className={styles.imageCol}>
              {data.image_url ? (
                <img 
                  src={data.image_url} 
                  alt="Le Président" 
                  className={styles.presidentImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  Photo non disponible
                </div>
              )}
            </div>

            {/* Colonne Texte */}
            <div className={styles.textCol}>
              <Quote size={60} className={styles.quoteIcon} />
              
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h2 className={styles.presidentTitle}>
                  {data.title || "Le Mot du Président"}
                </h2>
                <div className={styles.separator} />
                
                <div className={styles.textContent}>
                  {data.content}
                </div>

                <div className={styles.signature}>
                  <span className={styles.sigName}>Le Président</span>
                  <span className={styles.sigRole}>ANEM Marrakech</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* GRID DES VALEURS */}
        <div className={styles.valuesGrid}>
            
            {/* Carte 1 */}
            <div className={`${styles.valueCard} ${styles.cardGreen}`}>
                <div className={styles.iconBox}>
                    <GraduationCap size={28} />
                </div>
                <h3 className={styles.cardTitle}>Accompagnement</h3>
                <p className={styles.cardText}>
                    Un soutien constant pour guider chaque étudiant dans ses démarches administratives et sa réussite universitaire.
                </p>
            </div>

            {/* Carte 2 */}
            <div className={`${styles.valueCard} ${styles.cardOrange}`}>
                <div className={styles.iconBox}>
                    <HeartHandshake size={28} />
                </div>
                <h3 className={styles.cardTitle}>Solidarité</h3>
                <p className={styles.cardText}>
                    Créer un véritable esprit de famille, d'entraide et de fraternité entre tous les nigériens présents à Marrakech.
                </p>
            </div>

            {/* Carte 3 */}
            <div className={`${styles.valueCard} ${styles.cardBlue}`}>
                <div className={styles.iconBox}>
                    <Globe size={28} />
                </div>
                <h3 className={styles.cardTitle}>Rayonnement</h3>
                <p className={styles.cardText}>
                    Promouvoir avec fierté la richesse de la culture nigérienne au sein du Royaume du Maroc.
                </p>
            </div>

        </div>

      </div>
    </main>
  );
}