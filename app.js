// 1. CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = "https://hlfttshebgjbgjpuqryg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ojoBDinCJlODvqObA_H_7g_uCYsLGHV";

// ¡Aquí estaba el error! Le cambiamos el nombre a clienteSupabase para que no choque
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. FUNCIÓN PARA CONSULTAR Y RENDERIZAR LA GALERÍA
async function fetchAndRenderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    // Usamos clienteSupabase en lugar de supabase
    const { data: obras, error } = await clienteSupabase
        .from('obras')
        .select('*')
        .order('id', { ascending: false });

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

// 3. INICIALIZADOR Y LÓGICA DEL FORMULARIO
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderGallery();

    // Elementos del DOM para el Modal
    const modal = document.getElementById('modal-subir');
    const btnSubir = document.getElementById('btn-subir');
    const spanClose = document.querySelector('.close-btn');
    const formObra = document.getElementById('form-obra');

    // Abrir el modal
    if (btnSubir) {
        btnSubir.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    // Cerrar el modal con la X
    if (spanClose) {
        spanClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Cerrar el modal al hacer clic afuera
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Enviar datos a Supabase
    if (formObra) {
        formObra.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue sola
            
            // Extraemos los valores de los inputs
            const titulo = document.getElementById('titulo').value;
            const artista = document.getElementById('artista').value;
            const imagen_url = document.getElementById('imagen_url').value;
            const tags = document.getElementById('tags').value;

            // Insertamos usando nuestra variable renombrada
            const { data, error } = await clienteSupabase
                .from('obras')
                .insert([
                    { titulo: titulo, artista: artista, imagen_url: imagen_url, tags: tags }
                ]);

            if (error) {
                alert('Hubo un error al subir la obra: ' + error.message);
                console.error(error);
            } else {
                // Éxito: cerramos modal, limpiamos formulario y recargamos galería
                modal.style.display = 'none';
                formObra.reset();
                fetchAndRenderGallery();
            }
        });
    }
});
