document.addEventListener('DOMContentLoaded', () => {
    let menuIcon = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
});

const estrellasContainer = document.getElementById('estrellas-container');
const montaña = document.querySelector('.montana');
const esfera = document.querySelector('.esfera');
const parallaxHero = document.querySelector('.parallax-hero');

// --- Funciones de Easing ---
// Aquí puedes probar con diferentes funciones para ver cuál te gusta más.
// easeOutQuad (la que ya usas)
function easeOutQuad(t) {
    return t * (2 - t);
}

// easeOutCubic: Un poco más suave que easeOutQuad
function easeOutCubic(t) {
    return (--t) * t * t + 1;
}

// easeOutQuart: Muy buena para movimientos que desaceleran suavemente al final
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// easeOutExpo: Extremadamente suave al final, simula una desaceleración muy prolongada
function easeOutExpo(t) {
    return (t === 1) ? 1 : 1 - Math.pow(2, -10 * t);
}


// POSICIÓN VERTICAL FINAL DESEADA PARA LA MONTAÑA
const montañaTargetY = 35; // Ejemplo

// PUNTO DE INICIO DE LA MONTAÑA
const montañaStartY = -120; // Ejemplo

// --- PARÁMETROS DE ANIMACIÓN PARA LA ESFERA ---

// INICIO DE LA ANIMACIÓN DE LA ESFERA:
// Este valor debe ser un porcentaje (0.0 a 1.0) de la altura de la ventana.
// Un valor de 0.0 significa que la animación empieza en el mismo momento en que el scroll es 0.
// Un valor de 0.1 significa que la animación empieza cuando has scrolleado el 10% de la ventana.
// Si lo tenías en '3', la animación empezaba demasiado tarde.
const esferaAnimationStartPoint = 0.3; // Cambiado de '3' a '0.0' para que empiece al inicio del scroll.
                                       // Puedes probar 0.1, 0.2, etc., si quieres un pequeño retraso.

// FIN DE LA ANIMACIÓN DE LA ESFERA:
// También es un porcentaje (0.0 a 1.0+) de la altura de la ventana.
// Un valor mayor que 1.0 hará que la animación se extienda más allá del final del primer "viewport".
// Aumentar este valor hará la transición más lenta y suave.
const esferaAnimationEndPoint = 1.0; // Mantenido en 1.0, pero puedes probar 1.2, 1.5 para más suavidad.


// POSICIÓN VERTICAL INICIAL Y FINAL DESEADA PARA LA ESFERA
// Estos son porcentajes de la altura del '.parallax-hero'.
const esferaStartYPorcentaje = -0.2; // La esfera empieza 20% de la altura del hero 'arriba' de su centro.
const esferaTargetYPorcentaje = 0.4; // La esfera termina 40% de la altura del hero 'abajo' de su centro.
// DESPLAZAMIENTO HORIZONTAL FINAL DESEADO PARA LA ESFERA
// Estos son porcentajes del ancho del '.parallax-hero'.
const esferaTargetXPorcentaje = 0.2; // Se moverá 20% del ancho del hero a la derecha.
const esferaStartXPorcentaje = 0;   // Empieza en el centro horizontal (gracias a `translate(-50%)` en CSS).


// Generar estrellas aleatorias
for (let i = 0; i < 200; i++) {
    const estrella = document.createElement('div');
    estrella.classList.add('estrella');
    estrella.style.left = `${Math.random() * 100}%`;
    estrella.style.top = `${Math.random() * 100}%`;
    estrella.style.animationDelay = `${Math.random() * 3}s`;
    estrellasContainer.appendChild(estrella);
}

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const heroTop = parallaxHero.offsetTop;
    const heroHeight = parallaxHero.offsetHeight;
    const heroWidth = parallaxHero.offsetWidth;
    const heroBottom = heroTop + heroHeight;
    const windowHeight = window.innerHeight; // Altura de la ventana del navegador

    // --- Cálculo del scrollProgress para la Esfera ---
    let esferaScrollProgress = 0;

    // Calcular los puntos de inicio y fin de la animación de la esfera en píxeles.
    const startPointPx = esferaAnimationStartPoint * windowHeight;
    const endPointPx = esferaAnimationEndPoint * windowHeight;

    if (scrollPosition >= startPointPx && scrollPosition <= endPointPx) {
        esferaScrollProgress = (scrollPosition - startPointPx) / (endPointPx - startPointPx);
    } else if (scrollPosition > endPointPx) {
        esferaScrollProgress = 1; // La animación ha terminado, la esfera está en su posición final.
    }
    // Asegurarse de que el progreso esté siempre entre 0 y 1.
    esferaScrollProgress = Math.max(0, Math.min(1, esferaScrollProgress));


    // --- Lógica para la Montaña ---
    let montañaCurrentY = montañaStartY;

    if (scrollPosition < heroTop) {
        const deltaY = montañaTargetY - montañaStartY;
        const progress = scrollPosition / heroTop;
        montañaCurrentY = montañaStartY + progress * deltaY;

        // Asegurarse de que no sobrepase el target
        if (deltaY > 0 && montañaCurrentY > montañaTargetY) {
            montañaCurrentY = montañaTargetY;
        } else if (deltaY < 0 && montañaCurrentY < montañaTargetY) {
            montañaCurrentY = montañaTargetY;
        }
    } else {
        montañaCurrentY = montañaTargetY; // Se queda en el target cuando el hero llega a la parte superior.
    }


    // --- Lógica para la Esfera (movimiento con easing) ---
    const esferaStartY = esferaStartYPorcentaje * heroHeight;
    const esferaTargetY = esferaTargetYPorcentaje * heroHeight;
    const esferaStartX = esferaStartXPorcentaje * heroWidth;
    const esferaTargetX = esferaTargetXPorcentaje * heroWidth;

    // APLICA LA FUNCIÓN DE EASING AQUÍ:
    // Puedes cambiar 'easeOutQuad' por 'easeOutCubic', 'easeOutQuart' o 'easeOutExpo'
    // para probar diferentes suavidades.
    const easedProgress = easeOutQuart(esferaScrollProgress); // <--- CAMBIADO: Usando easeOutQuart por defecto.

    const esferaCurrentY = esferaStartY + easedProgress * (esferaTargetY - esferaStartY);
    const esferaCurrentX = esferaStartX + easedProgress * (esferaTargetX - esferaStartX);


    // --- Aplica las transformaciones CSS ---
    montaña.style.transform = `translateY(${montañaCurrentY}px)`;
    esfera.style.transform = `translate(-50%, -50%) translateY(${esferaCurrentY}px) translateX(${esferaCurrentX}px)`;

    // Las estrellas pueden seguir ligadas al scroll general
    estrellasContainer.style.transform = `translateY(${scrollPosition * 0.1}px)`;
});
