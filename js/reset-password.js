const API = "https://mascotas-production-7bb1.up.railway.app";

// Elementos
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordNueva");
const btnRestablecer = document.getElementById("btnRestablecer");

// Toggle visibilidad de la contraseña
togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.textContent = type === "password" ? "👁️" : "🙈";
});

// Función para restablecer contraseña
async function restablecerContraseña() {
  const passwordNueva = passwordInput.value.trim();
  if (!passwordNueva) {
    await Swal.fire({
      icon: "warning",
      title: "Contraseña requerida",
      text: "Ingresa la nueva contraseña",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#3b82f6",
    });
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) {
    await Swal.fire({
      icon: "error",
      title: "Token inválido",
      text: "El token es inválido o expiró",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#ef4444",
    });
    return;
  }

  try {
    // Mostrar loader mientras se procesa
    Swal.fire({
      title: "Procesando...",
      text: "Restableciendo tu contraseña, por favor espera",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: "#f9f9f9",
      color: "#333",
    });

    const res = await fetch(`${API}/usuarios/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, passwordNueva }),
    });

    const data = await res.json();
    Swal.close(); // Cerrar loader

    if (res.ok) {
      await Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: data.message,
        background: "#f9f9f9",
        color: "#333",
        confirmButtonColor: "#3b82f6",
      });
      window.location.href = "/";
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "No se pudo restablecer la contraseña",
        background: "#f9f9f9",
        color: "#333",
        confirmButtonColor: "#ef4444",
      });
    }
  } catch (error) {
    console.error(error);
    Swal.close();
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al restablecer la contraseña",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#ef4444",
    });
  }
}

// Listener para botón
btnRestablecer.addEventListener("click", restablecerContraseña);
