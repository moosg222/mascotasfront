// Obtener el parámetro "estado" de la URL
const params = new URLSearchParams(window.location.search);
const estado = params.get("estado");

// Mostrar alerta según resultado
if (estado === "ok") {
  Swal.fire({
    icon: "success",
    title: "Correo verificado",
    text: "Tu cuenta ha sido activada correctamente.",
    confirmButtonText: "Iniciar sesión",
    confirmButtonColor: "#3b82f6",
    backdrop: true,
  }).then(() => {
    window.location.href = "/";
  });
} else {
  Swal.fire({
    icon: "error",
    title: "Enlace inválido o expirado",
    text: "El enlace para verificar tu cuenta no es válido o ya expiró.",
    confirmButtonText: "Volver",
    confirmButtonColor: "#ef4444",
    backdrop: true,
  }).then(() => {
    window.location.href = "/";
  });
}