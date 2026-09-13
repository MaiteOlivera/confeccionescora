// ============================================
// SERVICIOS
// ============================================

async function cargarServiciosPagina(){

    const contenedor =
        document.querySelector("#lista-servicios");

    if(!contenedor){
        return;
    }

    try{

        const respuesta =
            await fetch(
                "/api/servicios",
                {
                    cache:"no-store"
                }
            );

        if(!respuesta.ok){
            throw new Error(
                "No se pudieron cargar los servicios."
            );
        }

        const servicios =
            await respuesta.json();

        contenedor.innerHTML = "";

        if(servicios.length === 0){

            contenedor.innerHTML =
                "<p>Próximamente agregaremos nuestros servicios.</p>";

            return;
        }

        servicios.forEach(servicio => {

            const tarjeta =
                document.createElement("article");

            tarjeta.className =
                "servicio-card";


            if(servicio.imagen){

                const imagen =
                    document.createElement("img");

                imagen.src =
                    servicio.imagen;

                imagen.alt =
                    servicio.nombre;

                imagen.className =
                    "servicio-imagen";

                tarjeta.appendChild(imagen);
            }


            const contenido =
                document.createElement("div");

            contenido.className =
                "servicio-contenido";


            const titulo =
                document.createElement("h3");

            titulo.textContent =
                servicio.nombre;


            const descripcion =
                document.createElement("p");

            descripcion.textContent =
                servicio.descripcion;


            contenido.appendChild(titulo);
            contenido.appendChild(descripcion);


            if(servicio.precio != null){

                const precio =
                    document.createElement("span");

                precio.className =
                    "servicio-precio";

                precio.textContent =
                    `Desde $${servicio.precio}`;

                contenido.appendChild(precio);
            }


            tarjeta.appendChild(contenido);

            contenedor.appendChild(tarjeta);
        });

    }catch(error){

        console.error(error);

        contenedor.innerHTML =
            "<p>No se pudieron cargar los servicios.</p>";
    }
}


// ============================================
// GALERÍA
// ============================================

async function cargarGaleriaPagina(){

    const contenedor =
        document.querySelector("#lista-galeria");

    if(!contenedor){
        return;
    }

    try{

        const respuesta =
            await fetch(
                "/api/galeria",
                {
                    cache:"no-store"
                }
            );

        if(!respuesta.ok){
            throw new Error(
                "No se pudo cargar la galería."
            );
        }

        const imagenes =
            await respuesta.json();

        contenedor.innerHTML = "";

        if(imagenes.length === 0){

            contenedor.innerHTML =
                "<p>Próximamente agregaremos nuevos trabajos.</p>";

            return;
        }

        imagenes.forEach(imagen => {

            const figura =
                document.createElement("figure");

            figura.className =
                "galeria-item";


            const foto =
                document.createElement("img");

            foto.src =
                imagen.imagen;

            foto.alt =
                imagen.titulo ||
                "Trabajo de Cora Confecciones";


            figura.appendChild(foto);


            if(imagen.titulo){

                const titulo =
                    document.createElement("figcaption");

                titulo.textContent =
                    imagen.titulo;

                figura.appendChild(titulo);
            }


            contenedor.appendChild(figura);
        });

    }catch(error){

        console.error(error);

        contenedor.innerHTML =
            "<p>No se pudo cargar la galería.</p>";
    }
}


// ============================================
// PREGUNTAS FRECUENTES
// ============================================

async function cargarPreguntasPagina(){

    const contenedor =
        document.querySelector("#lista-preguntas");

    if(!contenedor){
        return;
    }

    try{

        const respuesta =
            await fetch(
                "/api/preguntas",
                {
                    cache:"no-store"
                }
            );

        if(!respuesta.ok){
            throw new Error(
                "No se pudieron cargar las preguntas."
            );
        }

        const preguntas =
            await respuesta.json();

        contenedor.innerHTML = "";

        if(preguntas.length === 0){

            contenedor.innerHTML =
                "<p>Próximamente agregaremos preguntas frecuentes.</p>";

            return;
        }

        preguntas.forEach(pregunta => {

            const detalle =
                document.createElement("details");

            const titulo =
                document.createElement("summary");

            titulo.textContent =
                pregunta.pregunta;


            const respuestaTexto =
                document.createElement("p");

            respuestaTexto.textContent =
                pregunta.respuesta;


            detalle.appendChild(titulo);

            detalle.appendChild(
                respuestaTexto
            );

            contenedor.appendChild(detalle);
        });

    }catch(error){

        console.error(error);

        contenedor.innerHTML =
            "<p>No se pudieron cargar las preguntas.</p>";
    }
}


// ============================================
// INICIAR PÁGINA
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarServiciosPagina();

        cargarGaleriaPagina();

        cargarPreguntasPagina();

    }
);