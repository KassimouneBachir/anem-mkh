import EventButton from "@/components/EventButton";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, ArrowLeft, Clock, Info } from 'lucide-react';
import styles from './EventDetail.module.css';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;

  // Récupération de l'événement
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Événement introuvable (ID: {id})
      </div>
    );
  }

  // Nombre de participants
  const { count: participantCount } = await supabase
    .from('event_participants')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', id);

  // Formatage des dates
  const dateObj = new Date(event.date);
  const fullDate = dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const time = dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <main className={styles.pageWrapper}>
      
      {/* --- HERO SECTION --- */}
      <div className={styles.heroSection}>
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className={styles.heroImage} />
        )}
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroContent}>
          <Link href="/events" className={styles.backLink}>
             <ArrowLeft size={18} /> Retour à l'agenda
          </Link>

          <h1 className={styles.eventTitle}>{event.title}</h1>

          <div className={styles.heroBadges}>
            <span className={`${styles.badge} ${styles.badgeGreen}`}>
              <Calendar size={16} /> {fullDate}
            </span>
            <span className={`${styles.badge} ${styles.badgeOrange}`}>
              <Users size={16} /> {participantCount || 0} participants
            </span>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className={styles.container}>
        
        {/* COLONNE GAUCHE : Description */}
        <div className={styles.contentCard}>
          <h2 className={styles.sectionTitle}>
            <Info size={24} color="#15803d" />
            À propos de l'événement
          </h2>
          <div className={styles.descriptionText}>
            {event.description}
          </div>
        </div>

        {/* COLONNE DROITE : Sidebar Infos Sticky */}
        <aside className={styles.sidebar}>
          
          <div className={styles.infoCard}>
            <h3 className={styles.sectionTitle} style={{fontSize: '1.2rem', marginBottom: '1.5rem'}}>
              Détails pratiques
            </h3>

            {/* Date */}
            <div className={styles.infoRow}>
              <div className={styles.infoIconBox}><Calendar size={20} /></div>
              <div className={styles.infoContent}>
                <h4>Date</h4>
                <p className="capitalize">{fullDate}</p>
              </div>
            </div>

            {/* Heure */}
            <div className={styles.infoRow}>
              <div className={styles.infoIconBox}><Clock size={20} /></div>
              <div className={styles.infoContent}>
                <h4>Heure</h4>
                <p>{time}</p>
              </div>
            </div>

            {/* Lieu */}
            <div className={styles.infoRow}>
              <div className={styles.infoIconBox}><MapPin size={20} /></div>
              <div className={styles.infoContent}>
                <h4>Lieu</h4>
                <p>{event.location}</p>
              </div>
            </div>
            
            {/* Action Button Component */}
            <div className={styles.actionWrapper}>
               {/* Note : Assure-toi que ton composant EventButton a un style 
                  width: 100% ou block pour remplir l'espace 
               */}
               <EventButton eventId={event.id} />
            </div>

            {/* Fausse carte Google Maps (Déco) */}
            <div className={styles.mapPlaceholder}>
              <MapPin size={24} style={{marginRight: 8}} />
              Carte non disponible
            </div>

          </div>
        </aside>

      </div>
    </main>
  );
}