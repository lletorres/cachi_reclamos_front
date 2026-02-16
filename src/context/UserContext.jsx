import { createContext, useContext, useState, useEffect } from "react";

// 1. CREAR EL CONTEXTO (LA "NUBE")
// Esto crea un espacio vacío donde podremos poner datos globales.
// Es como crear un grupo de WhatsApp vacío antes de meter gente.
const UserContext = createContext();

// 2. EL COMPONENTE PROVEEDOR (LA "ANTENA")
// Este componente va a envolver a toda tu aplicación (en main.jsx).
// La prop "children" representa a todos los componentes que estarán adentro (App, Home, Reportar, etc).
export const UserProvider = ({ children }) => {
  // 3. EL ESTADO (LA MEMORIA DE CORTO PLAZO)
  // Aquí vive la información del usuario mientras la pestaña está abierta.
  // Inicia en 'null' porque asumimos que nadie ha entrado todavía.
  const [user, setUser] = useState(null);

  // 4. EL EFECTO DE PERSISTENCIA (LA MEMORIA A LARGO PLAZO)
  // Este bloque se ejecuta AUTOMÁTICAMENTE una sola vez cuando recargas la página (F5).
  useEffect(() => {
    // A. Preguntamos al navegador: "¿Tienes algún usuario guardado en el bolsillo?"
    const storedUser = sessionStorage.getItem("user");

    // B. Si el navegador dice "Sí, aquí está", lo restauramos en la memoria de React.
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Convertimos el texto guardado a un Objeto real
    }
  }, []); // Los corchetes vacíos [] aseguran que esto solo pase al arrancar la app.

  // 5. FUNCIÓN DE LOGIN (ENTRAR)
  // Recibe los datos del usuario y su carnet (token) desde el Backend.
  const login = (userData, token) => {
    // A. Guardamos en el navegador (SessionStorage) para que no se borre si recargas.
    // JSON.stringify convierte el objeto {nombre: "Juan"} a texto plano para poder guardarlo.
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token);

    // B. Actualizamos el estado de React para que la pantalla cambie (aparezca el nombre, etc).
    setUser(userData);
  };

  // 6. FUNCIÓN DE LOGOUT (SALIR)
  // Borra todo rastro del usuario.
  const logout = () => {
    // A. Limpiamos el navegador
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    // B. Limpiamos la memoria de React (la pantalla vuelve a mostrar "Iniciar Sesión")
    setUser(null);
  };

  return (
    // 7. PROVEER LOS DATOS (EMITIR LA SEÑAL)
    // En la propiedad "value" ponemos todo lo que queremos compartir con el resto de la app.
    // Cualquier componente hijo podrá usar: 'user', 'login' y 'logout'.
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 8. EL HOOK PERSONALIZADO (EL ATAJO)
// Creamos esto para no tener que importar 'useContext' y 'UserContext' en cada archivo.
// Simplemente escribes "useUser()" en cualquier componente y listo.
export const useUser = () => useContext(UserContext);
