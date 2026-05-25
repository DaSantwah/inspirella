"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./blog.module.css";
import { Send } from "lucide-react";

export default function BlogFeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setPosts(data);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: `Pensamiento de ${name}`,
          author_name: name,
          content: content,
          category: "Idea"
        }
      ])
      .select();

    setIsSubmitting(false);

    if (!error && data) {
      setPosts([data[0], ...posts]);
      setContent("");
    } else {
      alert("Error al publicar la idea.");
    }
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.header}>
        <h2>Muro de la Comunidad</h2>
        <p>Comparte tus ideas, pensamientos y conecta con otras creativas.</p>
      </div>

      <div className={styles.composer}>
        <form onSubmit={handlePost}>
          <input 
            type="text" 
            placeholder="Tu Nombre o Seudónimo" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea 
            placeholder="¿Qué estás pensando? Comparte una idea o reflexión..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className={styles.composerActions}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Publicando..." : <><Send size={16} /> Publicar</>}
            </button>
          </div>
        </form>
      </div>

      <div className={styles.feed}>
        {posts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postHeader}>
              <div className={styles.avatar}>
                {post.author_name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.postMeta}>
                <h3>{post.author_name}</h3>
                <span>{new Date(post.created_at).toLocaleString()}</span>
              </div>
            </div>
            <div className={styles.postContent}>
              {post.content}
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Sé la primera en compartir una idea.</p>
        )}
      </div>
    </div>
  );
}
