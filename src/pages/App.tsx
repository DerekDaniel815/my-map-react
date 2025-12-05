import { useJsApiLoader } from "@react-google-maps/api";
import Map from "../components/Map/Map";
import {
  useDirections,
  useGeolocation,
  type Coordinates,
} from "../hooks/maps.hooks";
import { use, useEffect, useState } from "react";
import SearchBox from "../components/searchBox/searchBox";
import MarkerList, {
  type MarkerCardProps,
} from "../components/MarkerList/MarkerList";

const App = () => {
  const { coords, loading, error, refresh } = useGeolocation();
  const [markers, setMarkers] = useState<MarkerCardProps[]>([]);
  const [center, setCenter] = useState<Coordinates | undefined>(undefined);
  const { directions, routeInfo } = useDirections(markers);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_API_KEY_MAPS as string,
    libraries: ["places"],
  });

  useEffect(() => {
    if (coords) {
      setCenter(coords);
      setMarkers((prev) =>
        prev.length === 0 ? [{ name: "Mi ubicación", coords }] : prev
      );
    }
  }, [coords]);

  const addPosition = (newPos: MarkerCardProps, setAsCenter = true) => {
    setMarkers((prev) => {
      if (prev.length === 0) return [newPos];

      const last = prev[prev.length - 1];

      // validacion para no duplicar
      const isSame =
        last.coords.lat === newPos.coords.lat &&
        last.coords.lng === newPos.coords.lng;

      if (isSame) return prev; // no agregar

      return [...prev, newPos];
    });

    if (setAsCenter) {
      setCenter(newPos.coords);
    }
  };

  const handleSelectFromSearch = (newPos: MarkerCardProps) => {
    addPosition(newPos, true);
  };

  const handleRemoveMarker = (index: number) => {
    setMarkers((prev) => {
      const newMarkers = prev.filter((_, i) => i !== index);
      return newMarkers;
    });
  };

  const handleReorderMarkers = (newOrder: MarkerCardProps[]) => {
    setMarkers(newOrder);
  };

  const formatMarkerCarToCoords = (
    markers: MarkerCardProps[]
  ): Coordinates[] => {
    return markers.map((m, i) => {
      return { ...m.coords };
    });
  };

  if (!isLoaded) return <p className="text-white">Cargando mapa...</p>;
  return (
    <div className="app">
      {/* Mapa a pantalla completa de fondo */}
      <div className="app__map-bg">
        <Map
          coords={center}
          markers={formatMarkerCarToCoords(markers)}
          directions={directions}
        />
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
          <div className="app__search">
            <SearchBox onSelectPlace={handleSelectFromSearch} />
          </div>
          <div className="app__status-actions">
            <button className="btn btn--primary" onClick={refresh}>
              Mi ubicación
            </button>
          </div>
        </section>

        <section className="map-layout">
          <div className="map-layout__sidebar">
            <MarkerList
              markerCards={markers}
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
