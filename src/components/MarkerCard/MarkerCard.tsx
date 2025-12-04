import type { Coordinates } from "../../hooks/maps.hooks";
import "./MarkerCard.css";

interface MarkerCardProps {
  index: number;
  coords: Coordinates;
  onRemove: () => void;
}

const MarkerCard = ({ index, coords, onRemove }: MarkerCardProps) => {
  return (
    <div className="marker-card">
      <div className="marker-card-header">
        <span className="marker-card-title">Lugar #{index + 1}</span>
        <button
          type="button"
          className="marker-card-close"
          onClick={onRemove}
          aria-label="Eliminar marcador"
        >
          ×
        </button>
      </div>

      <p className="marker-card-coords">
        <span>Lat: {coords.lat.toFixed(5)}</span>
        <span>Lng: {coords.lng.toFixed(5)}</span>
      </p>
    </div>
  );
};

export default MarkerCard;
