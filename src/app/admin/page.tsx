"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { Edit3, CheckCircle } from "lucide-react";

export default function AdminPage() {
  const [secretCode, setSecretCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("Ensayo");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode === "inspirella2026") {
      setIsAuthenticated(true);
    } else {
      alert("Código incorrecto");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from("posts")
      .insert([
        { 
          title, 
          author_name: authorName, 
          category, 
          image_url: imageUrl || null, 
          content 
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      alert("Error al publicar el artículo: " + error.message);
    } else {
      alert("¡Artículo publicado con éxito!");
      router.push("/blog");
      router.refresh();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2>Acceso a Redacción</h2>
          <p>Ingresa el código secreto para publicar.</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input 
              type="password" 
              placeholder="Código secreto" 
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h1><Edit3 size={32} /> Redactar Nuevo Artículo</h1>
        <p>Publica tus ideas directamente en el blog.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.editorForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Título del Artículo *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
              placeholder="Ej. El color en el cine moderno"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Autora *</label>
            <input 
              type="text" 
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required 
              placeholder="Tu nombre completo"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Categoría *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="Ensayo">Ensayo</option>
              <option value="Opinión">Opinión</option>
              <option value="Entrevista">Entrevista</option>
              <option value="Noticia">Noticia</option>
              <option value="Reseña">Reseña</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>URL de la Imagen de Portada (Opcional)</label>
            <input 
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <div className={styles.formGroupFull}>
          <label>Contenido del Artículo *</label>
          <textarea 
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Escribe tu artículo aquí... Puedes usar varios párrafos."
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Publicando..." : <><CheckCircle size={18} /> Publicar Artículo</>}
          </button>
        </div>
      </form>
    </div>
  );
}
