import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Usamos Link para navegación interna
import { useUser } from "../context/UserContext";
import { registerService } from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Enviamos los datos al Backend
      const response = await registerService(formData);

      // 2. Si sale bien, el backend nos devuelve el usuario y el token
      // ¡Lo logueamos automáticamente! 🚀
      login(response.user, response.token);

      // 3. Vamos al Home
      alert("¡Bienvenido a Cachi Activa!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card-custom">
      <h2 className="text-center mb-4">📝 Crear Cuenta</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre Completo</label>
          <input
            type="text"
            name="nombre" // Importante: debe coincidir con el estado
            className="form-control"
            placeholder="Juan Pérez"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="juan@cachi.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="******"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 mb-3">
          Registrarse
        </button>

        <div className="text-center">
          <small>
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
          </small>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
