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