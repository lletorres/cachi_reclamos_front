import { useState } from "react";
import { createReporte } from "../services/api";
import { useUser } from "../context/UserContext";

const ReportarIncidente = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "Otros",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes estar logueado para reportar");

    try {
      const dataParaEnviar = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        ubicacion: {
          latitud: formData.lat,
          longitud: formData.lng,
        },
      };

      await createReporte(dataParaEnviar);
      alert("✅ Reporte enviado correctamente a Obras Públicas");
      // Limpiar formulario
      setFormData({
        titulo: "",
        descripcion: "",
        categoria: "Otros",
        latitud: "",
        longitud: "",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>📢 Nuevo Reporte Ciudadano</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Título del problema</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: Bache en calle Salta"
            value={formData.titulo}
            onChange={(e) =>
              setFormData({ ...formData, titulo: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
          >
            <option value="Alumbrado">Alumbrado</option>
            <option value="Bacheo">Bacheo</option>
            <option value="Basura">Basura</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción detallada</label>
          <textarea
            className="form-control"
            rows="3"
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100">
          Enviar Reporte
        </button>
      </form>
    </div>
  );
};

export default ReportarIncidente;
