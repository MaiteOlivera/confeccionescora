// ==========================================
// ELEMENTOS GENERALES
// ==========================================

const enlacesMenu =
    document.querySelectorAll(".admin-link");

const secciones =
    document.querySelectorAll(".admin-seccion");


// ==========================================
// NAVEGACIÓN PANEL
// ==========================================

enlacesMenu.forEach(boton => {

    boton.addEventListener("click", () => {

        enlacesMenu.forEach(item =>
            item.classList.remove("activo")
        );

        boton.classList.add("activo");


        secciones.forEach(seccion =>
            seccion.classList.remove("activa")
        );


        const nombre =
            boton.dataset.seccion;


        document
            .querySelector(`#seccion-${nombre}`)
            ?.classList.add("activa");

    });

});



// ==========================================
// FUNCIÓN GENERAL SUBIR IMAGEN
// ==========================================

async function subirImagen(input){

    const archivo =
        input.files[0];


    if(!archivo){
        return null;
    }


    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if(!tiposPermitidos.includes(archivo.type)){

        throw new Error(
            "La imagen debe ser JPG, PNG o WEBP."
        );

    }


    if(archivo.size > 5 * 1024 * 1024){

        throw new Error(
            "La imagen no puede superar los 5 MB."
        );

    }


    const datos =
        new FormData();


    datos.append(
        "imagen",
        archivo
    );


    const respuesta =
        await fetch(
            "/api/admin/upload",
            {
                method:"POST",
                credentials:"same-origin",
                body:datos
            }
        );


    if(respuesta.status === 401){

        window.location.href =
            "/login.html";

        return null;
    }


    if(!respuesta.ok){

        let mensaje =
            "No se pudo subir la imagen.";


        try{

            const error =
                await respuesta.json();

            mensaje =
                error.mensaje || mensaje;

        }catch{
        }


        throw new Error(mensaje);

    }


    const resultado =
        await respuesta.json();


    return resultado.url;
}



// ==========================================
// SERVICIOS
// ==========================================

const listaServicios =
    document.querySelector(
        "#lista-servicios-admin"
    );

const formServicio =
    document.querySelector(
        "#form-servicio"
    );

const inputId =
    document.querySelector(
        "#servicio-id"
    );

const inputNombre =
    document.querySelector(
        "#nombre-servicio"
    );

const inputDescripcion =
    document.querySelector(
        "#descripcion-servicio"
    );

const inputPrecio =
    document.querySelector(
        "#precio-servicio"
    );

const inputImagen =
    document.querySelector(
        "#imagen-servicio"
    );

const previewImagen =
    document.querySelector(
        "#preview-imagen"
    );

const tituloFormulario =
    document.querySelector(
        "#titulo-formulario"
    );

const btnGuardar =
    document.querySelector(
        "#btn-guardar"
    );

const btnCancelar =
    document.querySelector(
        "#btn-cancelar"
    );

const contadorServicios =
    document.querySelector(
        "#contador-servicios"
    );

const cantidadServicios =
    document.querySelector(
        "#cantidad-servicios"
    );


let imagenServicioActual =
    null;



// ==========================================
// PREVIEW SERVICIO
// ==========================================

inputImagen?.addEventListener(
    "change",
    () => {

        const archivo =
            inputImagen.files[0];


        if(!archivo){

            if(imagenServicioActual){

                previewImagen.src =
                    imagenServicioActual;

                previewImagen.hidden =
                    false;

            }else{

                previewImagen.hidden =
                    true;

            }

            return;
        }


        previewImagen.src =
            URL.createObjectURL(archivo);

        previewImagen.hidden =
            false;

    }
);



// ==========================================
// CARGAR SERVICIOS
// ==========================================

