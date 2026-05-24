import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // Fetch latest artworks
  const { data: artworks } = await supabase
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch latest posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Bienvenida a la comunidad</span>
          <h1>Un espacio seguro para <span>crear y debatir</span>.</h1>
          <p>Plataforma dedicada a la difusión del trabajo de mujeres artistas, y al intercambio crítico de ideas sobre la industria.</p>
          <div className={styles.heroButtons}>
            <Link href="/blog" className="btn-primary btn-large">Leer el Blog</Link>
            <Link href="/galeria" className="btn-secondary btn-large">Ver Galería</Link>
          </div>
        </div>
        <div className={styles.heroGraphics}>
          <div className={`${styles.blob} ${styles.blob1}`}></div>
          <div className={`${styles.blob} ${styles.blob2}`}></div>
        </div>
      </section>

      {/* Galería Destacada */}
      <section className={styles.section}>
        <div className="section-header">
          <h2>Galería Reciente</h2>
          <p>Descubre el talento de nuestra comunidad.</p>
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
            <p style={{ textAlign: "center", gridColumn: "1/-1" }}>No hay obras recientes (Ejecuta el script SQL en Supabase para insertar datos).</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/galeria" className="btn-secondary">Ver todas las obras <ArrowRight size={16} style={{marginLeft: '0.5rem'}}/></Link>
        </div>
      </section>

      {/* Blog Destacado */}
      <section className={`${styles.section} ${styles.bgLila}`}>
        <div className="section-header">
          <h2>Últimos Artículos</h2>
          <p>Voces y opiniones de nuestra comunidad.</p>
        </div>
        <div className={styles.grid}>
          {posts?.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postImgWrapper}>
                <img src={post.image_url || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} alt={post.title} />
              </div>
              <div className={styles.postInfo}>
                <span className={styles.category}>{post.category}</span>
                <h3><Link href={`/blog/${post.id}`}>{post.title}</Link></h3>
                <p className={styles.excerpt}>{post.content.substring(0, 100)}...</p>
                <div className={styles.postMeta}>
                  <span>Por {post.author_name}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {(!posts || posts.length === 0) && (
            <p style={{ textAlign: "center", gridColumn: "1/-1" }}>No hay artículos recientes.</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/blog" className="btn-primary">Leer más artículos <ArrowRight size={16} style={{marginLeft: '0.5rem'}}/></Link>
        </div>
      </section>
    </>
  );
}
