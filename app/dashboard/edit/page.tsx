'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Camera, Save, X, Loader2, User } from 'lucide-react';
import styles from './EditProfile.module.css';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Champs
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [phone, setPhone] = useState('');
  
  // Gestion Avatar
  const [avatarUrl, setAvatarUrl] = useState(''); // URL BDD
  const [previewUrl, setPreviewUrl] = useState(''); // URL temporaire locale
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // 1. Charger données
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFullName(data.full_name || '');
        setUniversity(data.university || '');
        setMajor(data.major || '');
        setPhone(data.phone || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    };

    getProfile();
  }, [router]);

  // Gestion changement image (Prévisualisation)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      // Créer une URL locale pour afficher l'image tout de suite
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 2. Sauvegarde
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let finalAvatarUrl = avatarUrl;

    // A. Upload Image (si nouveau fichier)
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);

      if (uploadError) {
        alert("Erreur upload image");
        setUpdating(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      finalAvatarUrl = publicUrl;
    }

    // B. Upsert Profil
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        university,
        major,
        phone,
        avatar_url: finalAvatarUrl,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      router.push('/dashboard');
      router.refresh();
    } else {
      alert("Erreur sauvegarde");
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 gap-2">
        <Loader2 className="animate-spin" /> Chargement...
      </div>
    );
  }

  // L'image à afficher est soit la prévisualisation locale, soit l'url de la BDD
  const displayImage = previewUrl || avatarUrl;

  return (
    <main className={styles.pageContainer}>
      <div className={styles.card}>
        
        <div className={styles.header}>
          <h1 className={styles.title}>Modifier mon profil</h1>
          <p className={styles.subtitle}>Mettez à jour vos informations personnelles.</p>
        </div>

        <form onSubmit={handleSave}>
          
          {/* SECTION AVATAR */}
          <div className={styles.avatarSection}>
            <label className={styles.avatarWrapper}>
              {displayImage ? (
                <img src={displayImage} alt="Avatar" className={styles.avatarImage} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <User size={48} />
                </div>
              )}
              
              {/* Overlay au survol */}
              <div className={styles.uploadOverlay}>
                <Camera size={24} />
                <span className="text-xs font-medium mt-1">Modifier</span>
              </div>

              {/* Input caché */}
              <input 
                type="file" 
                accept="image/*" 
                className={styles.hiddenInput}
                onChange={handleImageChange}
              />
            </label>
            <p className={styles.subtitle} style={{marginTop: '10px', fontSize: '0.8rem'}}>
              Cliquez sur la photo pour changer
            </p>
          </div>

          {/* GRILLE DU FORMULAIRE */}
          <div className={styles.formGrid}>
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Nom complet</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Téléphone</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="+212 6..."
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Université / École</label>
              <input 
                type="text" 
                value={university} 
                onChange={e => setUniversity(e.target.value)} 
                placeholder="Ex: Cadi Ayyad"
                className={styles.input}
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Filière / Spécialité</label>
              <input 
                type="text" 
                value={major} 
                onChange={e => setMajor(e.target.value)} 
                placeholder="Ex: Biologie, Économie..."
                className={styles.input}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={() => router.back()}
              className={styles.cancelButton}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={updating}
              className={styles.saveButton}
            >
              {updating ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Enregistrement...
                </>
              ) : (
                <>
                  <Save size={18} /> Enregistrer
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}