async function cargarServicios(){

    try{

        const respuesta =
            await fetch(
                "/api/servicios",
                {
                    cache:"no-store"
                }
            );


        const servicios =
            await respuesta.json();


        cantidadServicios.textContent =
            servicios.length;


        contadorServicios.textContent =
            `${servicios.length} servicio${
                servicios.length === 1
                    ? ""
                    : "s"
            }`;


        listaServicios.innerHTML =
            "";


        if(servicios.length === 0){

            listaServicios.innerHTML =
                `
                <p class="sin-servicios">
                    Todavía no hay servicios.
                </p>
                `;

            return;
        }


        servicios.forEach(servicio => {

            const item =
                document.createElement("article");

            item.className =
                "servicio-admin-item";


            const contenido =
                document.createElement("div");


            if(servicio.imagen){

                const imagen =
                    document.createElement("img");

                imagen.src =
                    servicio.imagen;

                imagen.alt =
                    servicio.nombre;

                imagen.className =
                    "imagen-servicio-admin";

                contenido.appendChild(
                    imagen
                );

            }


            const titulo =
                document.createElement("h4");

            titulo.textContent =
                servicio.nombre;


            const descripcion =
                document.createElement("p");

            descripcion.textContent =
                servicio.descripcion;


            contenido.appendChild(
                titulo
            );

            contenido.appendChild(
                descripcion
            );


            if(servicio.precio != null){

                const precio =
                    document.createElement("p");

                precio.className =
                    "precio-admin";

                precio.textContent =
                    `$ ${servicio.precio}`;

                contenido.appendChild(
                    precio
                );

            }


            const acciones =
                document.createElement("div");

            acciones.className =
                "acciones-servicio";


            const editar =
                document.createElement("button");

            editar.type =
                "button";

            editar.className =
                "btn-editar";

            editar.textContent =
                "Editar";

            editar.addEventListener(
                "click",
                () =>
                    editarServicio(servicio)
            );


            const eliminar =
                document.createElement("button");

            eliminar.type =
                "button";

            eliminar.className =
                "btn-eliminar";

            eliminar.textContent =
                "Eliminar";

            eliminar.addEventListener(
                "click",
                () =>
                    eliminarServicio(servicio.id)
            );


            acciones.appendChild(editar);

            acciones.appendChild(eliminar);


            item.appendChild(contenido);

            item.appendChild(acciones);


            listaServicios.appendChild(
                item
            );

        });


    }catch(error){

        console.error(error);

        listaServicios.innerHTML =
            "<p>No se pudieron cargar los servicios.</p>";

    }

}



// ==========================================
// GUARDAR SERVICIO
// ==========================================

formServicio?.addEventListener(
    "submit",
    async e => {

        e.preventDefault();


        try{

            const id =
                inputId.value;


            let rutaImagen =
                imagenServicioActual;


            if(inputImagen.files.length){

                rutaImagen =
                    await subirImagen(
                        inputImagen
                    );

            }


            const datos = {

                nombre:
                    inputNombre.value.trim(),

                descripcion:
                    inputDescripcion.value.trim(),

                precio:
                    inputPrecio.value
                        ? Number(inputPrecio.value)
                        : null,

                imagen:
                    rutaImagen,

                activo:true

            };


            const editando =
                id !== "";


            const respuesta =
                await fetch(
                    editando
                        ? `/api/servicios/${id}`
                        : "/api/servicios",
                    {

                        method:
                            editando
                                ? "PUT"
                                : "POST",

                        headers:{
                            "Content-Type":
                                "application/json"
                        },

                        credentials:
                            "same-origin",

                        body:
                            JSON.stringify(datos)

                    }
                );


            if(respuesta.status === 401){

                window.location.href =
                    "/login.html";

                return;
            }


            if(!respuesta.ok){

                alert(
                    "No se pudo guardar el servicio."
                );

                return;
            }


            limpiarServicio();

            await cargarServicios();


        }catch(error){

            console.error(error);

            alert(error.message);

        }

    }
);



// ==========================================
// EDITAR SERVICIO
// ==========================================

function editarServicio(servicio){

    inputId.value =
        servicio.id;

    inputNombre.value =
        servicio.nombre;

    inputDescripcion.value =
        servicio.descripcion;

    inputPrecio.value =
        servicio.precio ?? "";


    imagenServicioActual =
        servicio.imagen ?? null;


    inputImagen.value =
        "";


    if(imagenServicioActual){

        previewImagen.src =
            imagenServicioActual;

        previewImagen.hidden =
            false;

    }else{

        previewImagen.hidden =
            true;

    }


    tituloFormulario.textContent =
        "Editar servicio";

    btnGuardar.textContent =
        "Guardar cambios";

    btnCancelar.hidden =
        false;

}



// ==========================================
// LIMPIAR SERVICIO
// ==========================================

function limpiarServicio(){

    formServicio.reset();

    inputId.value =
        "";

    imagenServicioActual =
        null;

    previewImagen.src =
        "";

    previewImagen.hidden =
        true;

    tituloFormulario.textContent =
        "Agregar servicio";

    btnGuardar.textContent =
        "Agregar servicio";

    btnCancelar.hidden =
        true;

}


