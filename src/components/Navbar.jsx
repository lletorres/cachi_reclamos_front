import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ROUTE_LABELS = {
  "/": null,
  "/login": "Iniciar sesión",
  "/registro": "Crear cuenta",
  "/reportar": "Nuevo reporte",
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const isHome = location.pathname === "/";
  const pageLabel = ROUTE_LABELS[location.pathname];

  return (
    <nav className="ca-navbar">
      {/* ── BRAND ── */}
      <a
        className="ca-brand"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        Cachi<span className="ca-brand-accent">Activa</span>
      </a>

      {/* ── BREADCRUMB ── */}
      <div className="ca-nav-center">
        {!isHome && pageLabel && (
          <div className="ca-breadcrumb">
            <span className="ca-breadcrumb-link" onClick={() => navigate("/")}>
              Inicio
            </span>
            <span className="ca-breadcrumb-sep">›</span>
            <span className="ca-breadcrumb-current">{pageLabel}</span>
          </div>
        )}
      </div>

      {/* ── ACCIONES ── */}
      <div className="ca-nav-actions">
        {user ? (
          <>
            {!isHome && (
              <button className="nb nb-back" onClick={() => navigate("/")}>
                ← Inicio
              </button>
            )}
            {isHome && (
              <button
                className="nb nb-fill"
                onClick={() => navigate("/reportar")}
              >
                + Reportar
              </button>
            )}
            <div className="ca-user-pill">
              <div className="ca-avatar-sm">
                {user.nombre?.charAt(0).toUpperCase()}
              </div>
              <span className="ca-user-pill-name">{user.nombre}</span>
            </div>
            <button className="nb nb-ghost" onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <>
            {!isHome && (
              <button className="nb nb-back" onClick={() => navigate("/")}>
                ← Inicio
              </button>
            )}
            {isHome && (
              <>
                <button
                  className="nb nb-outline"
                  onClick={() => navigate("/login")}
                >
                  Ingresar
                </button>
                <button
                  className="nb nb-fill"
                  onClick={() => navigate("/registro")}
                >
                  Registrarse
                </button>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
