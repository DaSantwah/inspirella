// Datos mock de obras de arte
const obras = [
    {
        titulo: "Cuadros fuera de campo",
        artista: "Sofía & Ana",
        imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tags: ["Cómic", "Blanco y Negro"]
    },
    {
        titulo: "Perspectiva Urbana",
        artista: "Daniela Ruiz",
        imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tags: ["Fotografía", "Directora"]
    },
    {
        titulo: "Síntesis Analógica",
        artista: "Valeria M.",
        imagen: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tags: ["Diseño Sonoro", "Visuales"]
    },
    {
        titulo: "Identidad",
        artista: "Colectivo FAV",
        imagen: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tags: ["Ilustración", "Mixto"]
    }
];

// Función para renderizar la galería
function renderGallery() {
    const gallery = document.getElementById('gallery');
    
    obras.forEach(obra => {
        const card = document.createElement('div');
        card.className = 'art-card';
        
        // Generar etiquetas HTML
        const tagsHtml = obra.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        card.innerHTML = `
            <img src="${obra.imagen}" alt="${obra.titulo}" class="img-placeholder">
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderizamos las tarjetas de la galería
    renderGallery();

    // 2. Lógica interactiva del botón "Sube tu obra"
    const btnSubir = document.getElementById('btn-subir');
    
    if (btnSubir) {
        btnSubir.addEventListener('click', () => {
            alert('¡Hola! Por ahora estamos en versión de prueba. Pronto habilitaremos el formulario para que subas tu portafolio a nuestra base de datos.');
        });
    }
});
