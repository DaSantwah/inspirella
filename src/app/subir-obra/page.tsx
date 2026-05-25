"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styles from "../admin/admin.module.css";
import { CheckCircle, Upload } from "lucide-react";

export default function SubirObraPage() {
  const [artTitle, setArtTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [discipline, setDiscipline] = useState("Ilustración");
  const [tags, setTags] = useState("");
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

  return (
    <div className={styles.adminContainer} style={{ paddingTop: "8rem" }}>
      <div className={styles.header}>
        <h1>Sube tu Obra</h1>
        <p>Comparte tu talento con la comunidad Inspirella y el mundo.</p>
      </div>

      <div className={styles.formCard}>
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
              <label>Tu Nombre o Seudónimo *</label>
              <input 
                type="text" 
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                required 
                placeholder="Ej. Daniela Ruiz"
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
              {isSubmitting ? "Subiendo Obra..." : <><CheckCircle size={18} /> Subir a Galería</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
