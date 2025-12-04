import { DirectionsRenderer, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { defaultCenter, type Coordinates } from "../../hooks/maps.hooks";
import "./Map.css";
import { useEffect, useState } from "react";
interface MapProps {
  coords: Coordinates | undefined;
  markers: Coordinates[];
}

export default function Map({ coords, markers }: MapProps) {
  const [directions, setDirections] =
  useState<google.maps.DirectionsResult | null>(null); //para rutas reales

  useEffect(() => {
    // Si no hay al menos 2 puntos, no hay ruta
    if (markers.length < 2) {
      setDirections(null);
      return;
    }

    const g = (window as any).google as typeof google | undefined;
    if (!g) return;

    const origin: Coordinates = {
      lat: markers[0].lat,
      lng: markers[0].lng,
    };

    const destination: Coordinates = {
      lat: markers[markers.length - 1].lat,
      lng: markers[markers.length - 1].lng,
    };

    const waypoints =
      markers.length > 2
        ? markers.slice(1, -1).map((m) => ({
            location: { lat: m.lat, lng: m.lng },
            stopover: true,
          }))
        : [];

    console.log("waypoints", waypoints);

    const directionsService = new g.maps.DirectionsService(); // servicio de rutas reales

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: g.maps.TravelMode.DRIVING, // WALKING, BICYCLING, etc.
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === g.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
          setDirections(null);
        }
      }
    );
  }, [markers]);

  return (
    <GoogleMap
      mapContainerClassName="map-container__inner"
      center={coords ?? defaultCenter}
      zoom={15}
      options={{
        disableDefaultUI: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {markers &&
        markers.map((marker, index) => (
          <Marker key={index} position={marker} label={(index + 1).toString()}/>
        ))}

      {/* solo lineas de distancia  */}
      {markers.length >= 2 && (
        <Polyline
          path={markers.map((m) => (m))}
          options={{
            strokeOpacity: 0.9,
            strokeWeight: 4,
            strokeColor: "#22c55e", // verde
            clickable: false,
            geodesic: true,
          }}
        />
      )}

      {/* Si hay ruta real, usamos DirectionsRenderer */}
      {directions && (
        <DirectionsRenderer
          options={{
            directions,
            suppressMarkers: true, // usamos tus Markers personalizados
            polylineOptions: {
              strokeColor: "#c5c222ff",
              strokeOpacity: 0.95,
              strokeWeight: 4,
            },
          }}
        />
      )}

    </GoogleMap>
  );
}
