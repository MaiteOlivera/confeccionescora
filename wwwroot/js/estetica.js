// ============================================
// MENÚ RESPONSIVE
// ============================================

const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("activo");
        menuBtn.classList.toggle("activo");
    });

    document.querySelectorAll(".nav a").forEach(enlace => {
        enlace.addEventListener("click", () => {
            nav.classList.remove("activo");
            menuBtn.classList.remove("activo");
        });
    });
}



// ============================================
// SLIDER / CARRUSEL DE PORTADA
// ============================================

const slides = document.querySelectorAll(".slide");

let slideActual = 0;

function mostrarSlide(numero) {

    if (slides.length === 0) return;

    slides.forEach(slide => {
        slide.classList.remove("activo");
    });

    slides[numero].classList.add("activo");
}

function siguienteSlide() {

    slideActual++;

    if (slideActual >= slides.length) {
        slideActual = 0;
    }

    mostrarSlide(slideActual);
}

if (slides.length > 0) {

    mostrarSlide(slideActual);

    setInterval(() => {
        siguienteSlide();
    }, 5000);
}



// ============================================
// SCROLL SUAVE ENTRE SECCIONES
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(enlace => {

    enlace.addEventListener("click", function (e) {

        const idDestino = this.getAttribute("href");

        if (idDestino === "#") return;

        const destino = document.querySelector(idDestino);

        if (destino) {

            e.preventDefault();

            destino.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});



// ============================================
// HEADER AL HACER SCROLL
// ============================================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {

        header.classList.add("scroll");

    } else {

        header.classList.remove("scroll");

    }

});



// ============================================
// ANIMACIONES AL HACER SCROLL
// ============================================


// ============================================
// OBSERVADOR
// ============================================

const observerScroll = new IntersectionObserver(

    entradas => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {

                // Aparece
                entrada.target.classList.add("mostrar");

            } else {

                // Desaparece cuando sale de pantalla
                entrada.target.classList.remove("mostrar");

            }

        });

    },

    {
        threshold: 0.12,

        rootMargin:
            "0px 0px -5% 0px"
    }

);


// ============================================
// PREPARAR ELEMENTO
// ============================================

function prepararAnimacion(
    elemento,
    tipo = "",
    delay = 0
) {

    if (!elemento) return;


    // Evita agregar la animación más de una vez
    if (
        elemento.dataset.animacionPreparada === "true"
    ) {
        return;
    }


    elemento.dataset.animacionPreparada =
        "true";


    elemento.classList.add(
        "animar-scroll"
    );


    if (tipo) {

        elemento.classList.add(tipo);

    }


    if (delay > 0) {

        elemento.style.transitionDelay =
            `${delay}ms`;

    }


    observerScroll.observe(elemento);

}


// ============================================
// ANIMAR GRUPO
// ============================================

function animarGrupo(
    selector,
    tipo = "",
    separacion = 80
) {

    const elementos =
        document.querySelectorAll(selector);


    elementos.forEach((elemento, index) => {

        prepararAnimacion(
            elemento,
            tipo,
            Math.min(index * separacion, 320)
        );

    });

}


// ============================================
// PREPARAR TODA LA PÁGINA
// ============================================

function prepararAnimacionesPagina() {


    // ========================================
    // DESCRIPCIÓN IZQUIERDA
    // ========================================

    animarGrupo(
        ".descripcion-lateral > *",
        "desde-izquierda",
        90
    );


    // ========================================
    // HERO
    // ========================================

    animarGrupo(
        ".hero-texto > *",
        "",
        100
    );


    document
        .querySelectorAll(".hero-imagen")
        .forEach(elemento => {

            prepararAnimacion(
                elemento,
                "desde-derecha"
            );

        });


    // ========================================
    // TÍTULOS DE SECCIONES
    // ========================================

    animarGrupo(
        "section h2",
        "",
        0
    );


    animarGrupo(
        "section .mini-titulo",
        "",
        0
    );


    animarGrupo(
        "section .linea",
        "",
        0
    );


    // ========================================
    // PÁRRAFOS
    // ========================================

    animarGrupo(
        "section > p",
        "",
        60
    );


    // ========================================
    // SERVICIOS
    // ========================================

    animarGrupo(
        ".servicios-encabezado > *",
        "",
        80
    );


    animarGrupo(
        ".servicio-card",
        "zoom",
        100
    );


    // ========================================
    // GALERÍA
    // ========================================

    animarGrupo(
        ".galeria img",
        "zoom",
        80
    );


    animarGrupo(
        ".imagenes-galeria img",
        "zoom",
        80
    );


    // ========================================
    // PREGUNTAS
    // ========================================

    animarGrupo(
        ".preguntas details",
        "",
        90
    );


    // ========================================
    // CONTACTO
    // ========================================

    animarGrupo(
        ".contacto .campo",
        "",
        80
    );


    animarGrupo(
        ".contacto-formulario > *",
        "",
        70
    );


    // ========================================
    // BOTONES
    // ========================================

    animarGrupo(
        "section .btn-principal",
        "zoom",
        0
    );


    animarGrupo(
        "section .boton",
        "zoom",
        0
    );


    // ========================================
    // IMÁGENES GENERALES
    // ========================================

    animarGrupo(
        "main section img",
        "zoom",
        60
    );


    // ========================================
    // TARJETAS GENERALES
    // ========================================

    animarGrupo(
        ".card",
        "zoom",
        90
    );


    animarGrupo(
        ".tarjeta",
        "zoom",
        90
    );


    // ========================================
    // FOOTER
    // ========================================

    animarGrupo(
        "footer > *",
        "",
        80
    );

}


