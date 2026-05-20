// 1. CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = "https://hlfttshebgjbgjpuqryg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ojoBDinCJlODvqObA_H_7g_uCYsLGHV";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. FUNCIÓN PARA CONSULTAR Y RENDERIZAR LA GALERÍA
async function fetchAndRenderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    const { data: obras, error } = await supabase.from('obras').select('*');

    if (error) {
        console.error('Error:', error.message);
        gallery.innerHTML = '<p>Error al cargar la galería.</p>';
        return;
    }

    if (!obras || obras.length === 0) {
        gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--texto-secundario);">Aún no hay obras publicadas. ¡Sé la primera!</p>';
        return;
    }

    obras.forEach(obra => {
        const card = document.createElement('div');
        card.className = 'art-card';
        
        const listaTags = obra.tags ? obra.tags.split(',').map(tag => tag.trim()) : [];
        const tagsHtml = listaTags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // Salvavidas: Busca la imagen ya sea en la columna "imagen_url" o "imagen"
        const urlImagen = obra.imagen_url || obra.imagen || '';

        card.innerHTML = `
            <img src="${urlImagen}" alt="${obra.titulo || 'Obra sin título'}" class="img-placeholder">
            <div class="card-info">
                <h3>${obra.titulo || 'Sin título'}</h3>
                <div class="artist">Por ${obra.artista || 'Anónimo'}</div>
                <div class="tags">${tagsHtml}</div>
            </div>
        `;
        
        gallery.appendChild(card);
    });
}

// 3. INICIALIZADOR GLOBAL
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderGallery();

    const btnSubir = document.getElementById('btn-subir');
    if (btnSubir) {
        btnSubir.addEventListener('click', () => {
            alert('¡Conexión exitosa! Ya leemos datos de Supabase.');
        });
    }
});
