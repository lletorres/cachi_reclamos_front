import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { createReporte } from "../services/api";

const ReportarIncidente = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [preview, setPreview] = useState(null); // Para la miniatura de la foto
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "Otros",
    descripcion: "",
    imagen: null,
  });

  // Manejador de la imagen para generar la vista previa
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imagen: file });
      setPreview(URL.createObjectURL(file)); // Crea una URL temporal para la imagen
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión");

    try {
      // Por ahora enviamos como JSON, luego ajustaremos si usas FormData para archivos reales
      await createReporte(formData);
      alert("Reporte enviado con éxito");
      navigate("/");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card-custom mx-auto" style={{ maxWidth: "650px" }}>
        <header className="mb-4">
          <h2 className="fw-bold">🚀 Nuevo Reporte</h2>
          <p className="text-muted">
            Completa los detalles para ayudarnos a mejorar Cachi.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Título */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Título del problema
            </label>
            <input
              type="text"
              className="form-control bg-light border-0 p-3"
              placeholder="Ej: Alumbrado fundido en Plaza Central"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              required
            />
          </div>

          {/* Categoría */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Categoría</label>
            <select
              className="form-select bg-light border-0 p-3"
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
              }
            >
              <option value="Bacheo">Bacheo</option>
              <option value="Alumbrado">Alumbrado</option>
              <option value="Basura">Basura</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Descripción detallada
            </label>
            <textarea
              className="form-control bg-light border-0 p-3"
              rows="3"
              placeholder="Danos más contexto sobre el problema..."
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              required
            ></textarea>
          </div>

          {/* Sección de Foto con Preview */}
          <div className="mb-4">
            <label className="form-label fw-semibold d-block">
              📸 Evidencia Fotográfica
            </label>
            <div
              className="upload-area border rounded-3 p-4 text-center bg-light"
              style={{ borderStyle: "dashed !important" }}
            >
              {!preview ? (
                <>
                  <input
                    type="file"
                    id="fileUpload"
                    className="d-none"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="btn btn-outline-primary px-4"
                  >
                    Seleccionar Imagen
                  </label>
                </>
              ) : (
                <div className="position-relative">
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="img-fluid rounded-3 mb-2"
                    style={{ maxHeight: "250px" }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                    onClick={() => {
                      setPreview(null);
                      setFormData({ ...formData, imagen: null });
                    }}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm"
          >
            Enviar Reporte
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportarIncidente;
