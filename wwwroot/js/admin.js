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

async function cargarServicios(){

    try{

        const respuesta =
            await fetch("/api/servicios");

        if(!respuesta.ok){
            throw new Error(
                "No se pudieron cargar los servicios"
            );
        }

        const servicios =
            await respuesta.json();

        contador.textContent =
            `${servicios.length} servicio${
                servicios.length === 1 ? "" : "s"
            }`;

        cantidadInicio.textContent =
            servicios.length;

        mostrarServicios(servicios);

    }catch(error){

        console.error(error);

        listaServicios.innerHTML =
            `<p class="sin-servicios">
                No se pudieron cargar los servicios.
            </p>`;

    }

}


// ==========================================
// MOSTRAR SERVICIOS
// ==========================================

function mostrarServicios(servicios){

    listaServicios.innerHTML = "";

    if(servicios.length === 0){

        listaServicios.innerHTML =
            `<p class="sin-servicios">
                Todavía no hay servicios.
            </p>`;

        return;
    }


    servicios.forEach(servicio => {

        const item =
            document.createElement("article");

        item.className =
            "servicio-admin-item";


        const contenido =
            document.createElement("div");


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


        if(servicio.precio !== null){

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

        editar.className =
            "btn-editar";

        editar.textContent =
            "Editar";

        editar.addEventListener(
            "click",
            () => editarServicio(servicio)
        );


        const eliminar =
            document.createElement("button");

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
// AGREGAR / EDITAR
// ==========================================

formServicio.addEventListener(
    "submit",
    async e => {

        e.preventDefault();

        const id =
            inputId.value;

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
                inputImagen.value.trim() || null,

            activo:true

        };


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


        try{

            const respuesta =
                await fetch(url,{

                    method:metodo,

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    credentials:"same-origin",

                    body:
                        JSON.stringify(datos)

                });


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


            limpiarFormulario();

            await cargarServicios();


        }catch(error){

            console.error(error);

            alert(
                "Error al conectar con el servidor."
            );

        }

    }
);


// ==========================================
// EDITAR
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

    inputImagen.value =
        servicio.imagen ?? "";


    tituloFormulario.textContent =
        "Editar servicio";

    btnGuardar.textContent =
        "Guardar cambios";

    btnCancelar.hidden =
        false;


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


// ==========================================
// CANCELAR EDICIÓN
// ==========================================

btnCancelar.addEventListener(
    "click",
    limpiarFormulario
);


function limpiarFormulario(){

    formServicio.reset();

    inputId.value = "";

    tituloFormulario.textContent =
        "Agregar servicio";

    btnGuardar.textContent =
        "Agregar servicio";

    btnCancelar.hidden =
        true;

}


// ==========================================
// ELIMINAR
// ==========================================

async function eliminarServicio(id){

    const confirmar =
        confirm(
            "¿Seguro que querés eliminar este servicio?"
        );

    if(!confirmar){
        return;
    }


    try{

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


        if(!respuesta.ok){

            alert(
                "No se pudo eliminar el servicio."
            );

            return;

        }


        await cargarServicios();


    }catch(error){

        console.error(error);

    }

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

document
    .querySelector("#btn-logout")
    .addEventListener(
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