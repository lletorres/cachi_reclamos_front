import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getReportes } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // Estados para manejar la lista de reportes
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar reportes al iniciar la página
  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const data = await getReportes();
      setReportes(data);
    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para el color de la categoría
  const getBadgeColor = (categoria) => {
    switch (categoria) {
      case "Bacheo":
        return "bg-danger"; // Rojo
      case "Alumbrado":
        return "bg-warning text-dark"; // Amarillo
      case "Basura":
        return "bg-success"; // Verde
      default:
        return "bg-primary"; // Azul
    }
  };

  return (
    <div className="container mt-4">
      {/* --- NUEVO ENCABEZADO CENTRADO --- */}
      <div className="welcome-section">
        <h1 className="welcome-title">🏔️ Cachi Activa</h1>
        <p className="welcome-subtitle">
          La plataforma de reportes ciudadanos en tiempo real.
          <br /> Ayúdanos a cuidar nuestra ciudad.
        </p>

        <div className="buttons-container">
          {user ? (
            <>
              {/* Si está logueado */}
              <div className="d-flex flex-column flex-md-column align-items-center gap-3">
                <span
                  className="fw-bold text-primary"
                  style={{ fontSize: "1.2rem" }}
                >
                  👋 Hola, {user.nombre}
                </span>
                <button
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => navigate("/reportar")}
                >
                  ➕ Nuevo Reporte
                </button>
                <button className="btn btn-outline-danger" onClick={logout}>
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Si NO está logueado */}
              <button
                className="btn btn-outline-primary btn-lg px-4"
                onClick={() => navigate("/login")}
              >
                Ingresar
              </button>
              <button
                className="btn btn-success btn-lg px-4"
                onClick={() => navigate("/registro")}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- LISTA DE REPORTES --- */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Cargando reportes...</p>
        </div>
      ) : (
        <div className="row">
          {reportes.length === 0 ? (
            <div className="col-12 text-center text-muted">
              <h4>📭 No hay reportes todavía</h4>
              <p>¡Sé el primero en reportar un problema!</p>
            </div>
          ) : (
            reportes.map((reporte) => (
              <div key={reporte._id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="card h-100 shadow-sm border-0 card-hover"
                  style={{ borderRadius: "18px", overflow: "hidden" }}
                >
                  {/* Imagen de cabecera de la tarjeta */}
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "180px", borderBottom: "1px solid #eee" }}
                  >
                    {reporte.imageUrl ? (
                      <img
                        src={reporte.imageUrl}
                        className="w-100 h-100 object-fit-cover"
                        alt="Evidencia"
                      />
                    ) : (
                      <div className="text-center text-muted">
                        <span style={{ fontSize: "2rem" }}>📸</span>
                        <p className="small mb-0">Sin evidencia visual</p>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span
                        className={`badge px-3 py-2 rounded-pill ${getBadgeColor(reporte.categoria)}`}
                      >
                        {reporte.categoria}
                      </span>
                      <span className="text-muted small fw-medium">
                        {new Date(reporte.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h5 className="card-title fw-bold mb-2">
                      {reporte.titulo}
                    </h5>
                    <p
                      className="card-text text-muted mb-4"
                      style={{
                        fontSize: "0.92rem",
                        display: "-webkit-box",
                        WebkitLineClamp: "3",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {reporte.descripcion}
                    </p>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-2"
                          style={{
                            width: "30px",
                            height: "30px",
                            fontSize: "0.8rem",
                          }}
                        >
                          {reporte.usuario?.nombre?.charAt(0) || "V"}
                        </div>
                        <span className="small text-dark fw-semibold">
                          {reporte.usuario?.nombre || "Vecino"}
                        </span>
                      </div>
                      <div className="status-indicator d-flex align-items-center">
                        <span
                          className="dot bg-warning me-2"
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                          }}
                        ></span>
                        <span
                          className="small fw-bold text-uppercase"
                          style={{ fontSize: "0.7rem", color: "#856404" }}
                        >
                          Pendiente
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
