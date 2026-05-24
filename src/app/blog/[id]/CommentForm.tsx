"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./post.module.css";
import { useRouter } from "next/navigation";

export default function CommentForm({ postId }: { postId: string }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("comments")
      .insert([
        { post_id: postId, author_name: name, content: content }
      ]);

    setIsSubmitting(false);

    if (!error) {
      setName("");
      setContent("");
      router.refresh(); // Refresca la página para mostrar el nuevo comentario
    } else {
      alert("Error al enviar comentario.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <h3>Deja tu opinión</h3>
      <div className={styles.formGroup}>
        <input 
          type="text" 
          placeholder="Tu Nombre" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required 
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.formGroup}>
        <textarea 
          placeholder="¿Qué piensas sobre esto?" 
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Publicando..." : "Publicar Comentario"}
      </button>
    </form>
  );
}
