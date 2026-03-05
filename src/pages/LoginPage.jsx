import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginService } from "../services/api";
import "../styles/pages/LoginPage.css";
import logoLogin from "../assets/images/logo-login1-comprimido.webp";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginService(formData.email, formData.password);
      login(response.user, response.token);

      // 🌟 NUEVA LÓGICA DE REDIRECCIÓN INTELIGENTE
      // Asumiendo que tu base de datos guarda el rol en la propiedad "rol" o "role"
      const userRole = response.user.rol;

      if (userRole === "admin" || userRole === "administrador") {
        navigate("/admin"); // Lo mandamos directo a su oficina virtual
      } else {
        navigate("/"); // Es un vecino, va al Home
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* ── PANEL IZQUIERDO ── */}
      {/* auth-panel-left--login define el gradiente específico de esta página */}
      <div className="auth-panel-left auth-panel-left--login">
        <div className="auth-panel-left-texture" />
        <div className="auth-left-content">
          <div className="auth-logo auth-logo--login">CachiActiva</div>
          <div className="auth-tagline">Salta · Argentina</div>
          <div className="auth-logo-mountain">
            <img
              src={logoLogin}
              alt="Logo Cachi Activa"
              style={{
                width: "180px",
                height: "auto",
                opacity: 0.8,
                margin: "0.5rem 0" /* 👈 Le da un respiro arriba y abajo */,
                filter:
                  "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))" /* 👈 Magia: sombra suave */,
              }}
            />
          </div>
          <p className="auth-quote">
            "La participación ciudadana
            <br />
            construye comunidad"
          </p>
          <p className="auth-quote-sub">
            Cada reporte que enviás ayuda a mejorar la vida de tus vecinos.
          </p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <span className="auth-feature-icon">📍</span>
              Reportes en tiempo real
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">🔔</span>
              Notificaciones cuando tu reporte avanza
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">🌿</span>
              Plataforma 100% gratuita para vecinos
            </div>
          </div>
        </div>
      </div>

      {/* ── PANEL DERECHO ── */}
      <div className="auth-panel-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            {/* auth-form-eyebrow--login le da el color ocre */}
            <p className="auth-form-eyebrow auth-form-eyebrow--login">
              Bienvenido de vuelta
            </p>
            <h1 className="auth-form-title">
              Iniciá
              <br />
              sesión
            </h1>
            <p className="auth-form-sub">
              Ingresá para ver y gestionar tus reportes.
            </p>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="auth-input"
                placeholder="vos@cachi.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="auth-input"
                placeholder="Tu contraseña secreta"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* auth-submit-ocre da el color naranja al botón de Login */}
            <button
              type="submit"
              className="auth-submit auth-submit-ocre"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" /> Verificando...
                </>
              ) : (
                "Ingresar a Cachi Activa →"
              )}
            </button>
          </form>

          <div className="auth-divider">ó</div>

          <div className="auth-form-footer">
            ¿No tenés cuenta? <Link to="/registro">Registrate gratis</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
