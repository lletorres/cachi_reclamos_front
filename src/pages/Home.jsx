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
              <div className="d-flex flex-column flex-md-row align-items-center gap-3">
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
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span
                        className={`badge ${getBadgeColor(reporte.categoria)}`}
                      >
                        {reporte.categoria}
                      </span>
                      <small className="text-muted">
                        {new Date(reporte.createdAt).toLocaleDateString()}
                      </small>
                    </div>

                    <h5 className="card-title">{reporte.titulo}</h5>
                    <p className="card-text text-secondary">
                      {reporte.descripcion}
                    </p>

                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        👤{" "}
                        {reporte.usuario ? reporte.usuario.nombre : "Anónimo"}
                      </small>

                      {/* Estado del reporte */}
                      <span
                        className={`badge ${reporte.estado === "Resuelto" ? "bg-success" : "bg-secondary"}`}
                      >
                        {reporte.estado || "Pendiente"}
                      </span>
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
