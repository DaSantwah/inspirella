// Datos Mock
const obras = [
    { id: 1, titulo: "Cuadros fuera de campo", artista: "Sofía & Ana", disciplina: "Cine", imagen: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", tags: ["Cine", "Blanco y Negro"] },
    { id: 2, titulo: "Perspectiva Urbana", artista: "Daniela Ruiz", disciplina: "Fotografía", imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", tags: ["Fotografía", "Urbano"] },
    { id: 3, titulo: "Síntesis Analógica", artista: "Valeria M.", disciplina: "Diseño Sonoro", imagen: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", tags: ["Sonido", "Analógico"] },
    { id: 4, titulo: "Identidad", artista: "Colectivo FAV", disciplina: "Ilustración", imagen: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", tags: ["Ilustración", "Mixto"] },
    { id: 5, titulo: "Retrato del Viento", artista: "Elena Torres", disciplina: "Ilustración", imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", tags: ["Ilustración", "Digital"] },
    { id: 6, titulo: "Ecos Nocturnos", artista: "Camila R.", disciplina: "Fotografía", imagen: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", tags: ["Fotografía", "Naturaleza"] }
];

const artistas = [
    { id: 1, nombre: "Sofía & Ana", rol: "Directoras de Cine", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", enlaces: { inst: "#", web: "#" } },
    { id: 2, nombre: "Daniela Ruiz", rol: "Fotógrafa", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", enlaces: { inst: "#", be: "#" } },
    { id: 3, nombre: "Valeria M.", rol: "Diseñadora Sonora", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", enlaces: { web: "#", in: "#" } },
    { id: 4, nombre: "Colectivo FAV", rol: "Ilustradoras", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", enlaces: { inst: "#" } }
];

const oportunidades = [
    { id: 1, titulo: "Beca de Creación Audiovisual", tipo: "Beca", fecha: "30 Junio, 2026", desc: "Apoyo financiero de $5,000 USD para el desarrollo de un cortometraje dirigido por mujeres.", link: "#" },
    { id: 2, titulo: "Exposición Colectiva: 'Raíces'", tipo: "Exposición", fecha: "15 Julio, 2026", desc: "Convocatoria abierta para ilustradoras y pintoras que deseen exhibir en la Galería Central.", link: "#" },
    { id: 3, titulo: "Residencia Artística en la Montaña", tipo: "Residencia", fecha: "1 Agosto, 2026", desc: "Programa de 4 semanas para fotógrafas y artistas sonoras enfocadas en el medio ambiente.", link: "#" }
];

// Estado global para filtros
let currentFilter = 'Todos';

// ----- RENDERIZADO -----

function renderGallery(obrasRender) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    if (obrasRender.length === 0) {
        gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--texto-secundario);">No hay obras en esta categoría.</p>';
        return;
    }

    obrasRender.forEach(obra => {
        const tagsHtml = obra.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        const card = document.createElement('div');
        card.className = 'art-card';
        card.innerHTML = `
            <div class="img-wrapper">
                <img src="${obra.imagen}" alt="${obra.titulo}" loading="lazy">
                <button class="share-btn" title="Compartir obra" onclick="alert('Enlace copiado al portapapeles!')">
                    <i class='bx bx-share-alt'></i>
                </button>
            </div>
            <div class="card-info">
                <h3>${obra.titulo}</h3>
                <div class="artist">
                    <i class='bx bx-user-circle'></i> ${obra.artista}
                </div>
                <div class="tags">
                    ${tagsHtml}
                </div>
            </div>
        `;
        gallery.appendChild(card);
    });
}

function renderFilters() {
    const filtersContainer = document.getElementById('gallery-filters');
    const categories = ['Todos', 'Cine', 'Fotografía', 'Ilustración', 'Diseño Sonoro'];
    
    filtersContainer.innerHTML = '';
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${currentFilter === cat ? 'active' : ''}`;
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            currentFilter = cat;
            renderFilters(); // actualizar botones
            
            const filtered = cat === 'Todos' 
                ? obras 
                : obras.filter(o => o.disciplina === cat || o.tags.includes(cat));
            
            renderGallery(filtered);
        });
        filtersContainer.appendChild(btn);
    });
}

function renderDirectory(artistasRender) {
    const container = document.getElementById('directory-container');
    container.innerHTML = '';
    
    if (artistasRender.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron artistas.</p>';
        return;
    }

    artistasRender.forEach(art => {
        // Mapeo simple de iconos sociales
        const getIcon = (key) => {
            if(key === 'inst') return 'bxl-instagram';
            if(key === 'web') return 'bx-globe';
            if(key === 'be') return 'bxl-behance';
            if(key === 'in') return 'bxl-linkedin';
            return 'bx-link';
        };

        const linksHtml = Object.entries(art.enlaces).map(([key, url]) => 
            `<a href="${url}" target="_blank" rel="noopener"><i class='bx ${getIcon(key)}'></i></a>`
        ).join('');

        const card = document.createElement('div');
        card.className = 'artist-card';
        card.innerHTML = `
            <img src="${art.avatar}" alt="${art.nombre}" class="artist-avatar" loading="lazy">
            <h3 class="artist-name">${art.nombre}</h3>
            <div class="artist-role">${art.rol}</div>
            <div class="artist-links">
                ${linksHtml}
            </div>
        `;
        container.appendChild(card);
    });
}

function renderOpportunities() {
    const container = document.getElementById('opportunities-container');
    container.innerHTML = '';

    oportunidades.forEach(opp => {
        const card = document.createElement('div');
        card.className = 'opp-card';
        card.innerHTML = `
            <span class="opp-type">${opp.tipo}</span>
            <h3>${opp.titulo}</h3>
            <p>${opp.desc}</p>
            <div class="opp-meta">
                <span class="opp-deadline"><i class='bx bx-calendar-event'></i> ${opp.fecha}</span>
                <a href="${opp.link}" class="opp-link">Ver detalles <i class='bx bx-right-arrow-alt'></i></a>
            </div>
        `;
        container.appendChild(card);
    });
}

// ----- INICIALIZACIÓN Y EVENTOS -----

document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderizados iniciales
    renderFilters();
    renderGallery(obras);
    renderDirectory(artistas);
    renderOpportunities();

    // 2. Buscador del Directorio
    const searchInput = document.getElementById('search-artist');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = artistas.filter(a => 
                a.nombre.toLowerCase().includes(term) || 
                a.rol.toLowerCase().includes(term)
            );
            renderDirectory(filtered);
        });
    }

    // 3. Lógica del Modal
    const modal = document.getElementById('upload-modal');
    const btnSubir = document.getElementById('btn-subir');
    const btnClose = document.getElementById('close-modal');
    const form = document.getElementById('form-upload');

    if (btnSubir && modal) {
        btnSubir.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    if (btnClose && modal) {
        btnClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Cerrar modal al hacer click fuera
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Simular envío de formulario
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Enviando...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                alert('¡Gracias! Tu solicitud ha sido enviada para revisión.');
                modal.classList.remove('active');
                form.reset();
                btn.textContent = originalText;
                btn.style.opacity = '1';
            }, 1000);
        });
    }

    // 4. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('bx-menu');
                icon.classList.add('bx-x');
            } else {
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
    }
});