btnCancelar?.addEventListener(
    "click",
    limpiarServicio
);



// ==========================================
// ELIMINAR SERVICIO
// ==========================================

async function eliminarServicio(id){

    if(
        !confirm(
            "¿Seguro que querés eliminar este servicio?"
        )
    ){
        return;
    }


    const respuesta =
        await fetch(
            `/api/servicios/${id}`,
            {
                method:"DELETE",
                credentials:"same-origin"
            }
        );


    if(respuesta.status === 401){

        window.location.href =
            "/login.html";

        return;
    }


    await cargarServicios();

}



// ==========================================
// GALERÍA
// ==========================================

const formGaleria =
    document.querySelector(
        "#form-galeria"
    );

const galeriaId =
    document.querySelector(
        "#galeria-id"
    );

const tituloGaleria =
    document.querySelector(
        "#titulo-galeria"
    );

const inputGaleria =
    document.querySelector(
        "#imagen-galeria"
    );

const previewGaleria =
    document.querySelector(
        "#preview-galeria"
    );

const listaGaleriaAdmin =
    document.querySelector(
        "#lista-galeria-admin"
    );

const tituloFormGaleria =
    document.querySelector(
        "#titulo-form-galeria"
    );

const btnGuardarGaleria =
    document.querySelector(
        "#btn-guardar-galeria"
    );

const btnCancelarGaleria =
    document.querySelector(
        "#btn-cancelar-galeria"
    );

const contadorGaleria =
    document.querySelector(
        "#contador-galeria"
    );

const cantidadGaleria =
    document.querySelector(
        "#cantidad-galeria"
    );


let imagenGaleriaActual =
    null;



// ==========================================
// PREVIEW GALERÍA
// ==========================================

inputGaleria?.addEventListener(
    "change",
    () => {

        const archivo =
            inputGaleria.files[0];


        if(!archivo){

            if(imagenGaleriaActual){

                previewGaleria.src =
                    imagenGaleriaActual;

                previewGaleria.hidden =
                    false;

            }else{

                previewGaleria.hidden =
                    true;

            }

            return;
        }


        previewGaleria.src =
            URL.createObjectURL(archivo);

        previewGaleria.hidden =
            false;

    }
);



// ==========================================
// CARGAR GALERÍA ADMIN
// ==========================================

async function cargarGaleriaAdmin(){

    try{

        const respuesta =
            await fetch(
                "/api/galeria",
                {
                    cache:"no-store"
                }
            );


        const imagenes =
            await respuesta.json();


        cantidadGaleria.textContent =
            imagenes.length;


        contadorGaleria.textContent =
            `${imagenes.length} imagen${
                imagenes.length === 1
                    ? ""
                    : "es"
            }`;


        listaGaleriaAdmin.innerHTML =
            "";


        if(imagenes.length === 0){

            listaGaleriaAdmin.innerHTML =
                "<p>No hay imágenes todavía.</p>";

            return;
        }


        imagenes.forEach(imagen => {

            const item =
                document.createElement("div");

            item.className =
                "servicio-admin-item";


            const contenido =
                document.createElement("div");


            const foto =
                document.createElement("img");

            foto.src =
                imagen.imagen;

            foto.alt =
                imagen.titulo ||
                "Cora Confecciones";

            foto.className =
                "imagen-servicio-admin";


            const titulo =
                document.createElement("h4");

            titulo.textContent =
                imagen.titulo ||
                "Sin título";


            contenido.appendChild(foto);

            contenido.appendChild(titulo);


            const acciones =
                document.createElement("div");

            acciones.className =
                "acciones-servicio";


            const editar =
                document.createElement("button");

            editar.type =
                "button";

            editar.className =
                "btn-editar";

            editar.textContent =
                "Editar";

            editar.addEventListener(
                "click",
                () =>
                    editarGaleria(imagen)
            );


            const eliminar =
                document.createElement("button");

            eliminar.type =
                "button";

            eliminar.className =
                "btn-eliminar";

            eliminar.textContent =
                "Eliminar";

            eliminar.addEventListener(
                "click",
                () =>
                    eliminarGaleria(imagen.id)
            );


            acciones.appendChild(editar);

            acciones.appendChild(eliminar);


            item.appendChild(contenido);

            item.appendChild(acciones);


            listaGaleriaAdmin.appendChild(
                item
            );

        });


    }catch(error){

        console.error(error);

    }

}



