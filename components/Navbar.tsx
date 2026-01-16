'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // <--- 1. J'ai ajouté l'import ici
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Menu, X, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Guide', href: '/guide' },
    { name: 'Événements', href: '/events' },
    { name: 'À propos', href: '/about' },
  ];

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const getInitials = (u: User) => {
    const name = u.user_metadata?.full_name || u.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <nav className={styles.navContainer}>
      <div className={styles.inner}>
        {/* LOGO MODIFIÉ ICI */}
        <Link href="/" className={styles.logo}>
          {/* Assure-toi que ton image s'appelle logo.png dans le dossier public */}
          <Image 
            src="/logo.png" 
            alt="Logo ANEM" 
            width={40} 
            height={40} 
            className={styles.logoImg}
          />
          <div className={styles.logoText}>
            <span className={styles.logoGreen}>ANEM</span>
            <span className={styles.logoOrange}>.MKH</span>
          </div>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <div className={styles.navLinks}>
          {navLinks.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.link} ${pathname === item.href ? styles.activeLink : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* SECTION DROITE (Desktop) */}
        <div className={styles.rightSide}>
          {!loading && (
            user ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button 
                  className={styles.profileTrigger} 
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className={styles.avatar}>{getInitials(user)}</div>
                  <ChevronDown size={14} style={{ 
                    transform: profileOpen ? 'rotate(180deg)' : '', 
                    transition: '0.3s' 
                  }} />
                </button>

                {profileOpen && (
                  <div className={styles.dropdown}>
                    <Link href="/dashboard" className={styles.dropdownItem}>
                      <LayoutDashboard size={16} /> Mon Tableau de bord
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className={`${styles.dropdownItem} ${styles.logout}`}
                    >
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authDesktop}>
                <Link href="/login" className={styles.btnLogin}>Connexion</Link>
              </div>
            )
          )}
          
          {/* HAMBURGER MOBILE */}
          <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE REPLIABLE */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileContent}>
          {navLinks.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={styles.mobileLink}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <hr style={{ opacity: 0.1, margin: '1rem 0' }} />
          
          {!user ? (
            <Link href="/login" className={styles.btnLoginMobile} onClick={() => setIsOpen(false)}>
              Se connecter
            </Link>
          ) : (
            <>
              <Link href="/dashboard" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                <LayoutDashboard size={18} className="inline mr-2" /> Mon Tableau de bord
              </Link>
              <button 
                onClick={handleLogout} 
                className={`${styles.mobileLink} text-red-500`}
                style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}
              >
                <LogOut size={18} className="inline mr-2" /> Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}