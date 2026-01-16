'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Heart, Code } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* --- SECTION HAUTE : 3 COLONNES --- */}
        <div className={styles.topSection}>
          
          {/* Colonne 1 : Identité */}
          <div className={styles.column}>
            <h3 className={styles.brand}>
              ANEM<span className={styles.brandHighlight}>.MKH</span>
            </h3>
            <p className={styles.description}>
              Association des Nigériens Étudiants et Stagiaires à Marrakech. 
              Unir, soutenir et accompagner.
            </p>
          </div>

          {/* Colonne 2 : Liens */}
          <div className={styles.column}>
            <h4 className={styles.heading}>Liens Rapides</h4>
            <ul className={styles.linkList}>
              <li><Link href="/" className={styles.link}>Accueil</Link></li>
              <li><Link href="/guide" className={styles.link}>Guide d'arrivée</Link></li>
              <li><Link href="/events" className={styles.link}>Événements</Link></li>
              <li><Link href="/about" className={styles.link}>À propos</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Réseaux */}
          <div className={styles.column}>
            <h4 className={styles.heading}>Nous suivre</h4>
            <div className={styles.socialIcons}>
              <a href="https://www.facebook.com/share/14XJYjojCj7/" className={`${styles.iconLink} ${styles.fb}`}>
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/anem_marrakech?igsh=Y212ZDM5NDE0cWw3" className={`${styles.iconLink} ${styles.insta}`}>
                <Instagram size={20} />
              </a>
              <a href="mailto:contact@anem.com" className={`${styles.iconLink} ${styles.mail}`}>
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* --- SÉPARATEUR --- */}
        <div className={styles.separator}></div>

        {/* --- SECTION BASSE : COPYRIGHT & SIGNATURE --- */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {currentYear} ANEM Section Marrakech. Tous droits réservés.
          </p>

          {/* TA SIGNATURE */}
          <div className={styles.signature}>
            <span>Développé avec</span>
            <Heart size={14} className={styles.heartIcon} />
            <span>par</span>
            <a 
              href="https://github.com/ton-pseudo" /* <-- Mets ton lien ici */
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.devName}
            >
              <Code size={14} style={{ display: 'inline', marginRight: '4px' }}/>
              KASSIMOUNE TAGO GARDI MAMAN BACHIR
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}