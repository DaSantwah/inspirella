// 1. CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = "https://hlfttshebgjbgjpuqryg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ojoBDinCJlODvqObA_H_7g_uCYsLGHV";

// Inicializamos el cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. FUNCIÓN PARA CONSULTAR Y RENDERIZAR LA GALERÍA
async function fetchAndRenderGallery() {
    const gallery = document.getElementById('gallery');
    
    // Limpiamos el contenedor por si acaso
    gallery.innerHTML = '';

    // Hacemos la petición a la tabla 'obras'
    const { data: obras, error } = await supabase
        .from('obras')
        .select('*');

    if (error) {
        console.error('Error cargando los datos de Supabase:', error.message);
        gallery.innerHTML = '<p>Error al cargar la galería. Por favor, intenta más tarde.</p>';
        return;
    }

    // Si la tabla está vacía, mostramos un mensaje amigable
    if (!obras || obras.length === 0) {
        gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--texto-secundario);">Aún no hay obras publicadas. ¡Sé la primera!</p>';
        return;
    }

    // Iteramos sobre las obras reales traídas de la base de datos
    obras.forEach(obra => {
        const card = document.createElement('div');
        card.className = 'art-card';
        
        // Manejo de tags: si en la base de datos se guardó como texto separado por comas (ej: "Diseño, Cine"),
        // lo convertimos a un arreglo para poder mapearlo correctamente.
        const listaTags = obra.tags 
            ? obra.tags.split(',').map(tag => tag.trim()) 
            : [];
            
        const tagsHtml = listaTags.map(tag => `<span class="tag">${tag}</span>`).join('');

        // Nota: mapeamos 'imagen_url' que es el nombre que le dimos a la columna en la base de datos
        card.innerHTML = `
            <img src="${obra.imagen_url}" alt="${obra.titulo}" class="img-placeholder">
            <div class="card-info">
                <h3>${obra.titulo}</h3>
                <div class="artist">Por ${obra.artista}</div>
                <div class="tags">
                    ${tagsHtml}
                </div>
            </div>
        `;
        
        gallery.appendChild(card);
    });
}

// 3. INICIALIZADOR GLOBAL
document.addEventListener('DOMContentLoaded', () => {
    // Ejecutamos la carga dinámica desde la base de datos
    fetchAndRenderGallery();

    // Lógica interactiva del botón "Sube tu obra"
    const btnSubir = document.getElementById('btn-subir');
    if (btnSubir) {
        btnSubir.addEventListener('click', () => {
            alert('¡Conexión exitosa! Ya leemos datos de Supabase. El siguiente paso será construir el formulario interactivo para que puedas subir obras directamente desde aquí.');
        });
    }
});
