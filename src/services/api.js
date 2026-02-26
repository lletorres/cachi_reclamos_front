// 1. Definimos la URL base para usuarios y para reportes
const API_URL_USERS = "http://localhost:4000/api/users";
const API_URL_REPORTES = "http://localhost:4000/api/reportes";

// 2. AGREGAMOS ESTA FUNCIÓN (La que te faltaba y causaba el error)
// Esta función saca el token del almacenamiento del navegador
export const getToken = () => {
  return sessionStorage.getItem("token");
};

// 1. REGISTRARSE
export const registerService = async (datosUsuario) => {
  const res = await fetch(`${API_URL_USERS}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosUsuario),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al registrarse");
  return data;
};

// 2. INICIAR SESIÓN
export const loginService = async (email, password) => {
  const res = await fetch(`${API_URL_USERS}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");
  return data;
};

// 3. Crear Reporte (POST)
export const createReporte = async (reporteData) => {
  const token = getToken(); // <--- Ahora sí funcionará porque la definimos arriba

  // OJO: Cambié ${API_URL}/reportes por API_URL_REPORTES
  // para que pegue a /api/reportes y no a /api/users/reportes
  const res = await fetch(API_URL_REPORTES, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: reporteData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al crear reporte");
  }

  return await res.json();
};

// 4. Obtener Reportes (GET)
export const getReportes = async () => {
  const response = await fetch(API_URL_REPORTES);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener reportes");
  }

  return data;
};

// --- FUNCIONES PARA EL ADMINISTRADOR ---

// Obtener todos los usuarios
export const getAllUsers = async () => {
  const token = getToken();
  const res = await fetch(API_URL_USERS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return await res.json();
};

// Cambiar el rol de un usuario
export const updateUserRole = async (userId, nuevoRol) => {
  const token = getToken();
  const res = await fetch(`${API_URL_USERS}/${userId}/rol`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rol: nuevoRol }),
  });
  if (!res.ok) throw new Error("Error al actualizar rol");
  return await res.json();
};

// Eliminar un usuario
export const deleteUser = async (userId) => {
  const token = getToken();
  const res = await fetch(`${API_URL_USERS}/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar usuario");
  return await res.json();
};

// Eliminar un reporte
export const deleteReporte = async (reporteId) => {
  const token = getToken();
  const res = await fetch(`${API_URL_REPORTES}/${reporteId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar reporte");
  return await res.json();
};

// Cambiar estado de un reporte
export const updateEstadoReporte = async (reporteId, nuevoEstado) => {
  const token = getToken();
  const res = await fetch(`${API_URL_REPORTES}/${reporteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado: nuevoEstado }),
  });
  if (!res.ok) throw new Error("Error al cambiar estado");
  return await res.json();
};
