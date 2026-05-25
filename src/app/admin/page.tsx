"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { Edit3, CheckCircle, ImagePlus, Upload } from "lucide-react";

export default function AdminPage() {
  const [secretCode, setSecretCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"blog" | "galeria">("blog");
  
  // Blog Form state
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("Ensayo");
  const [content, setContent] = useState("");
  
  // Gallery Form state
  const [artTitle, setArtTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [discipline, setDiscipline] = useState("Ilustración");
  const [tags, setTags] = useState("");

  // Shared file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode === "inspirella2026") {
      setIsAuthenticated(true);
    } else {
      alert("Código incorrecto");
    }
  };

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

  const handleSubmitBlog = async (e: React.FormEvent) => {
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

      alert("¡Artículo publicado con éxito!");
      router.push("/blog");
      router.refresh();
    } catch (err: any) {
      alert("Error al publicar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitArt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedFile) {
        throw new Error("Por favor, selecciona una imagen para subir tu obra.");
      }

      const finalImageUrl = await uploadImage(selectedFile);
      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

      const { error } = await supabase
        .from("artworks")
        .insert([
          { 
            title: artTitle, 
            artist_name: artistName, 
            discipline, 
            image_url: finalImageUrl, 
            tags: tagsArray 
          }
        ]);

      if (error) throw error;

      alert("¡Obra de arte subida con éxito!");
      router.push("/galeria");
      router.refresh();
    } catch (err: any) {
      alert("Error al subir obra: " + err.message);
    } finally {
      setIsSubmitting(false);
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
        <h1>Panel de Administración</h1>
        <p>Publica nuevos artículos en el blog o sube obras a la galería.</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={activeTab === "blog" ? styles.tabActive : styles.tab} 
          onClick={() => { setActiveTab("blog"); setSelectedFile(null); }}
        >
          <Edit3 size={18} /> Publicar Artículo (Blog)
        </button>
        <button 
          className={activeTab === "galeria" ? styles.tabActive : styles.tab} 
          onClick={() => { setActiveTab("galeria"); setSelectedFile(null); }}
        >
          <ImagePlus size={18} /> Subir Obra (Galería)
        </button>
      </div>

      <div className={styles.formCard}>
        {activeTab === "blog" ? (
          <form onSubmit={handleSubmitBlog} className={styles.editorForm}>
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
        ) : (
          <form onSubmit={handleSubmitArt} className={styles.editorForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Título de la Obra *</label>
                <input 
                  type="text" 
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  required 
                  placeholder="Ej. Perspectiva Urbana"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Nombre de la Artista *</label>
                <input 
                  type="text" 
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required 
                  placeholder="Tu nombre artístico"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Disciplina *</label>
                <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} required>
                  <option value="Ilustración">Ilustración</option>
                  <option value="Fotografía">Fotografía</option>
                  <option value="Cine">Cine</option>
                  <option value="Pintura">Pintura</option>
                  <option value="Diseño Sonoro">Diseño Sonoro</option>
                  <option value="Animación">Animación</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Etiquetas (separadas por comas)</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Ej. Urbano, Analógico, Blanco y Negro"
                />
              </div>

              <div className={styles.formGroupFull}>
                <label>Subir Archivo de la Obra (Requerido) *</label>
                <div 
                  className={styles.fileUploadArea} 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} />
                  <span>{selectedFile ? selectedFile.name : "Haz clic para seleccionar tu arte (JPG, PNG, GIF)"}</span>
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

            <div className={styles.formActions}>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Subiendo Obra..." : <><CheckCircle size={18} /> Subir Obra a Galería</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
