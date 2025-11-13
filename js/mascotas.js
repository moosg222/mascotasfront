const API = `mascotas-production-7bb1.up.railway.app/mascotas`;

// =============================
//  SWEETALERT HELPERS
// =============================
function alerta(titulo, texto, icono = "success") {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    confirmButtonColor: "#2563eb",
  });
}

function alertaError(texto) {
  Swal.fire({
    title: "Error",
    text: texto,
    icon: "error",
    confirmButtonColor: "#dc2626",
  });
}

// =============================
//  RENDERIZAR TABLA REUTILIZABLE
// =============================
function renderTable(data, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) {
    console.warn(`No se encontró el contenedor con id "${contenedorId}"`);
    return;
  }

  contenedor.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    contenedor.innerHTML =
      "<p class='text-gray-500 text-center'>No hay datos para mostrar.</p>";
    return;
  }

  const table = document.createElement("table");
  table.className =
    "w-full border border-gray-300 bg-white rounded-lg overflow-hidden text-sm";

  const thead = document.createElement("thead");
  thead.className = "bg-gray-100";
  thead.innerHTML = `
    <tr>
      <th class='p-2 border'>Nombre</th>
      <th class='p-2 border'>Tipo</th>
      <th class='p-2 border'>Raza</th>
      <th class='p-2 border'>Edad</th>
      <th class='p-2 border'>Descripción</th>
      <th class='p-2 border'>Adoptado</th>
      <th class='p-2 border'>ID</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");
  const fragment = document.createDocumentFragment();

  for (const m of data) {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 transition-colors";

    const safe = (v) =>
      typeof v === "string"
        ? v.replace(
            /[&<>"']/g,
            (c) =>
              ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;",
              }[c])
          )
        : v;

    row.innerHTML = `
      <td class='p-2 border'>${safe(m.nombre)}</td>
      <td class='p-2 border'>${safe(m.tipo)}</td>
      <td class='p-2 border'>${safe(m.raza) ?? "—"}</td>
      <td class='p-2 border text-center'>${safe(m.edad) ?? "—"}</td>
      <td class='p-2 border'>${safe(m.descripcion) ?? "—"}</td>
      <td class='p-2 border text-center'>${m.adoptado ? "✅" : "❌"}</td>
      <td class='p-2 border text-xs text-gray-600'>${safe(m._id)}</td>
    `;

    fragment.appendChild(row);
  }

  tbody.appendChild(fragment);
  table.append(thead, tbody);
  contenedor.appendChild(table);
}

// =============================
//  TOKEN HELPER
// =============================
function obtenerToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Sesión expirada",
      text: "Por favor inicia sesión nuevamente.",
      confirmButtonColor: "#3b82f6",
    }).then(() => (window.location.href = "/login.html"));
    throw new Error("Token no encontrado");
  }
  return token;
}

// =============================
//  CREAR MASCOTA
// =============================
async function crear() {
  try {
    const token = obtenerToken();
    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value;
    const raza = document.getElementById("raza").value.trim();
    const edad = document.getElementById("edad").value;
    const descripcion = document.getElementById("descripcion").value.trim();
    const adoptado = document.getElementById("adoptado").value;

    if (!nombre || !tipo) return alertaError("Nombre y tipo son obligatorios.");

    const mascota = {
      nombre,
      tipo,
      raza,
      edad: edad ? Number(edad) : undefined,
      descripcion,
      adoptado: adoptado === "true",
    };

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mascota),
    });

    alerta("Éxito", "Mascota creada correctamente");

    ["nombre", "tipo", "raza", "edad", "descripcion"].forEach(
      (id) => (document.getElementById(id).value = "")
    );
    document.getElementById("adoptado").value = "false";
  } catch (err) {
    alertaError("Error creando la mascota.");
  }
}

// =============================
//  LISTAR MASCOTAS
// =============================
async function listar() {
  try {
    const token = obtenerToken();

    const res = await fetch(API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al obtener los datos");
    }

    const data = await res.json();
    renderTable(data, "lista");
  } catch (err) {
    console.error("Error en listar():", err);
    alertaError("No se pudo cargar el listado.");
  }
}

// =============================
//  BUSCAR POR ID
// =============================
async function buscarPorId() {
  try {
    const token = obtenerToken();
    const id = document.getElementById("buscarId").value.trim();
    if (!id) return alertaError("Ingresa un ID válido.");

    const res = await fetch(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return alertaError("Mascota no encontrada.");

    const mascota = await res.json();
    renderTable([mascota], "resultadoBusqueda");
  } catch (err) {
    alertaError("Error al buscar la mascota.");
  }
}

// =============================
//  ACTUALIZAR MASCOTA
// =============================
async function actualizar() {
  try {
    const token = obtenerToken();
    const id = document.getElementById("updateId").value.trim();
    if (!id) return alertaError("Ingresa un ID para actualizar.");

    const campos = {};
    const nombre = document.getElementById("updateNombre").value.trim();
    const tipo = document.getElementById("updateTipo").value;
    const raza = document.getElementById("updateRaza").value.trim();
    const edad = document.getElementById("updateEdad").value;
    const descripcion = document
      .getElementById("updateDescripcion")
      .value.trim();
    const adoptado = document.getElementById("updateAdoptado").value;

    if (nombre) campos.nombre = nombre;
    if (tipo) campos.tipo = tipo;
    if (raza) campos.raza = raza;
    if (edad !== "") campos.edad = Number(edad);
    if (descripcion) campos.descripcion = descripcion;
    if (adoptado !== "") campos.adoptado = adoptado === "true";

    if (!Object.keys(campos).length)
      return alertaError("No hay campos para actualizar.");

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(campos),
    });

    alerta("Actualizado", "Mascota actualizada correctamente");
  } catch (err) {
    alertaError("Error actualizando la mascota.");
  }
}

// =============================
//  ELIMINAR MASCOTA
// =============================
async function eliminar() {
  try {
    const token = obtenerToken();
    const id = document.getElementById("deleteId").value.trim();
    if (!id) return alertaError("Ingresa un ID para eliminar.");

    const confirm = await Swal.fire({
      title: "¿Eliminar mascota?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    alerta("Eliminado", "Mascota eliminada correctamente");
  } catch (err) {
    alertaError("Error eliminando la mascota.");
  }
}

// =============================
//  ROLES VISIBLES
// =============================

function toggleSection(id) {
  const content = document.getElementById(id);
  content.classList.toggle("hidden");
}

function obtenerRoles() {
  const token = localStorage.getItem("token");
  if (!token) return [];
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.roles || [];
  } catch {
    return [];
  }
}

function aplicarVisibilidadPorRol() {
  const rolesUsuario = (obtenerRoles() || []).map((r) =>
    typeof r === "string" ? r.toLowerCase() : r.nombre.toLowerCase()
  );

  document.querySelectorAll("[data-roles]").forEach((el) => {
    const rolesAttr = el.getAttribute("data-roles") || "";
    const rolesRequeridos = rolesAttr
      .split(",")
      .map((r) => r.trim().toLowerCase());

    const visible = rolesRequeridos.some((r) => rolesUsuario.includes(r));
    el.hidden = !visible;
  });
}

document.addEventListener("DOMContentLoaded", aplicarVisibilidadPorRol);
