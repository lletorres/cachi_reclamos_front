import { useState, useEffect, useRef } from "react";
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

// 🌟 NUEVO COMPONENTE: Dropdown personalizado para el Estado
const StatusDropdown = ({ estadoActual, onCambiarEstado, getEstadoColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cierra el menú si se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const opciones = ["Pendiente", "En Proceso", "Resuelto"];

  return (
    <div className="custom-status-dropdown" ref={dropdownRef}>
      <button
        className="ca-status-select-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: getEstadoColor(estadoActual) }}
      >
        {estadoActual}{" "}
        <span style={{ fontSize: "0.6rem", marginLeft: "4px" }}>▼</span>
      </button>

      {isOpen && (
        <div className="custom-dropdown-menu shadow-sm">
          {opciones.map((opcion) => (
            <button
              key={opcion}
              className={`dropdown-item-btn ${estadoActual === opcion ? "active" : ""}`}
              onClick={() => {
                onCambiarEstado(opcion);
                setIsOpen(false);
              }}
            >
              {opcion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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

  const confirmarAccion = (title, message, icon, actionFunction) => {
    setModal({
      isOpen: true,
      title,
      message,
      icon,
      onConfirm: async () => {
        await actionFunction();
        setModal({ ...modal, isOpen: false });
      },
    });
  };

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
          setReporteDetalle(null);
        } catch (error) {
          alert("Error al eliminar");
        }
      },
    );
  };

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

  const getEstadoColor = (estado) => {
    if (estado === "Resuelto") return "var(--verde-lt)";
    if (estado === "En Proceso") return "#f1c40f";
    return "var(--ocre)";
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

        {/* ════════ CONTENIDO REPORTES (Flexbox Responsivo) ════════ */}
        {activeTab === "reportes" && (
          <div className="card-custom">
            <h4 className="mb-4 ca-modal-title">Reportes Activos</h4>

            <div className="admin-list-container">
              <div
                className="d-none d-md-flex pb-2 mb-3 border-bottom text-muted fw-bold text-uppercase"
                style={{ fontSize: "0.85rem" }}
              >
                <div style={{ flex: 2 }}>Título</div>
                <div style={{ flex: 1 }}>Categoría</div>
                <div style={{ flex: 1 }}>Estado</div>
                <div style={{ flex: 1.5, textAlign: "right" }}>Acciones</div>
              </div>

              <div className="d-flex flex-column gap-3 gap-md-0">
                {reportes.map((r) => (
                  <div
                    key={r.id}
                    className="d-flex flex-column flex-md-row align-items-md-center py-3 py-md-2 border-bottom"
                  >
                    <div
                      style={{ flex: 2 }}
                      className="fw-bold mb-2 mb-md-0 text-truncate"
                    >
                      {r.titulo}
                    </div>

                    <div
                      style={{ flex: 1 }}
                      className="d-flex justify-content-between align-items-center mb-2 mb-md-0"
                    >
                      <span
                        className="d-md-none text-muted fw-bold"
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Categoría
                      </span>
                      <span className="ca-badge">{r.categoria}</span>
                    </div>

                    <div
                      style={{ flex: 1 }}
                      className="d-flex justify-content-between align-items-center mb-3 mb-md-0"
                    >
                      <span
                        className="d-md-none text-muted fw-bold"
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Estado
                      </span>

                      {/* 🌟 USAMOS EL NUEVO COMPONENTE DROPDOWN AQUÍ */}
                      <StatusDropdown
                        estadoActual={r.estado}
                        onCambiarEstado={(nuevoEstado) =>
                          handleCambiarEstado(r.id, nuevoEstado)
                        }
                        getEstadoColor={getEstadoColor}
                      />
                    </div>

                    <div
                      style={{ flex: 1.5 }}
                      className="d-flex justify-content-md-end gap-2"
                    >
                      <button
                        onClick={() => setReporteDetalle(r)}
                        className="btn btn-sm btn-light rounded-pill flex-grow-1 flex-md-grow-0 px-3"
                      >
                        👁️ Ver
                      </button>
                      <button
                        onClick={() => handleEliminarReporte(r.id)}
                        className="btn btn-sm btn-outline-danger rounded-pill flex-grow-1 flex-md-grow-0 px-3"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════ CONTENIDO USUARIOS (Flexbox Responsivo) ════════ */}
        {activeTab === "usuarios" && (
          <div className="card-custom">
            <h4 className="mb-4 ca-modal-title">Vecinos Registrados</h4>

            <div className="admin-list-container">
              <div
                className="d-none d-md-flex pb-2 mb-3 border-bottom text-muted fw-bold text-uppercase"
                style={{ fontSize: "0.85rem" }}
              >
                <div style={{ flex: 2 }}>Nombre</div>
                <div style={{ flex: 2 }}>Email</div>
                <div style={{ flex: 1 }}>Rol</div>
                <div style={{ flex: 1.5, textAlign: "right" }}>Acciones</div>
              </div>

              <div className="d-flex flex-column gap-3 gap-md-0">
                {usuarios.map((u) => (
                  <div
                    key={u.id}
                    className="d-flex flex-column flex-md-row align-items-md-center py-3 py-md-2 border-bottom"
                  >
                    <div style={{ flex: 2 }} className="fw-bold mb-1 mb-md-0">
                      {u.nombre}
                    </div>

                    <div
                      style={{ flex: 2, fontSize: "0.9rem" }}
                      className="text-muted mb-3 mb-md-0"
                    >
                      {u.email}
                    </div>

                    <div
                      style={{ flex: 1 }}
                      className="d-flex justify-content-between align-items-center mb-3 mb-md-0"
                    >
                      <span
                        className="d-md-none text-muted fw-bold"
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                        }}
                      >
                        Rol
                      </span>
                      <span
                        className="badge rounded-pill"
                        style={{
                          background:
                            u.rol === "admin" ? "var(--verde)" : "var(--arena)",
                          color: u.rol === "admin" ? "white" : "var(--sombra)",
                        }}
                      >
                        {u.rol?.toUpperCase() || "USER"}
                      </span>
                    </div>

                    <div
                      style={{ flex: 1.5 }}
                      className="d-flex justify-content-md-end gap-2"
                    >
                      <button
                        onClick={() => handleCambiarRol(u.id, u.rol)}
                        className="btn btn-sm btn-light rounded-pill flex-grow-1 flex-md-grow-0"
                      >
                        Rol ↻
                      </button>
                      <button
                        onClick={() => handleEliminarUsuario(u.id)}
                        className="btn btn-sm btn-outline-danger rounded-pill flex-grow-1 flex-md-grow-0 px-3"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════════ MODAL DETALLES DEL REPORTE ════════ */}
      {reporteDetalle && (
        <div
          className="ca-modal-overlay"
          onClick={() => setReporteDetalle(null)}
        >
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

      {/* ════════ MODAL DE CONFIRMACIÓN GLOBAL ════════ */}
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
