import { supabase } from "@/lib/supabase";
import styles from "../page.module.css"; 

export default async function GaleriaPage() {
  const { data: artworks } = await supabase
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div style={{ padding: "6rem 5%", minHeight: "80vh" }}>
      <div className="section-header">
        <h2>Galería de Arte</h2>
        <p>Explora el talento y diversidad de disciplinas.</p>
      </div>

      <div className={styles.grid}>
        {artworks?.map((art) => (
          <div key={art.id} className={styles.card}>
            <div className={styles.imgWrapper}>
              <img src={art.image_url} alt={art.title} loading="lazy" />
            </div>
            <div className={styles.cardInfo}>
              <h3>{art.title}</h3>
              <div className={styles.artist}>Por {art.artist_name}</div>
              <div className={styles.tags}>
                {art.tags?.map((tag: string) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {(!artworks || artworks.length === 0) && (
          <p style={{ textAlign: "center", gridColumn: "1/-1" }}>No hay obras en la galería.</p>
        )}
      </div>
    </div>
  );
}
