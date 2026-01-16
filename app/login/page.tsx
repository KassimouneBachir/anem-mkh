'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, AlertCircle, LogIn } from 'lucide-react'; // Ajout d'icônes
import styles from './Login.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <main className={styles.pageContainer}>
      <div className={styles.loginCard}>
        
        {/* En-tête de la carte */}
        <div className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              background: '#dcfce7', 
              padding: '12px', 
              borderRadius: '50%', 
              color: '#15803d' 
            }}>
              <LogIn size={32} />
            </div>
          </div>
          <h1 className={styles.title}>Bon retour !</h1>
          <p className={styles.subtitle}>Connectez-vous pour accéder à votre espace membre ANEM.</p>
        </div>
        
        {/* Message d'erreur */}
        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} className={styles.form}>
          
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              required
              placeholder="exemple@email.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Mot de passe</label>
            <input 
              id="password"
              type="password" 
              required
              placeholder="••••••••"
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
            {loading ? 'Connexion en cours...' : "Se connecter"}
          </button>
        </form>

        <p className={styles.footerText}>
          Pas encore de compte ?{' '}
          <Link href="/register" className={styles.link}>
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}