// ============================================
// CUANDO CARGA LA WEB
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        prepararAnimacionesPagina();

    }
);


// ============================================
// ELEMENTOS CREADOS DINÁMICAMENTE
// ============================================

const listaServicios =
    document.querySelector("#lista-servicios");


if (listaServicios) {

    const observadorDOM =
        new MutationObserver(() => {

            document
                .querySelectorAll(".servicio-card")
                .forEach((elemento, index) => {

                    prepararAnimacion(
                        elemento,
                        "zoom",
                        Math.min(index * 100, 300)
                    );

                });

        });


    observadorDOM.observe(
        listaServicios,
        {
            childList: true,
            subtree: true
        }
    );

}

// ============================================
// BOTONES DE WHATSAPP
// ============================================

const botonesWhatsapp = document.querySelectorAll(".btn-whatsapp");

botonesWhatsapp.forEach(boton => {

    boton.addEventListener("click", () => {

        const telefono = boton.dataset.telefono;

        const mensaje =
            boton.dataset.mensaje ||
            "Hola, quisiera consultar por sus servicios de confección.";

        if (!telefono) return;

        const url =
            `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank");

    });

});



// ============================================
// BOTÓN VOLVER ARRIBA
// ============================================

const botonArriba = document.querySelector(".btn-arriba");

if (botonArriba) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            botonArriba.classList.add("visible");

        } else {

            botonArriba.classList.remove("visible");

        }

    });

    botonArriba.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}



// ============================================
// FORMULARIO DE CONTACTO → WHATSAPP
// ============================================

const formulario =
    document.querySelector("#form-contacto");

if (formulario) {

    formulario.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            // DATOS DEL FORMULARIO

            const nombre =
                document
                    .querySelector("#nombre")
                    ?.value.trim();

            const telefono =
                document
                    .querySelector("#telefono")
                    ?.value.trim();

            const consulta =
                document
                    .querySelector("#consulta")
                    ?.value.trim();


            // VALIDACIÓN

            if (
                !nombre ||
                !telefono ||
                !consulta
            ) {

                alert(
                    "Por favor completá todos los campos."
                );

                return;
            }


            // WHATSAPP DE CORA

            const whatsappCora =
                "59898547096";


            // MENSAJE QUE RECIBE CORA

            const mensaje = `
Hola, Cora Confecciones 👋

Quisiera realizar una consulta.

Nombre: ${nombre}

Teléfono / WhatsApp: ${telefono}

Consulta:
${consulta}
            `.trim();


            // CREAR ENLACE

            const urlWhatsapp =
                `https://wa.me/${whatsappCora}?text=${encodeURIComponent(mensaje)}`;


            // ABRIR WHATSAPP

            window.open(
                urlWhatsapp,
                "_blank"
            );

        }
    );

}

// ============================================
// CERRAR MENÚ AL HACER CLICK FUERA
// ============================================

document.addEventListener("click", e => {

    if (!nav || !menuBtn) return;

    if (
        !nav.contains(e.target) &&
        !menuBtn.contains(e.target)
    ) {

        nav.classList.remove("activo");
        menuBtn.classList.remove("activo");

    }

});



// ============================================
// MENSAJE CUANDO LA PÁGINA ESTÁ LISTA
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Cora Confecciones - sitio cargado correctamente.");

});