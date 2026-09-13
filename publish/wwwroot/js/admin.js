// ==========================================
// NAVEGACIÓN
// ==========================================

const enlacesMenu =
    document.querySelectorAll(".admin-link");

const secciones =
    document.querySelectorAll(".admin-seccion");


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
// SUBIR IMAGEN
// ==========================================

async function subirImagen(input){

    const archivo =
        input.files[0];

    if(!archivo){
        return null;
    }

    const permitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if(!permitidos.includes(archivo.type)){

        throw new Error(
            "La imagen debe ser JPG, PNG o WEBP."
        );
    }

    if(archivo.size > 5 * 1024 * 1024){

        throw new Error(
            "La imagen no puede superar los 5 MB."
        );
    }

    const formData =
        new FormData();

    formData.append(
        "imagen",
        archivo
    );

    const respuesta =
        await fetch(
            "/api/admin/upload",
            {
                method:"POST",
                credentials:"same-origin",
                body:formData
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

        }catch{}

        throw new Error(mensaje);
    }

    const datos =
        await respuesta.json();

    return datos.url;
}


// ==========================================
// SERVICIOS
// ==========================================

const formServicio =
    document.querySelector("#form-servicio");

const inputServicioId =
    document.querySelector("#servicio-id");

const inputNombre =
    document.querySelector("#nombre-servicio");

const inputDescripcion =
    document.querySelector("#descripcion-servicio");

const inputPrecio =
    document.querySelector("#precio-servicio");

const inputImagenServicio =
    document.querySelector("#imagen-servicio");

const previewServicio =
    document.querySelector("#preview-imagen");

const listaServicios =
    document.querySelector("#lista-servicios-admin");

const tituloFormularioServicio =
    document.querySelector("#titulo-formulario");

const btnGuardarServicio =
    document.querySelector("#btn-guardar");

const btnCancelarServicio =
    document.querySelector("#btn-cancelar");

const cantidadServicios =
    document.querySelector("#cantidad-servicios");

const contadorServicios =
    document.querySelector("#contador-servicios");


let imagenServicioActual = null;


// PREVIEW

inputImagenServicio?.addEventListener(
    "change",
    () => {

        const archivo =
            inputImagenServicio.files[0];

        if(!archivo){
            return;
        }

        previewServicio.src =
            URL.createObjectURL(archivo);

        previewServicio.hidden =
            false;

    }
);


// CARGAR

async function cargarServicios(){

    if(!listaServicios){
        return;
    }

    try{

        const respuesta =
            await fetch("/api/servicios",{
                cache:"no-store"
            });

        if(!respuesta.ok){
            throw new Error();
        }

        const servicios =
            await respuesta.json();

        if(cantidadServicios){
            cantidadServicios.textContent =
                servicios.length;
        }

        if(contadorServicios){

            contadorServicios.textContent =
                `${servicios.length} servicio${
                    servicios.length === 1
                        ? ""
                        : "s"
                }`;
        }

        listaServicios.innerHTML = "";

        if(servicios.length === 0){

            listaServicios.innerHTML =
                "<p>No hay servicios todavía.</p>";

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

                const img =
                    document.createElement("img");

                img.src =
                    servicio.imagen;

                img.alt =
                    servicio.nombre;

                img.className =
                    "imagen-servicio-admin";

                contenido.appendChild(img);
            }


            const titulo =
                document.createElement("h4");

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
                    document.createElement("p");

                precio.className =
                    "precio-admin";

                precio.textContent =
                    `$ ${servicio.precio}`;

                contenido.appendChild(precio);
            }


            const acciones =
                document.createElement("div");

            acciones.className =
                "acciones-servicio";


            const editar =
                document.createElement("button");

            editar.type = "button";
            editar.className = "btn-editar";
            editar.textContent = "Editar";

            editar.addEventListener(
                "click",
                () => editarServicio(servicio)
            );


            const eliminar =
                document.createElement("button");

            eliminar.type = "button";
            eliminar.className = "btn-eliminar";
            eliminar.textContent = "Eliminar";

            eliminar.addEventListener(
                "click",
                () => eliminarServicio(servicio.id)
            );


            acciones.appendChild(editar);
            acciones.appendChild(eliminar);

            item.appendChild(contenido);
            item.appendChild(acciones);

            listaServicios.appendChild(item);

        });

    }catch(error){

        console.error(error);

        listaServicios.innerHTML =
            "<p>No se pudieron cargar los servicios.</p>";
    }
}


