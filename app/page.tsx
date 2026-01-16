import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react'; // Une petite flèche pour le style
import styles from './Home.module.css';

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      
      {/* 1. IMAGE DE FOND */}
      {/* Assure-toi d'avoir mis l'image dans le dossier public/ */}
      <Image
        src="/kech2.jpg" 
        alt="Marrakech et étudiants"
        fill // Demande à l'image de remplir le conteneur parent
        priority // Charge cette image en priorité car c'est la plus importante
        className={styles.bgImage}
      />

      {/* 2. FILTRE SOMBRE */}
      <div className={styles.overlay}></div>

      {/* 3. CONTENU TEXTE */}
      <div className={styles.contentWrapper}>
        
        <span className={styles.badge}>Bienvenue dans la Ville Ocre</span>
        
        <h1 className={styles.title}>
          ANEM Section <span className={styles.titleHighlight}>Marrakech</span>
        </h1>
        
        <p className={styles.subtitle}>
          La plateforme officielle pour accompagner, unir et soutenir la communauté estudiantine nigérienne dans la ville ocre.
        </p>
        
        {/* 4. BOUTON LIEN VERS L'INSCRIPTION */}
        <Link href="/register" className={styles.ctaButton}>
          Rejoindre la communauté <ArrowRight size={20} />
        </Link>
        
      </div>
    </main>
  );
}