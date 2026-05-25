import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "../page.module.css"; // Reutilizamos estilos

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div style={{ padding: "6rem 5%", minHeight: "80vh" }}>
      <div className="section-header">
        <h2>Blog y Opinión</h2>
        <p>Lee, reflexiona y debate con los artículos de la comunidad.</p>
        <div style={{ marginTop: "2rem" }}>
          <Link href="/blog/nuevo" className="btn-primary">
            Escribe tu propio artículo
          </Link>
        </div>
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
          <p style={{ textAlign: "center", gridColumn: "1/-1" }}>No hay artículos publicados todavía.</p>
        )}
      </div>
    </div>
  );
}
