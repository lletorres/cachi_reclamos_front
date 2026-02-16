import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Arreglo para el icono de los pines (Leaflet a veces tiene bugs con los iconos por defecto en React)
const icon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapaReportes = ({ reportes }) => {
  // Coordenadas centrales de Cachi, Salta
  const centroCachi = [-25.1214, -66.1631];

  return (
    <div
      className="map-container mb-4 shadow-sm"
      style={{ height: "400px", borderRadius: "15px", overflow: "hidden" }}
    >
      <MapContainer
        center={centroCachi}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {reportes.map(
          (reporte) =>
            // Solo mostramos el marcador si tiene coordenadas válidas
            reporte.ubicacion &&
            reporte.ubicacion.lat && (
              <Marker
                key={reporte._id}
                position={[reporte.ubicacion.lat, reporte.ubicacion.lng]}
                icon={icon}
              >
                <Popup>
                  <strong>{reporte.titulo}</strong> <br />
                  <span className="badge bg-primary">
                    {reporte.categoria}
                  </span>{" "}
                  <br />
                  {reporte.descripcion}
                </Popup>
              </Marker>
            ),
        )}
      </MapContainer>
    </div>
  );
};

export default MapaReportes;
