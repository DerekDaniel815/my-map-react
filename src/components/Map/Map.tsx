import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import {
  defaultCenter, type Coordinates
} from "../../hooks/maps.hooks";
import "./Map.scss";
interface MapProps {
  coords: Coordinates | undefined;
  markers: Coordinates[];
  directions: google.maps.DirectionsResult | null;
}

export default function Map({ coords, markers, directions }: MapProps) {
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
          <Marker
            key={index}
            position={marker}
            label={(index + 1).toString()}
          />
        ))}

      {/* Si hay ruta real, usamos directionsRenderer */}
      {directions && (
        <DirectionsRenderer
          options={{
            directions,
            suppressMarkers: true, // usamos  tus Markers personalizados
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
