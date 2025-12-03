import { Autocomplete } from "@react-google-maps/api";
import { useState } from "react";
import type { Coordinates } from "../../hooks/maps.hooks";

declare const google: any; // para que TS no moleste

interface SearchBoxProps {
  onSelectPlace: (coords: Coordinates) => void;
}

const SearchBox = ({ onSelectPlace }: SearchBoxProps) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const handleAutoLoad = (auto: google.maps.places.Autocomplete) => {
    setAutocomplete(auto);
  };

  const handlePlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    console.log("Lugar seleccionado:", place);
    if (!place.geometry || !place.geometry.location) return;

    const coords: Coordinates = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    onSelectPlace(coords);
  };

  return (
    <Autocomplete onLoad={handleAutoLoad} onPlaceChanged={handlePlaceChanged}>
      <input
        type="text"
        placeholder="Buscar lugar (ej: Tottus, universidad, plaza...)"
        style={{
          width: "100%",
          maxWidth: "700px",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
          fontSize: "14px",
          marginBottom: "12px",
          marginBlock: "16px",
        }}
      />
    </Autocomplete>
  );
};

export default SearchBox;
