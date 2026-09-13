// ==========================================
// ELEMENTOS DEL PANEL
// ==========================================

const enlacesMenu =
    document.querySelectorAll(".admin-link");

const secciones =
    document.querySelectorAll(".admin-seccion");

const listaServicios =
    document.querySelector("#lista-servicios-admin");

const formServicio =
    document.querySelector("#form-servicio");

const inputId =
    document.querySelector("#servicio-id");

const inputNombre =
    document.querySelector("#nombre-servicio");

const inputDescripcion =
    document.querySelector("#descripcion-servicio");

const inputPrecio =
    document.querySelector("#precio-servicio");

const inputImagen =
    document.querySelector("#imagen-servicio");

const previewImagen =
    document.querySelector("#preview-imagen");

const tituloFormulario =
    document.querySelector("#titulo-formulario");

const btnGuardar =
    document.querySelector("#btn-guardar");

const btnCancelar =
    document.querySelector("#btn-cancelar");

const contador =
    document.querySelector("#contador-servicios");

const cantidadInicio =
    document.querySelector("#cantidad-servicios");


// Guarda la imagen que ya tenía el servicio
// cuando estamos editando.

let imagenActual = null;


// ==========================================
// CAMBIO DE SECCIÓN
// ==========================================

enlacesMenu.forEach(boton => {

    boton.addEventListener("click", () => {

        enlacesMenu.forEach(item =>
            item.classList.remove("activo")
        );

        boton.classList.add("activo");

        const nombre =
            boton.dataset.seccion;

        secciones.forEach(seccion =>
            seccion.classList.remove("activa")
        );

        document
            .querySelector(`#seccion-${nombre}`)
            ?.classList.add("activa");

    });

});


// ==========================================
// CARGAR SERVICIOS
// ==========================================

async function cargarServicios() {

    if (!listaServicios) {
        return;
    }

    try {

        const respuesta =
            await fetch("/api/servicios", {
                cache: "no-store"
            });

        if (respuesta.status === 401) {

            window.location.href =
                "/login.html";

            return;
        }

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los servicios."
            );

        }

        const servicios =
            await respuesta.json();


        if (contador) {

            contador.textContent =
                `${servicios.length} servicio${
                    servicios.length === 1
                        ? ""
                        : "s"
                }`;

        }


        if (cantidadInicio) {

            cantidadInicio.textContent =
                servicios.length;

        }


        mostrarServicios(servicios);

    } catch (error) {

        console.error(error);

        listaServicios.innerHTML = `
            <p class="sin-servicios">
                No se pudieron cargar los servicios.
            </p>
        `;

    }

}


// ==========================================
// MOSTRAR SERVICIOS
// ==========================================

