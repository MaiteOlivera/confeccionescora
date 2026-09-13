// ============================================
// CONEXIÓN CON BACKEND C#
// ============================================

async function cargarServiciosDesdeBackend(){

    try{

        const respuesta = await fetch("/api/servicios");

        if(!respuesta.ok){
            throw new Error("No se pudieron cargar los servicios.");
        }

        const servicios = await respuesta.json();

        console.log("Servicios recibidos desde C#:");
        console.log(servicios);

    }catch(error){

        console.error("Error al conectar con C#:",error);

    }

}

cargarServiciosDesdeBackend();

// ============================================
// SERVICIOS DESDE EL BACKEND
// ============================================

async function cargarServiciosPagina(){

    const contenedor =
        document.querySelector("#lista-servicios");

    if(!contenedor){
        return;
    }

    try{

        const respuesta =
            await fetch("/api/servicios",{
                cache:"no-store"
            });

        if(!respuesta.ok){
            throw new Error(
                "No se pudieron cargar los servicios."
            );
        }

        const servicios =
            await respuesta.json();

        contenedor.innerHTML = "";

        if(servicios.length === 0){

            const mensaje =
                document.createElement("p");

            mensaje.className =
                "sin-servicios";

            mensaje.textContent =
                "Próximamente agregaremos nuestros servicios.";

            contenedor.appendChild(mensaje);

            return;
        }

        servicios.forEach(servicio => {

            const tarjeta =
                document.createElement("article");

            tarjeta.className =
                "servicio-card";


            // IMAGEN

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


            // CONTENIDO

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


            // PRECIO

            if(
                servicio.precio !== null &&
                servicio.precio !== undefined
            ){

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

        contenedor.innerHTML = "";

        const mensaje =
            document.createElement("p");

        mensaje.className =
            "error-servicios";

        mensaje.textContent =
            "No se pudieron cargar los servicios.";

        contenedor.appendChild(mensaje);

    }

}


// CARGAR CUANDO ABRE LA PÁGINA

document.addEventListener(
    "DOMContentLoaded",
    cargarServiciosPagina
);


// ACTUALIZAR AUTOMÁTICAMENTE CADA 5 SEGUNDOS

setInterval(
    cargarServiciosPagina,
    5000
);