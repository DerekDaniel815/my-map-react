import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: -12.0464, lng: -77.0428 }; // Lima de ejemplo

export default function Map() {
  const [currentPos, setCurrentPos] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_API_KEY_MAPS as string,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log(pos);
          setCurrentPos({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.log("Error geolocation", err);
        }
      );
    }
  }, []);

  if (!isLoaded) return <p className="text-white">Cargando mapa...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={currentPos} zoom={15}>
      <Marker position={currentPos} />
    </GoogleMap>
  );
}
