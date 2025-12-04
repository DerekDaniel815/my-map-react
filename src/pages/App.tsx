import { useJsApiLoader } from "@react-google-maps/api";
import Map from "../components/Map/Map";
import {
  useDirections,
  useGeolocation,
  type Coordinates,
} from "../hooks/maps.hooks";
import { useEffect, useState } from "react";
import SearchBox from "../components/searchBox/searchBox";
import MarkerList from "../components/MarkerList/MarkerList";

const App = () => {
  const { coords, loading, error, refresh } = useGeolocation();
  const [markets, setMarkers] = useState<Coordinates[]>([]);
  const [center, setCenter] = useState<Coordinates | undefined>(undefined);
  const { directions, routeInfo } = useDirections(markets);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_API_KEY_MAPS as string,
    libraries: ["places"],
  });

  useEffect(() => {
    if (coords) {
      setCenter(coords);
      setMarkers((prev) => (prev.length === 0 ? [coords] : prev));
    }
  }, [coords]);

  const addPosition = (newPos: Coordinates, setAsCenter = true) => {
    setMarkers((prev) => {
      if (prev.length === 0) return [newPos];

      const last = prev[prev.length - 1];

      // validacion para no duplicar
      const isSame = last.lat === newPos.lat && last.lng === newPos.lng;

      if (isSame) return prev; // no agregar

      return [...prev, newPos];
    });

    if (setAsCenter) {
      setCenter(newPos);
    }
  };

  const handleSelectFromSearch = (newPos: Coordinates) => {
    addPosition(newPos, true);
  };

  const handleRemoveMarker = (index: number) => {
    setMarkers((prev) => {
      const newMarkers = prev.filter((_, i) => i !== index);
      return newMarkers;
    });
  };

  const handleReorderMarkers = (newOrder: Coordinates[]) => {
    setMarkers(newOrder);
  };

  if (!isLoaded) return <p className="text-white">Cargando mapa...</p>;
  return (
    <div className="app">
      {/* Mapa a pantalla completa de fondo */}
      <div className="app__map-bg">
        <Map coords={center} markers={markets} directions={directions} />
      </div>

      {/* Overlay con toda la UI */}
      <div className="app__overlay">
        <header className="app__header">
          <div>
            <h1 className="app__title">Explora el mapa</h1>
            <p className="app__subtitle">
              Guarda tus lugares favoritos y vuelve a ellos cuando quieras.
            </p>
          </div>

          {routeInfo && (
            <div className="app__route-info">
              <p>
                Distancia total: {(routeInfo.distanceMeters / 1000).toFixed(2)}{" "}
                km
              </p>
              <p>
                Tiempo estimado: {(routeInfo.durationSeconds / 60).toFixed(1)}{" "}
                min
              </p>
            </div>
          )}
        </header>

        <section className="app__controls">
          <div className="app__status">
            {loading && (
              <p className="app__status-text">Cargando ubicación...</p>
            )}
            {error && (
              <p className="app__status-text app__status-text--error">
                {error}
              </p>
            )}

            {!loading && !error && coords ? (
              <div className="app__coords">
                <span className="app__coords-label">Lat:</span>
                <span className="app__coords-value">{coords.lat}</span>
                <span className="app__coords-label">Lng:</span>
                <span className="app__coords-value">{coords.lng}</span>
              </div>
            ) : (
              <p className="app__status-text app__status-text--muted">
                No hay coordenadas disponibles.
              </p>
            )}
          </div>

          <div className="app__actions">
            <button className="btn btn--primary" onClick={refresh}>
              Actualizar ubicación
            </button>
          </div>

          <div className="app__search">
            <SearchBox onSelectPlace={handleSelectFromSearch} />
          </div>
        </section>

        <section className="map-layout">
          <div className="map-layout__sidebar">
            <MarkerList
              markers={markets}
              onRemoveMarker={handleRemoveMarker}
              onReorder={handleReorderMarkers}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
