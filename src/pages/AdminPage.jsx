import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  deleteReporte,
  updateEstadoReporte,
} from "../services/api";

const API_URL_REPORTES = "http://localhost:4000/api/reportes";
const fetchReportes = async () => {
  const res = await fetch(API_URL_REPORTES);
  return await res.json();
};

export default function AdminPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("reportes");
  const [reportes, setReportes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADO PARA VER DETALLES DEL REPORTE ---
  const [reporteDetalle, setReporteDetalle] = useState(null);

  // --- ESTADO DEL MODAL DE CONFIRMACIÓN ---
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    icon: "⚠️",
    onConfirm: null,
  });

  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/");
    } else {
      cargarDatos();
    }
  }, [user, navigate]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [reps, usrs] = await Promise.all([fetchReportes(), getAllUsers()]);
      setReportes(reps);
      setUsuarios(usrs);
    } catch (error) {
      console.error("Error cargando panel:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función genérica para abrir el modal de confirmación
  const confirmarAccion = (title, message, icon, actionFunction) => {
    setModal({
      isOpen: true,
      title,
      message,
      icon,
      onConfirm: async () => {
        await actionFunction();
        setModal({ ...modal, isOpen: false }); // Cerramos el modal
      },
    });
  };

  // --- Manejadores de Reportes ---
  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await updateEstadoReporte(id, nuevoEstado);
      cargarDatos();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEliminarReporte = (id) => {
    confirmarAccion(
      "Eliminar Reporte",
      "¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.",
      "🗑️",
      async () => {
        try {
          await deleteReporte(id);
          cargarDatos();
          setReporteDetalle(null); // Si el admin lo borra desde los detalles, cerramos el cartel
        } catch (error) {
          alert("Error al eliminar");
        }
      },
    );
  };

  // --- Manejadores de Usuarios ---
  const handleCambiarRol = (id, rolActual) => {
    const nuevoRol = rolActual === "admin" ? "user" : "admin";
    confirmarAccion(
      "Cambiar Privilegios",
      `¿Deseas cambiar el rol de este usuario a ${nuevoRol.toUpperCase()}?`,
      "🛡️",
      async () => {
        try {
          await updateUserRole(id, nuevoRol);
          cargarDatos();
        } catch (error) {
          alert("Error al cambiar rol");
        }
      },
    );
  };

  const handleEliminarUsuario = (id) => {
    confirmarAccion(
      "Eliminar Vecino",
      "¿Seguro que deseas expulsar a este usuario de la plataforma?",
      "🚫",
      async () => {
        try {
          await deleteUser(id);
          cargarDatos();
        } catch (error) {
          alert("Error al eliminar usuario");
        }
      },
    );
  };

  // Helper para los colores del select
  const getEstadoColor = (estado) => {
    if (estado === "Resuelto") return "var(--verde-lt)";
    if (estado === "En Proceso") return "#f1c40f";
    return "var(--ocre)"; // Pendiente
  };

  if (loading)
    return (
      <div className="ca-section text-center mt-5">
        <div className="ca-spinner mx-auto"></div>
      </div>
    );

  return (
    <div className="rp-shell pb-5">
      <div className="rp-container" style={{ maxWidth: "900px" }}>
        <div className="rp-header text-center mt-4 mb-5">
          <p className="rp-eyebrow">Panel de Control</p>
          <h1 className="rp-title">Sección Administrador</h1>
        </div>

        <div className="d-flex justify-content-center gap-3 mb-4">
          <button
            className={`ca-chip ${activeTab === "reportes" ? "active" : ""}`}
            onClick={() => setActiveTab("reportes")}
          >
            📋 Reportes
          </button>
          <button
            className={`ca-chip ${activeTab === "usuarios" ? "active" : ""}`}
            onClick={() => setActiveTab("usuarios")}
          >
            👥 Usuarios
          </button>
        </div>

        {/* CONTENIDO REPORTES */}
        {activeTab === "reportes" && (
          <div className="card-custom">
            <h4 className="mb-4 ca-modal-title">Reportes Activos</h4>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                    }}
                  >
                    <th>Título</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((r) => (
                    <tr key={r.id}>
                      <td className="fw-bold">{r.titulo}</td>
                      <td>
                        <span className="ca-badge">{r.categoria}</span>
                      </td>
                      <td>
                        <select
                          className="ca-status-select"
                          value={r.estado}
                          onChange={(e) =>
                            handleCambiarEstado(r.id, e.target.value)
                          }
                          style={{ backgroundColor: getEstadoColor(r.estado) }}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Proceso">En Proceso</option>
                          <option value="Resuelto">Resuelto</option>
                        </select>
                      </td>
                      <td>
                        {/* BOTÓN NUEVO: VER DETALLES */}
                        <button
                          onClick={() => setReporteDetalle(r)}
                          className="btn btn-sm btn-light rounded-pill px-3 me-2"
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={() => handleEliminarReporte(r.id)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTENIDO USUARIOS */}
        {activeTab === "usuarios" && (
          <div className="card-custom">
            <h4 className="mb-4 ca-modal-title">Vecinos Registrados</h4>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                    }}
                  >
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-bold">{u.nombre}</td>
                      <td className="text-muted">{u.email}</td>
                      <td>
                        <span
                          className="badge rounded-pill"
                          style={{
                            background:
                              u.rol === "admin"
                                ? "var(--verde)"
                                : "var(--arena)",
                            color:
                              u.rol === "admin" ? "white" : "var(--sombra)",
                          }}
                        >
                          {u.rol?.toUpperCase() || "USER"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleCambiarRol(u.id, u.rol)}
                          className="btn btn-sm btn-light rounded-pill me-2"
                        >
                          Rol ↻
                        </button>
                        <button
                          onClick={() => handleEliminarUsuario(u.id)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ════════ RENDERIZADO DEL MODAL DE DETALLES DEL REPORTE ════════ */}
      {reporteDetalle && (
        <div
          className="ca-modal-overlay"
          onClick={() => setReporteDetalle(null)} // Cierra si haces clic afuera
        >
          {/* text-start alinea el texto a la izquierda en lugar de centrarlo */}
          <div
            className="ca-modal-box text-start"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "550px" }}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h3 className="ca-modal-title m-0">Detalle del Reclamo</h3>
              <button
                className="btn-close"
                onClick={() => setReporteDetalle(null)}
                aria-label="Cerrar"
              ></button>
            </div>

            {/* Muestra la imagen si existe, o un cartelito gris si no subieron foto */}
            {reporteDetalle.imageUrl ? (
              <img
                src={reporteDetalle.imageUrl}
                alt={`Evidencia: ${reporteDetalle.titulo}`}
                className="img-fluid rounded mb-3 w-100"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-light rounded d-flex align-items-center justify-content-center mb-3 border"
                style={{ height: "150px", color: "var(--muted)" }}
              >
                <span>📸 El vecino no adjuntó imagen</span>
              </div>
            )}

            <h5 className="fw-bold mb-2" style={{ color: "var(--sombra)" }}>
              {reporteDetalle.titulo}
            </h5>

            <span
              className="badge mb-3"
              style={{
                background: "var(--arena)",
                color: "var(--sombra)",
                fontSize: "0.85rem",
              }}
            >
              {reporteDetalle.categoria}
            </span>

            {/* white-space: pre-wrap permite que se respeten los saltos de línea del texto */}
            <div className="p-3 bg-light rounded border mb-4">
              <p
                className="mb-0"
                style={{
                  color: "var(--sombra)",
                  fontSize: "0.95rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {reporteDetalle.descripcion}
              </p>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-2">
              <button
                className="btn btn-outline-danger rounded-pill px-4 fw-bold"
                onClick={() => handleEliminarReporte(reporteDetalle.id)}
              >
                Eliminar Reclamo
              </button>
              <button
                className="btn btn-primary rounded-pill px-4 fw-bold"
                onClick={() => setReporteDetalle(null)}
                style={{ background: "var(--verde)", border: "none" }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ RENDERIZADO DEL MODAL DE CONFIRMACIÓN GLOBAL ════════ */}
      {modal.isOpen && (
        <div className="ca-modal-overlay">
          <div className="ca-modal-box text-center">
            <span className="ca-modal-icon">{modal.icon}</span>
            <h3 className="ca-modal-title">{modal.title}</h3>
            <p className="ca-modal-text">{modal.message}</p>
            <div className="ca-modal-actions">
              <button
                className="btn btn-light rounded-pill px-4 fw-bold"
                onClick={() => setModal({ ...modal, isOpen: false })}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger rounded-pill px-4 fw-bold"
                onClick={modal.onConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