// ==========================================
// GUARDAR GALERÍA
// ==========================================

formGaleria?.addEventListener(
    "submit",
    async e => {

        e.preventDefault();


        try{

            const id =
                galeriaId.value;


            let rutaImagen =
                imagenGaleriaActual;


            if(inputGaleria.files.length){

                rutaImagen =
                    await subirImagen(
                        inputGaleria
                    );

            }


            if(!rutaImagen){

                alert(
                    "Seleccioná una imagen."
                );

                return;
            }


            const datos = {

                titulo:
                    tituloGaleria.value.trim(),

                imagen:
                    rutaImagen,

                activo:true

            };


            const editando =
                id !== "";


            const respuesta =
                await fetch(
                    editando
                        ? `/api/galeria/${id}`
                        : "/api/galeria",
                    {

                        method:
                            editando
                                ? "PUT"
                                : "POST",

                        headers:{
                            "Content-Type":
                                "application/json"
                        },

                        credentials:
                            "same-origin",

                        body:
                            JSON.stringify(datos)

                    }
                );


            if(!respuesta.ok){

                alert(
                    "No se pudo guardar la imagen."
                );

                return;
            }


            limpiarGaleria();

            await cargarGaleriaAdmin();


        }catch(error){

            console.error(error);

            alert(error.message);

        }

    }
);



// ==========================================
// EDITAR GALERÍA
// ==========================================

function editarGaleria(imagen){

    galeriaId.value =
        imagen.id;

    tituloGaleria.value =
        imagen.titulo ?? "";

    imagenGaleriaActual =
        imagen.imagen;


    inputGaleria.value =
        "";


    previewGaleria.src =
        imagen.imagen;

    previewGaleria.hidden =
        false;


    tituloFormGaleria.textContent =
        "Editar imagen";


    btnGuardarGaleria.textContent =
        "Guardar cambios";


    btnCancelarGaleria.hidden =
        false;

}



// ==========================================
// LIMPIAR GALERÍA
// ==========================================

function limpiarGaleria(){

    formGaleria.reset();

    galeriaId.value =
        "";

    imagenGaleriaActual =
        null;

    previewGaleria.src =
        "";

    previewGaleria.hidden =
        true;

    tituloFormGaleria.textContent =
        "Agregar imagen";

    btnGuardarGaleria.textContent =
        "Agregar imagen";

    btnCancelarGaleria.hidden =
        true;

}


btnCancelarGaleria?.addEventListener(
    "click",
    limpiarGaleria
);



// ==========================================
// ELIMINAR GALERÍA
// ==========================================

async function eliminarGaleria(id){

    if(
        !confirm(
            "¿Seguro que querés eliminar esta imagen?"
        )
    ){
        return;
    }


    await fetch(
        `/api/galeria/${id}`,
        {
            method:"DELETE",
            credentials:"same-origin"
        }
    );


    await cargarGaleriaAdmin();

}



// ==========================================
// PREGUNTAS
// ==========================================

const formPregunta =
    document.querySelector(
        "#form-pregunta"
    );

const preguntaId =
    document.querySelector(
        "#pregunta-id"
    );

const preguntaTexto =
    document.querySelector(
        "#pregunta-texto"
    );

const respuestaTexto =
    document.querySelector(
        "#respuesta-texto"
    );

const listaPreguntasAdmin =
    document.querySelector(
        "#lista-preguntas-admin"
    );

const tituloFormPregunta =
    document.querySelector(
        "#titulo-form-pregunta"
    );

const btnGuardarPregunta =
    document.querySelector(
        "#btn-guardar-pregunta"
    );

const btnCancelarPregunta =
    document.querySelector(
        "#btn-cancelar-pregunta"
    );

const contadorPreguntas =
    document.querySelector(
        "#contador-preguntas"
    );

const cantidadPreguntas =
    document.querySelector(
        "#cantidad-preguntas"
    );



// ==========================================
// CARGAR PREGUNTAS
// ==========================================