// GUARDAR

formServicio?.addEventListener(
    "submit",
    async e => {

        e.preventDefault();

        try{

            const id =
                inputServicioId.value;

            let imagen =
                imagenServicioActual;

            if(inputImagenServicio.files.length){

                imagen =
                    await subirImagen(
                        inputImagenServicio
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

                imagen,

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


function editarServicio(servicio){

    inputServicioId.value =
        servicio.id;

    inputNombre.value =
        servicio.nombre;

    inputDescripcion.value =
        servicio.descripcion;

    inputPrecio.value =
        servicio.precio ?? "";

    imagenServicioActual =
        servicio.imagen ?? null;

    inputImagenServicio.value = "";

    if(imagenServicioActual){

        previewServicio.src =
            imagenServicioActual;

        previewServicio.hidden =
            false;

    }else{

        previewServicio.hidden =
            true;
    }

    tituloFormularioServicio.textContent =
        "Editar servicio";

    btnGuardarServicio.textContent =
        "Guardar cambios";

    btnCancelarServicio.hidden =
        false;
}


function limpiarServicio(){

    formServicio.reset();

    inputServicioId.value = "";

    imagenServicioActual = null;

    previewServicio.src = "";

    previewServicio.hidden = true;

    tituloFormularioServicio.textContent =
        "Agregar servicio";

    btnGuardarServicio.textContent =
        "Agregar servicio";

    btnCancelarServicio.hidden =
        true;
}


btnCancelarServicio?.addEventListener(
    "click",
    limpiarServicio
);


async function eliminarServicio(id){

    if(
        !confirm(
            "¿Seguro que querés eliminar este servicio?"
        )
    ){
        return;
    }

    await fetch(
        `/api/servicios/${id}`,
        {
            method:"DELETE",
            credentials:"same-origin"
        }
    );

    await cargarServicios();
}


// ==========================================
// GALERÍA
// ==========================================

const formGaleria =
    document.querySelector("#form-galeria");

const galeriaId =
    document.querySelector("#galeria-id");

const tituloGaleria =
    document.querySelector("#titulo-galeria");

const imagenGaleria =
    document.querySelector("#imagen-galeria");

const previewGaleria =
    document.querySelector("#preview-galeria");

const listaGaleria =
    document.querySelector("#lista-galeria-admin");

const tituloFormGaleria =
    document.querySelector("#titulo-form-galeria");

const btnGuardarGaleria =
    document.querySelector("#btn-guardar-galeria");

const btnCancelarGaleria =
    document.querySelector("#btn-cancelar-galeria");

const cantidadGaleria =
    document.querySelector("#cantidad-galeria");

const contadorGaleria =
    document.querySelector("#contador-galeria");


let imagenGaleriaActual = null;


imagenGaleria?.addEventListener(
    "change",
    () => {

        const archivo =
            imagenGaleria.files[0];

        if(!archivo){
            return;
        }

        previewGaleria.src =
            URL.createObjectURL(archivo);

        previewGaleria.hidden =
            false;
    }
);


async function cargarGaleriaAdmin(){

    if(!listaGaleria){
        return;
    }

    try{

        const respuesta =
            await fetch("/api/galeria",{
                cache:"no-store"
            });

        if(!respuesta.ok){
            throw new Error();
        }

        const imagenes =
            await respuesta.json();

        if(cantidadGaleria){
            cantidadGaleria.textContent =
                imagenes.length;
        }

        if(contadorGaleria){

            contadorGaleria.textContent =
                `${imagenes.length} imagen${
                    imagenes.length === 1
                        ? ""
                        : "es"
                }`;
        }

        listaGaleria.innerHTML = "";

        if(imagenes.length === 0){

            listaGaleria.innerHTML =
                "<p>No hay imágenes todavía.</p>";

            return;
        }

        imagenes.forEach(imagen => {

            const item =
                document.createElement("article");

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

            editar.type = "button";
            editar.className = "btn-editar";
            editar.textContent = "Editar";

            editar.addEventListener(
                "click",
                () => editarImagenGaleria(imagen)
            );


            const eliminar =
                document.createElement("button");

            eliminar.type = "button";
            eliminar.className = "btn-eliminar";
            eliminar.textContent = "Eliminar";

            eliminar.addEventListener(
                "click",
                () => eliminarImagenGaleria(imagen.id)
            );


            acciones.appendChild(editar);
            acciones.appendChild(eliminar);

            item.appendChild(contenido);
            item.appendChild(acciones);

            listaGaleria.appendChild(item);

        });

    }catch(error){

        console.error(error);

        listaGaleria.innerHTML =
            "<p>No se pudo cargar la galería.</p>";
    }
}


formGaleria?.addEventListener(
    "submit",
    async e => {

        e.preventDefault();

        try{

            const id =
                galeriaId.value;

            let rutaImagen =
                imagenGaleriaActual;

            if(imagenGaleria.files.length){

                rutaImagen =
                    await subirImagen(
                        imagenGaleria
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

            if(respuesta.status === 401){

                window.location.href =
                    "/login.html";

                return;
            }

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


function editarImagenGaleria(imagen){

    galeriaId.value =
        imagen.id;

    tituloGaleria.value =
        imagen.titulo ?? "";

    imagenGaleriaActual =
        imagen.imagen;

    imagenGaleria.value = "";

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


function limpiarGaleria(){

    formGaleria.reset();

    galeriaId.value = "";

    imagenGaleriaActual = null;

    previewGaleria.src = "";

    previewGaleria.hidden = true;

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


async function eliminarImagenGaleria(id){

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
    document.querySelector("#form-pregunta");

const preguntaId =
    document.querySelector("#pregunta-id");

const preguntaTexto =
    document.querySelector("#pregunta-texto");

const respuestaTexto =
    document.querySelector("#respuesta-texto");

const listaPreguntas =
    document.querySelector("#lista-preguntas-admin");

const tituloFormPregunta =
    document.querySelector("#titulo-form-pregunta");

const btnGuardarPregunta =
    document.querySelector("#btn-guardar-pregunta");

const btnCancelarPregunta =
    document.querySelector("#btn-cancelar-pregunta");

const cantidadPreguntas =
    document.querySelector("#cantidad-preguntas");

const contadorPreguntas =
    document.querySelector("#contador-preguntas");


async function cargarPreguntasAdmin(){

    if(!listaPreguntas){
        return;
    }

    try{

        const respuesta =
            await fetch("/api/preguntas",{
                cache:"no-store"
            });

        if(!respuesta.ok){
            throw new Error();
        }

        const preguntas =
            await respuesta.json();

        if(cantidadPreguntas){
            cantidadPreguntas.textContent =
                preguntas.length;
        }

        if(contadorPreguntas){

            contadorPreguntas.textContent =
                `${preguntas.length} pregunta${
                    preguntas.length === 1
                        ? ""
                        : "s"
                }`;
        }

        listaPreguntas.innerHTML = "";

        if(preguntas.length === 0){

            listaPreguntas.innerHTML =
                "<p>No hay preguntas todavía.</p>";

            return;
        }

        preguntas.forEach(pregunta => {

            const item =
                document.createElement("article");

            item.className =
                "servicio-admin-item";


            const contenido =
                document.createElement("div");


            const titulo =
                document.createElement("h4");

            titulo.textContent =
                pregunta.pregunta;


            const texto =
                document.createElement("p");

            texto.textContent =
                pregunta.respuesta;


            contenido.appendChild(titulo);
            contenido.appendChild(texto);


            const acciones =
                document.createElement("div");

            acciones.className =
                "acciones-servicio";


            const editar =
                document.createElement("button");

            editar.type = "button";
            editar.className = "btn-editar";
            editar.textContent = "Editar";

            editar.addEventListener(
                "click",
                () => editarPregunta(pregunta)
            );


            const eliminar =
                document.createElement("button");

            eliminar.type = "button";
            eliminar.className = "btn-eliminar";
            eliminar.textContent = "Eliminar";

            eliminar.addEventListener(
                "click",
                () => eliminarPregunta(pregunta.id)
            );


            acciones.appendChild(editar);
            acciones.appendChild(eliminar);

            item.appendChild(contenido);
            item.appendChild(acciones);

            listaPreguntas.appendChild(item);

        });

    }catch(error){

        console.error(error);

        listaPreguntas.innerHTML =
            "<p>No se pudieron cargar las preguntas.</p>";
    }
}


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

        if(respuesta.status === 401){

            window.location.href =
                "/login.html";

            return;
        }

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


function limpiarPregunta(){

    formPregunta.reset();

    preguntaId.value = "";

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
// INICIAR PANEL
// ==========================================

cargarServicios();
cargarGaleriaAdmin();
cargarPreguntasAdmin();