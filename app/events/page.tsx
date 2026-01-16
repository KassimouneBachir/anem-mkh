import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, PartyPopper } from 'lucide-react';
import styles from './Events.module.css';

// Type pour TypeScript (optionnel mais recommandé)
type EventType = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url: string | null;
};

export default async function EventsPage() {
  // 1. Récupération des données
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) console.error("Erreur fetching events:", error);

  return (
    <main className={styles.pageContainer}>
      
      {/* HERO SECTION */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>📅 Agenda de l'ANEM</h1>
        <p className={styles.heroSubtitle}>
          Retrouvez tous les événements passés et à venir de la communauté nigérienne à Marrakech.
        </p>
      </div>

      <div className={styles.container}>
        
        {/* GRILLE D'ÉVÉNEMENTS */}
        <div className={styles.eventsGrid}>
          {events?.map((event: EventType) => {
            const dateObj = new Date(event.date);
            
            // Formatage pour le badge calendrier
            const dayNumber = dateObj.toLocaleDateString("fr-FR", { day: "numeric" });
            const monthShort = dateObj.toLocaleDateString("fr-FR", { month: "short" });
            
            // Formatage pour l'heure
            const timeString = dateObj.toLocaleTimeString("fr-FR", { 
              hour: "2-digit", minute: "2-digit" 
            });

            return (
              <article key={event.id} className={styles.card}>
                
                {/* ZONE IMAGE */}
                <div className={styles.imageWrapper}>
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.title} 
                      className={styles.eventImage} 
                    />
                  ) : (
                    // Placeholder si pas d'image
                    <div style={{ 
                      width: '100%', height: '100%', 
                      background: 'linear-gradient(45deg, #15803d, #14532d)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', opacity: 0.8 
                    }}>
                      <Calendar size={48} />
                    </div>
                  )}

                  {/* BADGE DATE FLOTTANT */}
                  <div className={styles.dateBadge}>
                    <span className={styles.dateDay}>{dayNumber}</span>
                    <span className={styles.dateMonth}>{monthShort}</span>
                  </div>
                </div>

                {/* ZONE CONTENU */}
                <div className={styles.content}>
                  <h2 className={styles.title}>{event.title}</h2>
                  
                  <div className={styles.metaContainer}>
                    <div className={styles.metaItem}>
                      <Clock size={16} color="#f97316" />
                      <span>{timeString}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <MapPin size={16} color="#15803d" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className={styles.description}>
                    {event.description}
                  </p>

                  <div className={styles.cardFooter}>
                    <Link href={`/events/${event.id}`} className={styles.button}>
                      Voir les détails 
                      <ArrowRight size={18} className={styles.iconArrow} />
                    </Link>
                  </div>
                </div>

              </article>
            );
          })}

          {/* EMPTY STATE (Si aucun événement) */}
          {(!events || events.length === 0) && (
            <div className={styles.emptyState}>
              <PartyPopper size={64} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '0.5rem' }}>
                Aucun événement pour le moment
              </h3>
              <p style={{ color: '#6b7280' }}>
                Revenez plus tard pour découvrir les prochaines activités de l'ANEM !
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}