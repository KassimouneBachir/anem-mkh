'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LogOut, 
  Edit3, 
  GraduationCap, 
  Phone, 
  MapPin, 
  Mail, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      // 1. Check User
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // 2. Fetch Profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        // MODIFICATION ICI : On fusionne les données de la DB avec l'email de l'auth
        setProfile({ ...data, email: user.email });
      } else {
        // Fallback minimal si le profil n'existe pas encore en DB
        setProfile({ 
          email: user.email, 
          full_name: user.user_metadata.full_name || 'Utilisateur' 
        });
      }
      
      setLoading(false);
    };

    getProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh(); 
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className="animate-spin" size={48} />
        <p>Chargement de ton espace...</p>
      </div>
    );
  }

  // Si l'utilisateur n'a pas mis d'avatar, on affiche ses initiales ou un emoji
  const hasAvatar = profile?.avatar_url;

  return (
    <main className={styles.pageContainer}>
      
      {/* 1. Bannière Décorative */}
      <div className={styles.banner}></div>

      <div className={styles.mainContent}>
        
        {/* 2. Carte Principale (Header) */}
        <div className={styles.profileHeaderCard}>
          
          <div className={styles.avatarWrapper}>
            {hasAvatar ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className={styles.avatar} 
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                👋
              </div>
            )}
          </div>

          <div className={styles.profileInfo}>
            <p className={styles.welcomeText}>Espace Membre</p>
            <h1 className={styles.userName}>{profile?.full_name || 'Étudiant'}</h1>
            
            <div className={styles.userRole}>
              <CheckCircle2 size={14} /> Membre vérifié
            </div>
          </div>

          <Link href="/dashboard/edit" className={styles.editButton}>
            <Edit3 size={18} /> Modifier mon profil
          </Link>
        </div>

        {/* 3. Grille d'informations */}
        <div className={styles.gridSection}>
          
          {/* Carte Université */}
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <GraduationCap size={24} />
            </div>
            <div className={styles.cardContent}>
              <h3>Études</h3>
              <p>{profile?.major || 'Filière non renseignée'}</p>
              <p className="text-sm text-gray-500 font-normal">{profile?.university || 'Université non renseignée'}</p>
            </div>
          </div>

          {/* Carte Contact */}
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <Phone size={24} />
            </div>
            <div className={styles.cardContent}>
              <h3>Téléphone</h3>
              <p>{profile?.phone || 'Non renseigné'}</p>
            </div>
          </div>

          {/* Carte Email (affichera maintenant le vrai email) */}
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <Mail size={24} />
            </div>
            <div className={styles.cardContent}>
              <h3>Email</h3>
              <p className="text-sm md:text-base break-all">
                {profile?.email || 'email@exemple.com'}
              </p>
            </div>
          </div>

           {/* Carte Adresse (Optionnel) */}
           <div className={styles.infoCard}>
            <div className={styles.iconBox}>
              <MapPin size={24} />
            </div>
            <div className={styles.cardContent}>
              <h3>Ville</h3>
              <p>Marrakech</p>
            </div>
          </div>

        </div>

        {/* 4. Zone Danger */}
        <div className={styles.logoutWrapper}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} /> Se déconnecter
          </button>
        </div>

      </div>
    </main>
  );
}