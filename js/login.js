const API_LOGIN = "mascotas-production-7bb1.up.railway.app/usuarios/login";

// LOGIN
async function login() {
  const email = document.getElementById("email").value.trim();
  const clave = document.getElementById("clave").value.trim();

  if (!email || !clave) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Todos los campos son obligatorios",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#3b82f6", // azul minimalista
    });
    return;
  }

  try {
    const res = await fetch(API_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, clave}),
    });

    const data = await res.json();

    if (!res.ok) {
      // Si no está verificado
      if (
        data.message === "Debes verificar tu correo antes de iniciar sesión"
      ) {
        return Swal.fire({
          icon: "warning",
          title: "Correo no verificado",
          text: "Tu enlace expiró o aún no verificas tu correo.",
          showCancelButton: true,
          confirmButtonText: "Reenviar verificación",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#3b82f6",
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Llamar nuevo endpoint
            const resp = await fetch(
              "http://localhost:5000/usuarios/reenviarVerificacion",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              }
            );

            const data2 = await resp.json();

            Swal.fire({
              icon: resp.ok ? "success" : "error",
              title: resp.ok ? "Correo enviado" : "Error",
              text: data2.message,
              confirmButtonColor: "#3b82f6",
            });
          }
        });
      }

      // Otros errores normales
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Error al iniciar sesión",
        background: "#f9f9f9",
        color: "#333",
        confirmButtonColor: "#ef4444",
      });
    }

    localStorage.setItem("token", data.token);
    console.log(data);

    Swal.fire({
      icon: "success",
      title: "¡Bienvenido!",
      text: "Inicio de sesión exitoso",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#3b82f6",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "/home";
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo iniciar sesión",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#ef4444",
    });
  }
}

// TOGGLE PASSWORD
const toggleLoginPassword = document.getElementById("toggleLoginPassword");
const claveInput = document.getElementById("clave");

toggleLoginPassword.addEventListener("click", () => {
  const type = claveInput.type === "password" ? "text" : "password";
  claveInput.type = type;
  toggleLoginPassword.innerHTML =
    type === "password"
      ? `
    <!-- Eye-off nuevo -->
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
      fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-eye-off">
      <path d="M3 3l18 18" />
      <path d="M10.73 5.08A10.47 10.47 0 0 1 12 5c7 0 10 7 10 7a19.79 19.79 0 0 1-2.24 3.64" />
      <path d="M6.12 6.12A19.79 19.79 0 0 0 2 12s3 7 10 7a10.5 10.5 0 0 0 5.88-1.88" />
      <path d="M14 14a3 3 0 0 1-4-4" />
    </svg>
  `
      : `
    <!-- Eye -->
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
      fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-eye">
      <path d="M2 12S5 5 12 5s10 7 10 7-3 7-10 7S2 12 2 12Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `;
});

// MODALES
function abrirModal(id) {
  document.getElementById(id).classList.remove("hidden");
  if (id !== "loginModal")
    document.getElementById("loginModal").classList.add("hidden");
}

function cerrarModal(id) {
  document.getElementById(id).classList.add("hidden");
  document.getElementById("loginModal").classList.remove("hidden");
}

// RECUPERAR CONTRASEÑA

async function solicitarRecuperacion() {
  const email = document.getElementById("emailRecuperar").value.trim();
  if (!email) return Swal.fire("Error", "Ingresa tu correo", "error");

  // Mostrar SweetAlert de carga
  Swal.fire({
    title: "Enviando correo...",
    text: "Por favor espera mientras procesamos tu solicitud",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const res = await fetch("http://localhost:5000/usuarios/recuperar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    // Cerrar loader y mostrar resultado
    Swal.close();

    if (res.ok) {
      Swal.fire("¡Éxito!", data.message, "success");
      cerrarModal("recuperarModal");
    } else {
      Swal.fire(
        "Error",
        data.message || "Error al solicitar recuperación",
        "error"
      );
    }
  } catch (error) {
    console.error(error);
    Swal.close();
    Swal.fire("Error", "Error al solicitar recuperación", "error");
  }
}
