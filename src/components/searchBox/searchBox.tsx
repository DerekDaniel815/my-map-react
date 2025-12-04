import { Autocomplete } from "@react-google-maps/api";
import { useState } from "react";
import type { Coordinates } from "../../hooks/maps.hooks";
import "./searchBox.scss";

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
        className="search-input"
      />
    </Autocomplete>
  );
};

export default SearchBox;
