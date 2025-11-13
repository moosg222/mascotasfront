const API_USUARIOS = "https://mascotas-production-7bb1.up.railway.app/usuarios";

// =====================================================
// Cargar perfil al iniciar
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  await cargarPerfilDesdeBackend();
});

// =====================================================
// Función para obtener perfil desde backend
// =====================================================
async function cargarPerfilDesdeBackend() {
  const token = localStorage.getItem("token");

  if (!token) {
    await Swal.fire({
      icon: "warning",
      title: "Debes iniciar sesión",
      text: "Redirigiendo al login...",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#3b82f6",
    });
    window.location.href = "/";
    return;
  }

  try {
    const res = await fetch(`${API_USUARIOS}/perfil`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      await Swal.fire({
        icon: "error",
        title: "Token inválido",
        text: "Inicia sesión nuevamente",
        background: "#f9f9f9",
        color: "#333",
        confirmButtonColor: "#ef4444",
      });
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }

    const usuario = await res.json();
    cargarPerfil(usuario);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al cargar tu perfil",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#ef4444",
    });
  }
}

// =====================================================
// Función para mostrar datos en los modales
// =====================================================
function cargarPerfil(usuario) {
  document.getElementById("perfilNombre").textContent =
    usuario.nombre || "Sin nombre";
  document.getElementById("perfilEmail").textContent =
    usuario.email || "Sin email";
  document.getElementById("perfilTelefono").textContent =
    usuario.telefono || "Sin teléfono";

  document.getElementById("nuevoNombre").value = usuario.nombre || "";
  document.getElementById("nuevoEmail").value = usuario.email || "";
  document.getElementById("nuevoTelefono").value = usuario.telefono || "";
  document.getElementById("nuevaPassword").value = "";
}

// =====================================================
// Abrir/Cerrar modales
// =====================================================
function togglePerfil(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}

function abrirActualizarPerfil() {
  togglePerfil("perfilModal");
  togglePerfil("actualizarModal");
}

// =====================================================
// Actualizar perfil
// =====================================================
async function actualizarPerfil() {
  const token = localStorage.getItem("token");

  const datos = {
    nombre: document.getElementById("nuevoNombre").value.trim(),
    email: document.getElementById("nuevoEmail").value.trim(),
    telefono: document.getElementById("nuevoTelefono").value.trim(),
    passwordActual: document.getElementById("passwordActual").value.trim(),
    nuevaPassword: document.getElementById("nuevaPassword").value.trim(),
  };

  if (datos.nuevaPassword && !datos.passwordActual) {
    await Swal.fire({
      icon: "warning",
      title: "Contraseña requerida",
      text: "Debe ingresar la contraseña actual para cambiarla",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#3b82f6",
    });
    return;
  }

  try {
    const res = await fetch(`${API_USUARIOS}/perfil`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    const data = await res.json();

    if (!res.ok) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Error al actualizar perfil",
        background: "#f9f9f9",
        color: "#333",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    localStorage.setItem("token", data.token);

    const usuario = data.usuario;
    document.getElementById("perfilNombre").textContent =
      usuario.nombre || "Sin nombre";
    document.getElementById("perfilEmail").textContent =
      usuario.email || "Sin email";
    document.getElementById("perfilTelefono").textContent =
      usuario.telefono || "Sin teléfono";

    document.getElementById("nuevoNombre").value = usuario.nombre || "";
    document.getElementById("nuevoEmail").value = usuario.email || "";
    document.getElementById("nuevoTelefono").value = usuario.telefono || "";

    document.getElementById("passwordActual").value = "";
    document.getElementById("nuevaPassword").value = "";

    await Swal.fire({
      icon: "success",
      title: "¡Perfil actualizado!",
      text: "Tus datos se actualizaron correctamente",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#3b82f6",
    });
    togglePerfil("actualizarModal");
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al actualizar perfil",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#ef4444",
    });
  }
}

// =====================================================
// Eliminar perfil
// =====================================================
async function eliminarPerfil() {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Eliminar perfil?",
    text: "Esta acción es irreversible",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#3b82f6",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    background: "#f9f9f9",
    color: "#333",
  });

  if (!isConfirmed) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_USUARIOS}/perfil`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el perfil",
        background: "#f9f9f9",
        color: "#333",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    localStorage.removeItem("token");
    await Swal.fire({
      icon: "success",
      title: "Perfil eliminado",
      text: "Tu perfil se eliminó correctamente",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#3b82f6",
    });
    window.location.href = "/";
  } catch (error) {
    console.error("Error al eliminar perfil:", error);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al eliminar perfil",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#ef4444",
    });
  }
}

// =====================================================
// Lottie Avatar Animation
// =====================================================
const avatar = lottie.loadAnimation({
  container: document.getElementById("avatarLottie"),
  renderer: "svg",
  loop: 0,
  autoplay: true,
  path: "assets/icons/wired-flat-21-avatar-hover-looking-around.json",
});
avatar.setSpeed(0.6);

// =====================================================
// visivilidad de la contraseña
// =====================================================
function setupToggle(inputId, iconContainerId) {
  const input = document.getElementById(inputId);
  const iconContainer = document.getElementById(iconContainerId);

  iconContainer.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";

    // Cambiar ícono SVG dinámicamente
    iconContainer.innerHTML = isPassword
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
}

setupToggle("passwordActual", "togglePasswordActual");
setupToggle("nuevaPassword", "togglePasswordNueva");

async function cerrarSesion() {
  const { isConfirmed } = await Swal.fire({
    icon: "question",
    title: "¿Cerrar sesión?",
    text: "Se cerrará tu sesión actual",
    showCancelButton: true,
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#ef4444",
    confirmButtonText: "Cerrar sesión",
    cancelButtonText: "Cancelar",
    background: "#f9f9f9",
    color: "#333",
  });

  if (!isConfirmed) return;

  // Eliminar token y cerrar sesión
  localStorage.removeItem("token");

  await Swal.fire({
    icon: "success",
    title: "Sesión cerrada",
    text: "Has cerrado sesión correctamente",
    timer: 1500,
    showConfirmButton: false,
    background: "#f9f9f9",
    color: "#333",
  });

  window.location.href = "/";
}