async function cargarPreguntasAdmin(){

    try{

        const respuesta =
            await fetch(
                "/api/preguntas",
                {
                    cache:"no-store"
                }
            );


        const preguntas =
            await respuesta.json();


        cantidadPreguntas.textContent =
            preguntas.length;


        contadorPreguntas.textContent =
            `${preguntas.length} pregunta${
                preguntas.length === 1
                    ? ""
                    : "s"
            }`;


        listaPreguntasAdmin.innerHTML =
            "";


        if(preguntas.length === 0){

            listaPreguntasAdmin.innerHTML =
                "<p>No hay preguntas todavía.</p>";

            return;
        }


        preguntas.forEach(pregunta => {

            const item =
                document.createElement("div");

            item.className =
                "servicio-admin-item";


            const contenido =
                document.createElement("div");


            const titulo =
                document.createElement("h4");

            titulo.textContent =
                pregunta.pregunta;


            const respuesta =
                document.createElement("p");

            respuesta.textContent =
                pregunta.respuesta;


            contenido.appendChild(titulo);

            contenido.appendChild(respuesta);


            const acciones =
                document.createElement("div");

            acciones.className =
                "acciones-servicio";


            const editar =
                document.createElement("button");

            editar.type =
                "button";

            editar.className =
                "btn-editar";

            editar.textContent =
                "Editar";

            editar.addEventListener(
                "click",
                () =>
                    editarPregunta(pregunta)
            );


            const eliminar =
                document.createElement("button");

            eliminar.type =
                "button";

            eliminar.className =
                "btn-eliminar";

            eliminar.textContent =
                "Eliminar";

            eliminar.addEventListener(
                "click",
                () =>
                    eliminarPregunta(pregunta.id)
            );


            acciones.appendChild(editar);

            acciones.appendChild(eliminar);


            item.appendChild(contenido);

            item.appendChild(acciones);


            listaPreguntasAdmin.appendChild(
                item
            );

        });


    }catch(error){

        console.error(error);

    }

}



// ==========================================
// GUARDAR PREGUNTA
// ==========================================

formPregunta?.addEventListener(
    "submit",
    async e => {

        e.preventDefault();


        const id =
            preguntaId.value;


        const datos = {

            pregunta:
                preguntaTexto.value.trim(),

            respuesta:
                respuestaTexto.value.trim(),

            activo:true

        };


        const editando =
            id !== "";


        const respuesta =
            await fetch(
                editando
                    ? `/api/preguntas/${id}`
                    : "/api/preguntas",
                {

                    method:
                        editando
                            ? "PUT"
                            : "POST",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    credentials:
                        "same-origin",

                    body:
                        JSON.stringify(datos)

                }
            );


        if(!respuesta.ok){

            alert(
                "No se pudo guardar la pregunta."
            );

            return;
        }


        limpiarPregunta();

        await cargarPreguntasAdmin();

    }
);



// ==========================================
// EDITAR PREGUNTA
// ==========================================

function editarPregunta(pregunta){

    preguntaId.value =
        pregunta.id;

    preguntaTexto.value =
        pregunta.pregunta;

    respuestaTexto.value =
        pregunta.respuesta;


    tituloFormPregunta.textContent =
        "Editar pregunta";


    btnGuardarPregunta.textContent =
        "Guardar cambios";


    btnCancelarPregunta.hidden =
        false;

}



// ==========================================
// LIMPIAR PREGUNTA
// ==========================================

function limpiarPregunta(){

    formPregunta.reset();

    preguntaId.value =
        "";

    tituloFormPregunta.textContent =
        "Agregar pregunta";

    btnGuardarPregunta.textContent =
        "Agregar pregunta";

    btnCancelarPregunta.hidden =
        true;

}


btnCancelarPregunta?.addEventListener(
    "click",
    limpiarPregunta
);



// ==========================================
// ELIMINAR PREGUNTA
// ==========================================

async function eliminarPregunta(id){

    if(
        !confirm(
            "¿Seguro que querés eliminar esta pregunta?"
        )
    ){
        return;
    }


    await fetch(
        `/api/preguntas/${id}`,
        {
            method:"DELETE",
            credentials:"same-origin"
        }
    );


    await cargarPreguntasAdmin();

}



// ==========================================
// LOGOUT
// ==========================================

document
    .querySelector("#btn-logout")
    ?.addEventListener(
        "click",
        async () => {

            await fetch(
                "/api/admin/logout",
                {
                    method:"POST",
                    credentials:"same-origin"
                }
            );


            window.location.href =
                "/login.html";

        }
    );



// ==========================================
// INICIO
// ==========================================

cargarServicios();

cargarGaleriaAdmin();

cargarPreguntasAdmin();