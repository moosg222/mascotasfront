const API_USUARIOS = "https://mascotas-production-7bb1.up.railway.app/usuarios";

document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre: document.getElementById("nombre").value.trim(),
    email: document.getElementById("email").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    clave: document.getElementById("clave").value.trim(),
  };

  // Validación mínima
  if (!datos.nombre || !datos.email || !datos.telefono || !datos.clave) {
    return Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor completa todos los campos.",
      background: "#f9f9f9",
      color: "#333",
      confirmButtonColor: "#f59e0b",
    });
  }

  try {
    // Loader mientras se registra
    Swal.fire({
      title: "Registrando...",
      text: "Por favor espera",
      allowOutsideClick: false,
      background: "#f9f9f9",
      color: "#333",
      didOpen: () => Swal.showLoading()
    });

    const res = await fetch(`${API_USUARIOS}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const data = await res.json().catch(() => ({ message: "Error desconocido" }));

    // Cerrar loader
    Swal.close();

    if (!res.ok) {
      return Swal.fire({
        icon: "error",
        title: "No fue posible registrarte",
        text: data.message || "Ocurrió un error.",
        background: "#fdecec",
        color: "#b91c1c",
        confirmButtonColor: "#ef4444",
      });
    }

    // ✅ Registro exitoso
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "Revisa tu correo para verificar tu cuenta.",
      background: "#f0fdf4",
      color: "#166534",
      confirmButtonColor: "#22c55e",
      timer: 2500,
      showConfirmButton: false
    }).then(() => {
      window.location.href = "/";
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);

    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: "No se pudo completar el registro.",
      background: "#fdecec",
      color: "#b91c1c",
      confirmButtonColor: "#ef4444",
    });
  }
});

