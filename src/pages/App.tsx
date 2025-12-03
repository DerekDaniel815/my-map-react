import { useJsApiLoader } from "@react-google-maps/api";
import Map from "../components/Map/Map";
import { useGeolocation, type Coordinates } from "../hooks/maps.hooks";
import { useEffect, useState } from "react";
import SearchBox from "../components/searchBox/searchBox";
import MarkerCard from "../components/MarkerCard/MarkerCard";

const App = () => {
  const { coords, loading, error, refresh } = useGeolocation();
  const [markets, setMarkers] = useState<Coordinates[]>([]);
  const [center, setCenter] = useState<Coordinates | undefined>(undefined);

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
  }

  if (!isLoaded) return <p className="text-white">Cargando mapa...</p>;
  return (
    <div className="container">
      <h1>Mapa</h1>
      {loading && <p>Cargando ubicacion...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && coords ? (
        <>
          <p>Lat: {coords.lat}</p>
          <p>Lng: {coords.lng}</p>
        </>
      ) : (
        <>No hay coordenadas disponibles.</>
      )}

      <button onClick={refresh}>Actualizar ubicación</button>

      <SearchBox onSelectPlace={handleSelectFromSearch} />

      <div className="map-layout">
        <aside className="marker-list">
          <h2 className="marker-list-title">Lugares marcados</h2>

          {markets.length === 0 ? (
            <p className="marker-list-empty">
              Aun no tienes lugares guardados.
            </p>
          ) : (
            markets.map((m, index) => (
              <MarkerCard
                key={index}
                index={index}
                coords={m}
                onRemove={() => handleRemoveMarker(index)}
              />
            ))
          )}
        </aside>

        <div className="map-container">
          <Map coords={center} markers={markets} />
        </div>
      </div>
    </div>
  );
};

export default App;
