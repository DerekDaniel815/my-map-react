import { GoogleMap, Marker } from "@react-google-maps/api";
import { defaultCenter, type Coordinates } from "../../hooks/maps.hooks";

const containerStyle = {
  width: "600px",
  height: "400px",
};

interface MapProps {
  coords: Coordinates | undefined;
  markers: Coordinates[];
}

export default function Map({ coords, markers }: MapProps) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={coords ?? defaultCenter}
      zoom={15}
    >
      {markers &&
        markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
    </GoogleMap>
  );
}
