-- Inspirella: Supabase Schema

-- Habilitar extensión pgcrypto para UUIDs (aunque Supabase lo tiene por defecto)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Artículos del Blog
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    category TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Comentarios
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Galería de Arte
CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    discipline TEXT NOT NULL,
    image_url TEXT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configuración de Row Level Security (RLS)
-- Permitir lectura pública a todas las tablas, pero restringir inserción por ahora (se manejará en la UI)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Lectura pública de comentarios" ON comments FOR SELECT USING (true);
CREATE POLICY "Lectura pública de artworks" ON artworks FOR SELECT USING (true);

-- Permitimos que los usuarios inserten comentarios de forma anónima
CREATE POLICY "Inserción pública de comentarios" ON comments FOR INSERT WITH CHECK (true);

-- Insertar datos semilla (Mock Data)
INSERT INTO posts (title, content, author_name, category, image_url) VALUES 
('La dirección de fotografía vista por mujeres', 'Un ensayo sobre las dificultades y avances de las mujeres detrás de la cámara...', 'Elena Torres', 'Ensayo', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('Exposición Colectiva: Raíces y Frutos', 'Entrevistamos a las artistas de la nueva exposición colectiva sobre arte y naturaleza.', 'María López', 'Entrevista', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');

INSERT INTO artworks (title, artist_name, discipline, image_url, tags) VALUES 
('Cuadros fuera de campo', 'Sofía & Ana', 'Cine', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', ARRAY['Cine', 'Blanco y Negro']),
('Perspectiva Urbana', 'Daniela Ruiz', 'Fotografía', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', ARRAY['Fotografía', 'Urbano']),
('Síntesis Analógica', 'Valeria M.', 'Diseño Sonoro', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', ARRAY['Sonido', 'Analógico']);
