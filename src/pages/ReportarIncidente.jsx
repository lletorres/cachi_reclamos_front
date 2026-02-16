import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { createReporte } from "../services/api";
import "../styles/pages/ReportarIncidente.css";

const CATEGORIAS = [
  { id: "Bacheo", emoji: "🛣️", label: "Bacheo", desc: "Baches y calzada" },
  {
    id: "Alumbrado",
    emoji: "💡",
    label: "Alumbrado",
    desc: "Luminarias y luz",
  },
  { id: "Basura", emoji: "🗑️", label: "Basura", desc: "Residuos y limpieza" },
  { id: "Otros", emoji: "📌", label: "Otros", desc: "Otro tipo de problema" },
];

export default function ReportarIncidente() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    descripcion: "",
    imagen: null,
  });

  // ── Validación ────────────────────────────────────────────────────────────
  const tituloOk = formData.titulo.trim().length >= 6;
  const catOk = formData.categoria !== "";
  const descOk = formData.descripcion.trim().length >= 15;
  const formValid = tituloOk && catOk && descOk;

  const step = !tituloOk ? 1 : !catOk ? 2 : !descOk ? 2 : 3;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imagen: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await createReporte(formData);
      navigate("/");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Sin sesión ────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="rp-shell">
        <div className="rp-container">
          <div className="rp-not-logged">
            <span className="icon">🔐</span>
            <h3>Necesitás iniciar sesión</h3>
            <p>Para reportar un problema debés tener una cuenta activa.</p>
            <button
              className="rp-not-logged-btn"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rp-shell">
      <div className="rp-container">
        {/* ── ENCABEZADO ── */}
        <div className="rp-header">
          <p className="rp-eyebrow">Participación ciudadana</p>
          <h1 className="rp-title">Nuevo reporte</h1>
          <p className="rp-sub">
            Contanos qué problema encontraste y ayudamos a resolverlo.
          </p>
        </div>

        {/* ── PROGRESS ── */}
        <div className="rp-progress">
          <div className={`rp-step ${step > 1 ? "done" : "active"}`}>
            <span className="rp-step-num">{step > 1 ? "✓" : "1"}</span>
            <span className="rp-step-label">Título</span>
          </div>
          <div className="rp-step-line">
            <div className={`rp-step-line-fill ${step > 1 ? "full" : ""}`} />
          </div>
          <div
            className={`rp-step ${step > 2 ? "done" : step === 2 ? "active" : "idle"}`}
          >
            <span className="rp-step-num">{step > 2 ? "✓" : "2"}</span>
            <span className="rp-step-label">Detalle</span>
          </div>
          <div className="rp-step-line">
            <div className={`rp-step-line-fill ${step > 2 ? "full" : ""}`} />
          </div>
          <div
            className={`rp-step ${formValid ? "done" : step === 3 ? "active" : "idle"}`}
          >
            <span className="rp-step-num">{formValid ? "✓" : "3"}</span>
            <span className="rp-step-label">Listo</span>
          </div>
        </div>

        {/* ── CARD ── */}
        <form onSubmit={handleSubmit}>
          <div className="rp-card">
            {/* Sección 1 — Descripción */}
            <div className="rp-section">
              <div className="rp-section-title">
                📝 Descripción del problema
              </div>

              <div className="rp-field">
                <div className="rp-label-row">
                  <label className="rp-label" htmlFor="titulo">
                    Título del problema
                  </label>
                  <span
                    className={`rp-field-status ${tituloOk ? "ok" : "empty"}`}
                  >
                    {tituloOk ? "✅ Listo" : "Mín. 6 caracteres"}
                  </span>
                </div>
                <input
                  id="titulo"
                  type="text"
                  className={`rp-input ${tituloOk ? "valid" : ""}`}
                  placeholder="Ej: Bache peligroso en Av. San Martín"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  required
                />
              </div>

              <div className="rp-field">
                <div className="rp-label-row">
                  <label className="rp-label" htmlFor="descripcion">
                    Descripción detallada
                  </label>
                  <span
                    className={`rp-field-status ${descOk ? "ok" : "empty"}`}
                  >
                    {descOk
                      ? "✅ Listo"
                      : `${formData.descripcion.length}/15 mín.`}
                  </span>
                </div>
                <textarea
                  id="descripcion"
                  className={`rp-textarea ${descOk ? "valid" : ""}`}
                  placeholder="¿Dónde exactamente? ¿Hace cuánto? ¿Qué tan urgente es?"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  maxLength={500}
                  required
                />
                <div
                  className={`rp-char-counter ${formData.descripcion.length > 450 ? "warn" : ""}`}
                >
                  {formData.descripcion.length}/500
                </div>
              </div>
            </div>

            {/* Sección 2 — Categoría */}
            <div className="rp-section">
              <div className="rp-section-title">
                🏷️ Categoría
                {catOk && <span className="rp-cat-ok">✅ Seleccionada</span>}
              </div>
              <div className="rp-cat-grid">
                {CATEGORIAS.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    className={`rp-cat-pill ${formData.categoria === cat.id ? "selected" : ""}`}
                    onClick={() =>
                      setFormData({ ...formData, categoria: cat.id })
                    }
                  >
                    <span className="rp-cat-emoji">{cat.emoji}</span>
                    <span className="rp-cat-info">
                      <span className="rp-cat-name">{cat.label}</span>
                      <span className="rp-cat-desc">{cat.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sección 3 — Foto */}
            <div className="rp-section">
              <div className="rp-section-title">
                📸 Evidencia fotográfica
                <span className="rp-section-optional">
                  (opcional, ayuda mucho)
                </span>
              </div>

              {!preview ? (
                <div className="rp-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <span className="rp-upload-icon">📷</span>
                  <p className="rp-upload-text">
                    <strong>Tocá para subir</strong> o arrastrá una foto
                  </p>
                  <p className="rp-upload-sub">JPG, PNG o WEBP · Máx. 5 MB</p>
                </div>
              ) : (
                <div className="rp-preview">
                  <img src={preview} alt="Vista previa" />
                  <div className="rp-preview-overlay">
                    <span className="rp-preview-label">✅ Foto adjunta</span>
                    <button
                      type="button"
                      className="rp-preview-remove"
                      onClick={() => {
                        setPreview(null);
                        setFormData({ ...formData, imagen: null });
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="rp-cta-section">
              <div className="rp-submit-checklist">
                <span className={`rp-check-item ${tituloOk ? "done" : "pend"}`}>
                  {tituloOk ? "✓" : "○"} Título
                </span>
                <span className={`rp-check-item ${catOk ? "done" : "pend"}`}>
                  {catOk ? "✓" : "○"} Categoría
                </span>
                <span className={`rp-check-item ${descOk ? "done" : "pend"}`}>
                  {descOk ? "✓" : "○"} Descripción
                </span>
                <span className={`rp-check-item ${preview ? "done" : "pend"}`}>
                  {preview ? "✓" : "○"} Foto (opcional)
                </span>
              </div>

              <button
                type="submit"
                className="rp-submit"
                disabled={!formValid || loading}
              >
                {loading ? (
                  <>
                    <span className="rp-spinner" /> Enviando reporte...
                  </>
                ) : formValid ? (
                  "📤 Enviar reporte a la comunidad"
                ) : (
                  "Completá los campos requeridos"
                )}
              </button>

              <p className="rp-submit-hint">
                Tu reporte será visible para toda la comunidad de Cachi.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
