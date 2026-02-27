import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getReportes } from "../services/api";
import "../styles/pages/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todos");

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

  const categorias = ["Todos", "Bacheo", "Alumbrado", "Basura", "Otros"];

  const reportesFiltrados =
    filtro === "Todos"
      ? reportes
      : reportes.filter((r) => r.categoria === filtro);

  const categoriaMeta = {
    Bacheo: { emoji: "🛣️", color: "#c0392b", bg: "#fdf0ee" },
    Alumbrado: { emoji: "💡", color: "#b7770d", bg: "#fef9ec" },
    Basura: { emoji: "🗑️", color: "#2d6a4f", bg: "#edf7f1" },
    Otros: { emoji: "📌", color: "#5c4a2a", bg: "#f5f0e8" },
  };

  const getMeta = (cat) => categoriaMeta[cat] || categoriaMeta["Otros"];

  return (
    <>
      {/* ── HERO ── */}
      <section className="ca-hero">
        <div className="ca-hero-texture" />
        <div className="ca-hero-content">
          <p className="ca-hero-eyebrow">🏔️ Salta · Argentina</p>
          <h1 className="ca-hero-title">
            Tu voz,
            <br />
            <em>nuestra Cachi</em>
          </h1>
          <p className="ca-hero-sub">
            Reportá problemas urbanos, seguí su resolución y ayudá a construir
            la comunidad que nos merecemos.
          </p>
          <div className="ca-hero-cta">
            {user ? (
              <button
                className="ca-btn-hero ca-btn-hero-primary"
                onClick={() => navigate("/reportar")}
              >
                ➕ Nuevo reporte
              </button>
            ) : (
              <>
                <button
                  className="ca-btn-hero ca-btn-hero-primary"
                  onClick={() => navigate("/registro")}
                >
                  Comenzar gratis
                </button>
                <button
                  className="ca-btn-hero ca-btn-hero-secondary"
                  onClick={() => navigate("/login")}
                >
                  Ya tengo cuenta
                </button>
              </>
            )}
          </div>

          <div className="ca-stats-bar">
            <div className="ca-stat">
              <div className="ca-stat-num">{reportes.length}</div>
              <div className="ca-stat-label">Reportes activos</div>
            </div>
            <div className="ca-stat">
              <div className="ca-stat-num">24h</div>
              <div className="ca-stat-label">Tiempo respuesta</div>
            </div>
            <div className="ca-stat">
              <div className="ca-stat-num">100%</div>
              <div className="ca-stat-label">Gratuito</div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave SVG */}
      <svg
        className="ca-wave"
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        style={{ background: "#3d2b1f" }}
        preserveAspectRatio="none"
        height="60"
        width="100%"
      >
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill="#fdf6ec"
        />
      </svg>

      {/* ── FEED DE REPORTES ── */}
      <div className="ca-section">
        <div className="ca-section-header">
          <h2 className="ca-section-title">
            Reportes <span>recientes</span>
          </h2>
          <div className="ca-filters">
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`ca-chip ${filtro === cat ? "active" : ""}`}
                onClick={() => setFiltro(cat)}
              >
                {cat === "Todos" ? "🗂 Todos" : `${getMeta(cat).emoji} ${cat}`}
              </button>
            ))}
          </div>
        </div>

        <div className="ca-grid">
          {loading ? (
            <div className="ca-loader">
              <div className="ca-spinner" />
              <p>CARGANDO REPORTES...</p>
            </div>
          ) : reportesFiltrados.length === 0 ? (
            <div className="ca-empty">
              <span className="ca-empty-icon">📭</span>
              <h4>No hay reportes aún</h4>
              <p>
                {filtro !== "Todos"
                  ? `No encontramos reportes de "${filtro}" todavía.`
                  : "¡Sé el primero en reportar un problema!"}
              </p>
            </div>
          ) : (
            reportesFiltrados.map((reporte) => {
              const meta = getMeta(reporte.categoria);
              const getEstadoColor = (estado) => {
                if (estado === "Resuelto") return "var(--verde)";
                if (estado === "En Proceso") return "#f1c40f";
                return "#f10f0f"; // Pendiente por defecto
              };
              return (
                <article key={reporte.id} className="ca-card">
                  {reporte.imageUrl ? (
                    <img
                      src={reporte.imageUrl}
                      className="ca-card-img"
                      alt="Evidencia"
                    />
                  ) : (
                    /* Opcional: Un fondo gris por si el usuario no subió foto */
                    <div className="ca-card-img bg-light d-flex align-items-center justify-content-center text-muted">
                      <span>📸 Sin imagen</span>
                    </div>
                  )}

                  <div className="ca-card-body">
                    <div className="ca-card-top">
                      <span
                        className="ca-badge"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        {meta.emoji} {reporte.categoria}
                      </span>
                      <span className="ca-date">
                        {new Date(reporte.createdAt).toLocaleDateString(
                          "es-AR",
                          { day: "numeric", month: "short" },
                        )}
                      </span>
                    </div>

                    <h3 className="ca-card-title">{reporte.titulo}</h3>
                    <p className="ca-card-desc">{reporte.descripcion}</p>

                    <div className="ca-card-footer">
                      <div className="ca-user-chip">
                        <div className="ca-user-dot">
                          {reporte.usuario?.nombre?.charAt(0) || "V"}
                        </div>
                        <span className="ca-user-name">
                          {reporte.usuario?.nombre || "Vecino"}
                        </span>
                      </div>
                      <span className="ca-status-pill">
                        <span
                          className="ca-status-dot"
                          style={{
                            backgroundColor: getEstadoColor(reporte.estado),
                          }}
                        />
                        {reporte.estado || "Pendiente"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="ca-footer">
        <p>
          <strong>Cachi Activa</strong> · Hecho con ❤️ por y para la comunidad
          cacheña · {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
};

export default Home;
