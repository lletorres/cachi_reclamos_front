import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Para cambiar de página
import { useUser } from "../context/UserContext"; // Para guardar el usuario
import { loginService } from "../services/api"; // El servicio que acabamos de crear

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useUser(); // Traemos la función login del contexto

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiamos errores viejos

    try {
      // 1. Llamamos al Backend
      const response = await loginService(formData.email, formData.password);

      // 2. Si todo sale bien, guardamos en el Contexto
      // response trae: { user: {...}, token: "..." }
      login(response.user, response.token);

      // 3. Redirigimos al Home
      navigate("/");
    } catch (err) {
      setError(err.message); // Mostramos el error si falla (ej: "Contraseña incorrecta")
    }
  };

  return (
    <div className="card-custom">
      <h2 className="text-center mb-4">🔐 Iniciar Sesión</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="ejemplo@cachi.com"
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

        <button type="submit" className="btn btn-primary w-100 mb-3">
          Ingresar
        </button>

        <div className="text-center">
          <small>
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </small>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
