import { useEffect, useState } from "react";

export interface Coordinates {
  lat: number;
  lng: number;
}

export const defaultCenter: Coordinates = { lat: -12.0469, lng: -75.0428 };

export const useGeolocation = () => {
  const [coords, setCoords] = useState<Coordinates>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocalización no soportada.");
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError("No se pudo obtener la ubicación");
        console.log("Error geolocation", err);
        setLoading(false);
      }
    );
  };

  // ejecutar al montar
  useEffect(() => {
    getLocation();
  }, []);

  return {
    coords,
    loading,
    error,
    refresh: getLocation,
  };
};
