document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para el menú de navegación ---
    let menuIcon = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) { // Asegurarse de que los elementos existan
        menuIcon.onclick = () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        };
    }

    // --- Lógica para estrellas y nubes ---
    const estrellasContainer = document.getElementById('estrellas-container');
    const nubesContainer = document.getElementById('nubes-container');
    const nubesElementos = document.querySelectorAll('.nube-imagen');

    // Generar estrellas aleatorias
    if (estrellasContainer) {
        for (let i = 0; i < 150; i++) {
            const estrella = document.createElement('div');
            estrella.classList.add('estrella');
            estrella.style.left = `${Math.random() * 100}%`;
            estrella.style.top = `${Math.random() * 100}%`;
            estrella.style.animationDelay = `${Math.random() * 3}s`;
            estrellasContainer.appendChild(estrella);
        }
    }

    // Asignar imágenes de nubes (SVG) a cada elemento de nube
    if (nubesElementos.length > 0) {
        nubesElementos.forEach(nube => {
            const rutaImagen = nube.dataset.src;
            if (rutaImagen) {
                nube.style.backgroundImage = `url('${rutaImagen}')`;
                nube.style.backgroundRepeat = 'no-repeat';
                nube.style.backgroundSize = 'contain';
                const velocidadAleatoria = 0.02 + Math.random() * 0.08;
                nube.dataset.velocidad = velocidadAleatoria;
                nube.style.animationDelay = `${Math.random() * 10}s`;
            }
        });
    }

    // --- Lógica para el título de la sección Parallax Hero ---
    const parallaxHeroSection = document.querySelector('.parallax-hero');
    const tituloHeroContent = document.querySelector('.titulo-hero');

    function animateTituloHeroOnScroll() {
        if (parallaxHeroSection && tituloHeroContent) {
            const sectionTop = parallaxHeroSection.getBoundingClientRect().top;
            const scrollThreshold = window.innerHeight * 0.5;

            if (sectionTop < scrollThreshold) {
                tituloHeroContent.classList.add('visible');
            } else {
                tituloHeroContent.classList.remove('visible');
            }
        }
    }

    // Agrega el event listener para el scroll (solo si hay elementos para animar)
    if (parallaxHeroSection || tituloHeroContent) {
        window.addEventListener('scroll', animateTituloHeroOnScroll);
        animateTituloHeroOnScroll(); // Llama una vez al cargar para el estado inicial
    }

    // --- Lógica para el Carrusel de Videos (¡Única instancia y corregida!) ---
    const carousel = document.querySelector('.video-carousel');
    const slides = document.querySelectorAll('.video-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Solo inicializa el carrusel si hay slides presentes
    if (totalSlides > 0 && carousel) {

        function createIndicators() {
            if (!indicatorsContainer) return; // Asegúrate de que el contenedor de indicadores exista
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('carousel-indicator');
                indicator.dataset.index = i;
                indicator.addEventListener('click', () => {
                    goToSlide(i);
                });
                indicatorsContainer.appendChild(indicator);
            }
        }

        // Función para actualizar la vista del carrusel y los indicadores
        function updateCarousel() {
            if (slides.length === 0) return; // Si no hay slides, no hacer nada

            // Obtén el ancho real en píxeles de un slide.
            // Esto es CRUCIAL para que el desplazamiento sea exacto.
            const slideWidth = slides[0].offsetWidth;

            carousel.style.transform = `translateX(${-currentIndex * slideWidth}px)`;

            // Actualizar indicadores
            document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // Ir a un slide específico
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        // Navegar al slide anterior
        function prevSlide() {
            currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
            updateCarousel();
        }

        // Navegar al siguiente slide
        function nextSlide() {
            currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        }

        // Añadir event listeners a los botones de navegación
        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }
        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }

        // Inicializar carrusel
        createIndicators();
        updateCarousel(); // Muestra el primer slide y activa el indicador inicial
    }
});

