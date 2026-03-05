import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import logo_muni from "../assets/images/logo-municipalidad-cachi.webp";

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // 🍔 Estado para controlar el menú en celulares
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Cerramos el menú al salir
    navigate("/");
  };

  // Función para cerrar el menú al hacer clic en cualquier link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="ca-navbar">
      {/* ── LOGO INSTITUCIONAL + NOMBRE DEL PROYECTO ── */}
      <Link to="/" className="ca-brand" onClick={closeMenu}>
        <img src={logo_muni} alt="Escudo de Cachi" className="ca-logo-img" />

        <div className="ca-brand-titles">
          {/* Parte Municipal */}
          <div className="ca-muni-group">
            <span className="ca-muni-top">Municipalidad de</span>
            <span className="ca-muni-bottom">Cachi</span>
          </div>

          {/* Parte del Proyecto */}
          <div className="ca-project-name">
            <span className="ca-project-top">Secretaría de</span>
            <span className="ca-project-bottom">Obras Públicas</span>
          </div>
        </div>
      </Link>

      {/* ── BOTÓN HAMBURGUESA (Solo visible en móviles) ── */}
      <button
        className="ca-menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menú"
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>

      {/* ── LINKS DEL MENÚ ── */}
      <div className={`ca-nav-actions ${isMenuOpen ? "open" : ""}`}>
        {/* 🌟 NUEVO BOTÓN DE INICIO (Visible siempre) */}
        <Link to="/" className="nb nb-ghost" onClick={closeMenu}>
          Inicio
        </Link>

        {user ? (
          <>
            <Link to="/reportar" className="nb nb-fill" onClick={closeMenu}>
              ➕ Reportar
            </Link>

            {user.rol === "admin" && (
              <Link to="/admin" className="nb nb-outline" onClick={closeMenu}>
                🛡️ Panel Admin
              </Link>
            )}

            <div className="ca-user-pill">
              <div className="ca-avatar-sm">
                {user.nombre ? user.nombre.charAt(0).toUpperCase() : "V"}
              </div>
              <span className="ca-user-pill-name">{user.nombre}</span>
            </div>

            <button onClick={handleLogout} className="nb nb-ghost">
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nb nb-ghost" onClick={closeMenu}>
              Ingresar
            </Link>
            <Link to="/registro" className="nb nb-fill" onClick={closeMenu}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