function mostrarServicios(servicios) {

    listaServicios.innerHTML = "";


    if (servicios.length === 0) {

        listaServicios.innerHTML = `
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


        // ==================================
        // CONTENIDO
        // ==================================

        const contenido =
            document.createElement("div");


        // Imagen

        if (servicio.imagen) {

            const imagen =
                document.createElement("img");

            imagen.src =
                servicio.imagen;

            imagen.alt =
                servicio.nombre;

            imagen.className =
                "imagen-servicio-admin";

            contenido.appendChild(imagen);

        }


        // Nombre

        const titulo =
            document.createElement("h4");

        titulo.textContent =
            servicio.nombre;


        // Descripción

        const descripcion =
            document.createElement("p");

        descripcion.textContent =
            servicio.descripcion;


        contenido.appendChild(titulo);

        contenido.appendChild(descripcion);


        // Precio

        if (
            servicio.precio !== null &&
            servicio.precio !== undefined
        ) {

            const precio =
                document.createElement("p");

            precio.className =
                "precio-admin";

            precio.textContent =
                `$ ${servicio.precio}`;

            contenido.appendChild(precio);

        }


        // ==================================
        // BOTONES
        // ==================================

        const acciones =
            document.createElement("div");

        acciones.className =
            "acciones-servicio";


        // Editar

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
            () => editarServicio(servicio)
        );


        // Eliminar

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
            () => eliminarServicio(servicio.id)
        );


        acciones.appendChild(editar);

        acciones.appendChild(eliminar);


        item.appendChild(contenido);

        item.appendChild(acciones);


        listaServicios.appendChild(item);

    });

}


// ==========================================
// SUBIR IMAGEN
// ==========================================

async function subirImagen() {

    const archivo =
        inputImagen.files[0];


    if (!archivo) {

        return imagenActual;

    }


    // Validar tipo

    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!tiposPermitidos.includes(archivo.type)) {

        throw new Error(
            "La imagen debe ser JPG, PNG o WEBP."
        );

    }


    // Máximo 5 MB

    const maximo =
        5 * 1024 * 1024;


    if (archivo.size > maximo) {

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

                method: "POST",

                credentials: "same-origin",

                body: formData

            }
        );


    if (respuesta.status === 401) {

        window.location.href =
            "/login.html";

        return null;

    }


    if (!respuesta.ok) {

        let mensaje =
            "No se pudo subir la imagen.";


        try {

            const error =
                await respuesta.json();

            mensaje =
                error.mensaje || mensaje;

        } catch {

            // Dejamos mensaje genérico.

        }


        throw new Error(mensaje);

    }


    const datos =
        await respuesta.json();


    return datos.url;

}


// ==========================================
// AGREGAR / EDITAR SERVICIO
// ==========================================

formServicio.addEventListener(
    "submit",
    async e => {

        e.preventDefault();


        const id =
            inputId.value;


        // Desactivar botón mientras guarda

        btnGuardar.disabled =
            true;

        const textoAnterior =
            btnGuardar.textContent;

        btnGuardar.textContent =
            "Guardando...";


        try {

            // ==================================
            // SUBIR IMAGEN
            // ==================================

            let rutaImagen =
                imagenActual;


            if (
                inputImagen &&
                inputImagen.files.length > 0
            ) {

                rutaImagen =
                    await subirImagen();

            }


            // ==================================
            // DATOS DEL SERVICIO
            // ==================================

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

                activo:
                    true

            };


            // Validar campos

            if (!datos.nombre) {

                alert(
                    "Ingresá el nombre del servicio."
                );

                return;

            }


            if (!datos.descripcion) {

                alert(
                    "Ingresá una descripción."
                );

                return;

            }


            // ==================================
            // SABER SI ES NUEVO O EDICIÓN
            // ==================================

            const editando =
                id !== "";


            const url =
                editando
                    ? `/api/servicios/${id}`
                    : "/api/servicios";


            const metodo =
                editando
                    ? "PUT"
                    : "POST";


            // ==================================
            // GUARDAR
            // ==================================

            const respuesta =
                await fetch(
                    url,
                    {

                        method:
                            metodo,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials:
                            "same-origin",

                        body:
                            JSON.stringify(datos)

                    }
                );


            if (respuesta.status === 401) {

                window.location.href =
                    "/login.html";

                return;

            }


            if (!respuesta.ok) {

                let mensaje =
                    "No se pudo guardar el servicio.";


                try {

                    const error =
                        await respuesta.json();

                    mensaje =
                        error.mensaje || mensaje;

                } catch {

                    // Usamos mensaje general.

                }


                alert(mensaje);

                return;

            }


            // ==================================
            // CORRECTO
            // ==================================

            limpiarFormulario();

            await cargarServicios();


            if (editando) {

                alert(
                    "Servicio actualizado correctamente."
                );

            } else {

                alert(
                    "Servicio agregado correctamente."
                );

            }


        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Error al conectar con el servidor."
            );

        } finally {

            btnGuardar.disabled =
                false;

            if (inputId.value === "") {

                btnGuardar.textContent =
                    "Agregar servicio";

            } else {

                btnGuardar.textContent =
                    textoAnterior;

            }

        }

    }
);


// ==========================================
// EDITAR SERVICIO
// ==========================================

function editarServicio(servicio) {

    inputId.value =
        servicio.id;


    inputNombre.value =
        servicio.nombre;


    inputDescripcion.value =
        servicio.descripcion;


    inputPrecio.value =
        servicio.precio ?? "";


    // Guardamos la imagen existente.

    imagenActual =
        servicio.imagen ?? null;


    // NO intentamos hacer:
    //
    // inputImagen.value = servicio.imagen
    //
    // porque un input type="file"
    // no permite eso.


    if (inputImagen) {

        inputImagen.value =
            "";

    }


    // Mostrar imagen actual.

    if (
        imagenActual &&
        previewImagen
    ) {

        previewImagen.src =
            imagenActual;

        previewImagen.hidden =
            false;

    } else if (previewImagen) {

        previewImagen.src =
            "";

        previewImagen.hidden =
            true;

    }


    tituloFormulario.textContent =
        "Editar servicio";


    btnGuardar.textContent =
        "Guardar cambios";


    btnCancelar.hidden =
        false;


    // Mostrar sección Servicios.

    secciones.forEach(seccion =>
        seccion.classList.remove("activa")
    );


    document
        .querySelector("#seccion-servicios")
        ?.classList.add("activa");


    enlacesMenu.forEach(item =>
        item.classList.remove("activo")
    );


    document
        .querySelector(
            '[data-seccion="servicios"]'
        )
        ?.classList.add("activo");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// CANCELAR EDICIÓN
// ==========================================

btnCancelar.addEventListener(
    "click",
    limpiarFormulario
);


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function limpiarFormulario() {

    formServicio.reset();


    inputId.value =
        "";


    imagenActual =
        null;


    if (previewImagen) {

        previewImagen.src =
            "";

        previewImagen.hidden =
            true;

    }


    tituloFormulario.textContent =
        "Agregar servicio";


    btnGuardar.textContent =
        "Agregar servicio";


    btnCancelar.hidden =
        true;

}


// ==========================================
// VISTA PREVIA DE IMAGEN
// ==========================================

if (
    inputImagen &&
    previewImagen
) {

    inputImagen.addEventListener(
        "change",
        () => {

            const archivo =
                inputImagen.files[0];


            if (!archivo) {

                if (imagenActual) {

                    previewImagen.src =
                        imagenActual;

                    previewImagen.hidden =
                        false;

                } else {

                    previewImagen.src =
                        "";

                    previewImagen.hidden =
                        true;

                }

                return;

            }


            // Validar tipo

            const tiposPermitidos = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];


            if (
                !tiposPermitidos.includes(
                    archivo.type
                )
            ) {

                alert(
                    "Seleccioná una imagen JPG, PNG o WEBP."
                );

                inputImagen.value =
                    "";

                return;

            }


            // Mostrar preview

            const urlTemporal =
                URL.createObjectURL(archivo);


            previewImagen.src =
                urlTemporal;


            previewImagen.hidden =
                false;

        }
    );

}


// ==========================================
// ELIMINAR SERVICIO
// ==========================================

async function eliminarServicio(id) {

    const confirmar =
        confirm(
            "¿Seguro que querés eliminar este servicio?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `/api/servicios/${id}`,
                {

                    method:
                        "DELETE",

                    credentials:
                        "same-origin"

                }
            );


        if (respuesta.status === 401) {

            window.location.href =
                "/login.html";

            return;

        }


        if (!respuesta.ok) {

            alert(
                "No se pudo eliminar el servicio."
            );

            return;

        }


        await cargarServicios();


    } catch (error) {

        console.error(error);

        alert(
            "Error al eliminar el servicio."
        );

    }

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

const btnLogout =
    document.querySelector("#btn-logout");


if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        async () => {

            try {

                await fetch(
                    "/api/admin/logout",
                    {

                        method:
                            "POST",

                        credentials:
                            "same-origin"

                    }
                );

            } catch (error) {

                console.error(error);

            }


            window.location.href =
                "/login.html";

        }
    );

}


// ==========================================
// INICIO
// ==========================================

cargarServicios();