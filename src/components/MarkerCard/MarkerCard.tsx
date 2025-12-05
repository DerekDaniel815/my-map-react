import type { MarkerCardProps } from "../MarkerList/MarkerList";
import "./MarkerCard.scss";

interface MarkerPropsCard {
  markerCard: MarkerCardProps;
  onRemove: () => void;
}

const MarkerCard = ({ markerCard, onRemove }: MarkerPropsCard) => {
  return (
    <div className="marker-card">
      <div className="marker-card-header">
        <span className="marker-card-title">{markerCard.name}</span>
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
        <span>Lat: {markerCard.coords.lat.toFixed(5)}</span>
        <span>Lng: {markerCard.coords.lng.toFixed(5)}</span>
      </p>
    </div>
  );
};

export default MarkerCard;
