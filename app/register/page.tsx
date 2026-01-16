'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import styles from './Register.module.css';

export default function Register() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Création Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Création Profil Public
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id,
            full_name: fullName,
          }
        ]);
        
      if (profileError) {
        console.error("Erreur création profil:", profileError);
        // On continue quand même, ce n'est pas bloquant pour l'auth
      }
    }

    // Succès -> Redirection
    // Note : Idéalement, affiche un message "Vérifiez vos emails" si Supabase est configuré pour confirmer l'email.
    router.push('/dashboard');
    router.refresh(); 
  };

  return (
    <main className={styles.pageContainer}>
      <div className={styles.card}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full text-green-700">
               <UserPlus size={32} />
            </div>
          </div>
          <h1 className={styles.title}>Rejoindre l'ANEM</h1>
          <p className={styles.subtitle}>
            Crée ton compte pour participer aux événements et accéder aux guides.
          </p>
        </div>
        
        {/* ERROR */}
        {error && <div className={styles.errorBox}>{error}</div>}

        {/* FORM */}
        <form onSubmit={handleRegister} className={styles.form}>
          
          {/* Nom Complet */}
          <div className={styles.inputWrapper}>
            <User size={20} className={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="Nom complet"
              required
              className={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className={styles.inputWrapper}>
            <Mail size={20} className={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="Adresse email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Mot de passe */}
          <div className={styles.inputWrapper}>
            <Lock size={20} className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder="Mot de passe (6 car. min)"
              required
              minLength={6}
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Création...
              </>
            ) : (
              <>
                Créer mon compte <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className={styles.footerText}>
          Déjà membre ?{' '}
          <Link href="/login" className={styles.link}>
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}