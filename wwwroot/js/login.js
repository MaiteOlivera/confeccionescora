const formulario = document.querySelector("#form-login");
const mensaje = document.querySelector("#mensaje");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    mensaje.textContent = "";

    const usuario =
        document.querySelector("#usuario").value.trim();

    const password =
        document.querySelector("#password").value;

    try {

        const respuesta =
            await fetch("/api/admin/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "same-origin",

                body: JSON.stringify({
                    usuario,
                    password
                })

            });


        // ============================================
        // DEMASIADOS INTENTOS
        // ============================================

        if (respuesta.status === 429) {

            mensaje.textContent =
                "Demasiados intentos. Esperá 5 minutos antes de volver a intentar.";

            return;
        }


        // ============================================
        // USUARIO O CONTRASEÑA INCORRECTOS
        // ============================================

        if (respuesta.status === 401) {

            mensaje.textContent =
                "Usuario o contraseña incorrectos.";

            return;
        }


        // ============================================
        // OTRO ERROR DEL SERVIDOR
        // ============================================

        if (!respuesta.ok) {

            mensaje.textContent =
                "Ocurrió un error. Intentá nuevamente.";

            return;
        }


        // ============================================
        // LOGIN CORRECTO
        // ============================================

        window.location.href = "/admin";


    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "No se pudo conectar con el servidor.";

    }

});