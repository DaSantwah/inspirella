import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import styles from "./post.module.css";

// Formulario de comentarios como Client Component
import CommentForm from "./CommentForm";

export default async function BlogPost({ params }: { params: { id: string } }) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !post) {
    notFound();
  }

  // Fetch comentarios
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', post.id)
    .order('created_at', { ascending: true });

  return (
    <article className={styles.articleContainer}>
      <Link href="/blog" className={styles.backBtn}>
        <ArrowLeft size={16} /> Volver al Blog
      </Link>
      
      <header className={styles.header}>
        <span className={styles.category}>{post.category}</span>
        <h1>{post.title}</h1>
        <div className={styles.meta}>
          <span>Escrito por <strong>{post.author_name}</strong></span>
          <span>&bull;</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </header>

      {post.image_url && (
        <div className={styles.heroImage}>
          <img src={post.image_url} alt={post.title} />
        </div>
      )}

      <div className={styles.content}>
        {post.content.split('\n').map((paragraph: string, i: number) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <hr className={styles.divider} />

      <section className={styles.commentsSection}>
        <h2><MessageSquare size={24} /> Comentarios ({comments?.length || 0})</h2>
        
        <div className={styles.commentsList}>
          {comments?.map(comment => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentAvatar}>
                {comment.author_name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.commentBody}>
                <div className={styles.commentHeader}>
                  <strong>{comment.author_name}</strong>
                  <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
          {(!comments || comments.length === 0) && (
            <p>Sé la primera en comentar.</p>
          )}
        </div>

        <CommentForm postId={post.id} />
      </section>
    </article>
  );
}
