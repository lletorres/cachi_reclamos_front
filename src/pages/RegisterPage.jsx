import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { registerService } from "../services/api";
import "../styles/pages/RegisterPage.css";
import logoLogin from "../assets/images/logo-login1-comprimido.webp";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await registerService(formData);
      login(response.user, response.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* ── PANEL IZQUIERDO ── */}
      {/* auth-panel-left--registro define el gradiente invertido (verde → tierra) */}
      <div className="auth-panel-left auth-panel-left--registro">
        <div className="auth-left-content">
          <div className="auth-logo auth-logo--registro">CachiActiva</div>
          <div className="auth-tagline">Comunidad · Acción · Cambio</div>
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
            "Unite a quienes ya
            <br />
            están cambiando Cachi"
          </p>
          <p className="auth-quote-sub">
            En 3 simples pasos ya podés ser parte de la comunidad activa.
          </p>
          <div className="auth-steps">
            <div className="auth-step">
              <span className="auth-step-num">1</span>
              <span className="auth-step-text">
                <strong>Creá tu cuenta</strong> — solo necesitás nombre, mail y
                contraseña.
              </span>
            </div>
            <div className="auth-step">
              <span className="auth-step-num">2</span>
              <span className="auth-step-text">
                <strong>Reportá un problema</strong> — foto, categoría y
                descripción.
              </span>
            </div>
            <div className="auth-step">
              <span className="auth-step-num">3</span>
              <span className="auth-step-text">
                <strong>Hacé seguimiento</strong> — vemos juntos cómo avanza la
                solución.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PANEL DERECHO ── */}
      <div className="auth-panel-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            {/* auth-form-eyebrow--registro le da el color verde */}
            <p className="auth-form-eyebrow auth-form-eyebrow--registro">
              Únete a la comunidad
            </p>
            <h1 className="auth-form-title">
              Creá tu
              <br />
              cuenta
            </h1>
            <p className="auth-form-sub">
              Gratis, sin publicidad, para vecinos de Cachi.
            </p>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="nombre">
                Tu nombre
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                className="auth-input"
                placeholder="¿Cómo te llaman en el barrio?"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
              {formData.password.length > 0 && formData.password.length < 6 && (
                <p className="auth-hint">⚠️ Necesitás al menos 6 caracteres</p>
              )}
              {formData.password.length >= 6 && (
                <p className="auth-hint auth-hint--ok">✅ Contraseña válida</p>
              )}
            </div>

            {/* auth-submit-verde da el color verde al botón de Registro */}
            <button
              type="submit"
              className="auth-submit auth-submit-verde"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" /> Creando cuenta...
                </>
              ) : (
                "Crear cuenta gratis →"
              )}
            </button>

            <p className="auth-terms">
              Al registrarte aceptás usar la plataforma de forma responsable y
              con fines comunitarios.
            </p>
          </form>

          {/* auth-form-footer--registro agrega borde superior y link verde */}
          <div className="auth-form-footer auth-form-footer--registro">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
