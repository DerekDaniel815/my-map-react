import { useEffect, useState } from "react";
import type { MarkerCardProps } from "../components/MarkerList/MarkerList";

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

export interface RouteInfo {
  distanceMeters: number;
  durationSeconds: number;
}

export const useDirections = (markers: MarkerCardProps[]) => {
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  useEffect(() => {
    if (!markers || markers.length < 2) {
      setDirections(null);
      setRouteInfo(null);
      return;
    }

    const g = (window as any).google as typeof google | undefined;
    if (!g) return;

    const origin: Coordinates = {
      lat: markers[0].coords.lat,
      lng: markers[0].coords.lng,
    };

    const destination: Coordinates = {
      lat: markers[markers.length - 1].coords.lat,
      lng: markers[markers.length - 1].coords.lng,
    };

    const waypoints =
      markers.length > 2
        ? markers.slice(1, -1).map((m) => ({
            location: { lat: m.coords.lat, lng: m.coords.lng },
            stopover: true,
          }))
        : [];

    const directionsService = new g.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: g.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === g.maps.DirectionsStatus.OK && result) {
          setDirections(result);

          // calcular info básica de ruta distancia y tiempo usar mas adelante !!!!!!!!!
          const legs = result.routes[0]?.legs ?? [];
          const distanceMeters = legs.reduce(
            (sum, leg) => sum + (leg.distance?.value ?? 0),
            0
          );
          const durationSeconds = legs.reduce(
            (sum, leg) => sum + (leg.duration?.value ?? 0),
            0
          );

          setRouteInfo({ distanceMeters, durationSeconds });
        } else {
          console.error("Directions request failed:", status);
          setDirections(null);
          setRouteInfo(null);
        }
      }
    );
  }, [markers]);

  return {
    directions,
    routeInfo,
  };
};