// --- Lógica de Parallax (montaña, esfera, estrellas, nubes) en el scroll de la ventana ---
// Estas variables y el listener de scroll pueden estar fuera de DOMContentLoaded si se refieren a elementos que siempre están presentes
// o si no quieres que esperen por todo el DOM, aunque incluirlos dentro de un DOMContentLoaded general es una práctica común.
// Para el propósito de esta corrección, los dejo como estaban, ya que tu problema principal era el carrusel.
const montana = document.querySelector('.montana');
const esfera = document.querySelector('.esfera');
const parallaxHero = document.querySelector('.parallax-hero');

function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

const montanaTargetY = 35;
const montanaStartY = -120;
const esferaAnimationStartPoint = 0.3;
const esferaAnimationEndPoint = 1.0;
const esferaStartYPorcentaje = -0.2;
const esferaTargetYPorcentaje = 0.4;
const esferaTargetXPorcentaje = 0.2;
const esferaStartXPorcentaje = 0;

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const heroTop = parallaxHero ? parallaxHero.offsetTop : 0; // Añadir comprobación
    const heroHeight = parallaxHero ? parallaxHero.offsetHeight : 0; // Añadir comprobación
    const heroWidth = parallaxHero ? parallaxHero.offsetWidth : 0; // Añadir comprobación
    const windowHeight = window.innerHeight;

    let esferaScrollProgress = 0;
    const startPointPx = esferaAnimationStartPoint * windowHeight;
    const endPointPx = esferaAnimationEndPoint * windowHeight;

    if (scrollPosition >= startPointPx && scrollPosition <= endPointPx) {
        esferaScrollProgress = (scrollPosition - startPointPx) / (endPointPx - startPointPx);
    } else if (scrollPosition > endPointPx) {
        esferaScrollProgress = 1;
    }
    esferaScrollProgress = Math.max(0, Math.min(1, esferaScrollProgress));

    let montanaCurrentY = montanaStartY;
    if (scrollPosition < heroTop) {
        const deltaY = montanaTargetY - montanaStartY;
        const progress = scrollPosition / heroTop;
        montanaCurrentY = montanaStartY + progress * deltaY;
        if (deltaY > 0 && montanaCurrentY > montanaTargetY) montanaCurrentY = montanaTargetY;
        else if (deltaY < 0 && montanaCurrentY < montanaTargetY) montanaCurrentY = montanaTargetY;
    } else {
        montanaCurrentY = montanaTargetY;
    }

    const esferaStartY = esferaStartYPorcentaje * heroHeight;
    const esferaTargetY = esferaTargetYPorcentaje * heroHeight;
    const esferaStartX = esferaStartXPorcentaje * heroWidth;
    const esferaTargetX = esferaTargetXPorcentaje * heroWidth;
    const easedProgress = easeOutQuart(esferaScrollProgress);
    const esferaCurrentY = esferaStartY + easedProgress * (esferaTargetY - esferaStartY);
    const esferaCurrentX = esferaStartX + easedProgress * (esferaTargetX - esferaStartX);

    if (montana) { // Asegurarse de que la montaña exista
        montana.style.transform = `translateY(${montanaCurrentY}px)`;
    }
    if (esfera) { // Asegurarse de que la esfera exista
        esfera.style.transform = `translate(-50%, -50%) translateY(${esferaCurrentY}px) translateX(${esferaCurrentX}px)`;
    }

    const estrellasContainer = document.getElementById('estrellas-container');
    if (estrellasContainer) {
        estrellasContainer.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }

    const nubesContainer = document.getElementById('nubes-container');
    if (nubesContainer) {
        nubesContainer.querySelectorAll('.nube-imagen').forEach(nube => {
            const velocidad = parseFloat(nube.dataset.velocidad) || 0.04;
            nube.style.transform = `translateX(${scrollPosition * velocidad}px) translateZ(0)`;
        });
    }
});