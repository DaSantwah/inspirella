"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styles from "../../admin/admin.module.css";
import { Edit3, CheckCircle, Upload } from "lucide-react";

export default function NuevoArticuloPage() {
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("Ensayo");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file);
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("No se pudo subir la imagen. ¿Aseguraste de ejecutar storage.sql en Supabase?");
    }
    
    const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = null;
      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      const { error } = await supabase
        .from("posts")
        .insert([
          { 
            title, 
            author_name: authorName, 
            category, 
            image_url: finalImageUrl, 
            content 
          }
        ]);

      if (error) throw error;

      alert("¡Artículo publicado con éxito! Gracias por compartir tu voz.");
      router.push("/blog");
      router.refresh();
    } catch (err: any) {
      alert("Error al publicar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.adminContainer} style={{ paddingTop: "8rem" }}>
      <div className={styles.header}>
        <h1>Comparte tu Voz</h1>
        <p>Escribe y publica tu propio artículo para la comunidad de Inspirella.</p>
      </div>

      <div className={styles.formCard}>
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
                <option value="Poesía">Poesía</option>
                <option value="Cuento">Cuento</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Subir Foto de Portada (Opcional)</label>
              <div 
                className={styles.fileUploadArea} 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} />
                <span>{selectedFile ? selectedFile.name : "Haz clic para seleccionar archivo"}</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className={styles.hiddenFileInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroupFull}>
            <label>Contenido del Artículo * (Soporta miles de palabras)</label>
            <textarea 
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Escribe tu artículo aquí... Puedes escribir sin límite de palabras. Pulsa Enter para separar párrafos."
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Publicando..." : <><CheckCircle size={18} /> Publicar Artículo</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
