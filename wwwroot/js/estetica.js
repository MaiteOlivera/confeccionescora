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
// ANIMACIONES AL APARECER EN PANTALLA
// ============================================

const elementosAnimados = document.querySelectorAll(".animar");

const observer = new IntersectionObserver(

    entradas => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visible");

            }

        });

    },

    {
        threshold: 0.2
    }

);

elementosAnimados.forEach(elemento => {

    observer.observe(elemento);

});



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
// FORMULARIO DE CONTACTO
// ============================================

const formulario = document.querySelector("#form-contacto");

if (formulario) {

    formulario.addEventListener("submit", function (e) {

        e.preventDefault();

        const nombre =
            document.querySelector("#nombre")?.value.trim();

        const telefono =
            document.querySelector("#telefono")?.value.trim();

        const consulta =
            document.querySelector("#consulta")?.value.trim();

        if (!nombre || !telefono || !consulta) {

            alert("Por favor completá todos los campos.");

            return;

        }

        alert(
            "Gracias " +
            nombre +
            ". Tu consulta fue preparada correctamente."
        );

    });

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