import React, { useState } from "react";
import MarkerCard from "../MarkerCard/MarkerCard";
import { type Coordinates } from "../../hooks/maps.hooks";
import "./MarkerList.scss";

interface MarkerListProps {
  markers: Coordinates[];
  onRemoveMarker: (index: number) => void;
  onReorder: (newOrder: Coordinates[]) => void;
}

const MarkerList = ({
  markers,
  onRemoveMarker,
  onReorder,
}: MarkerListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    index: number,
    event: React.DragEvent<HTMLLIElement>
  ) => {
    event.preventDefault(); // necesario para permitir el drop
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...markers];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    onReorder(updated); // avisamos al padre el nuevo orden

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={isOpen ? "marker-list" : "marker-list marker-list__close"}>
      <button
        className="marker-list__toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="marker-list__title">Lugares marcados</h2>
        <span className="marker-list__toggle-icon">{isOpen ? "▼" : "▲"}</span>
      </button>
      {markers.length === 0 ? (
        <p className="marker-list__empty">
          Aun no tienes lugares seleccionados.
        </p>
      ) : (
        <ul className="marker-list__items">
          {markers.map((m, index) => {
            const isDragging = index === draggedIndex;
            const isDragOver = index === dragOverIndex;

            return (
              <li
                key={index}
                className={
                  "marker-list__item" +
                  (isDragging ? " marker-list__item--dragging" : "") +
                  (isDragOver ? " marker-list__item--drag-over" : "")
                }
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(event) => handleDragOver(index, event)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                <MarkerCard
                  index={index}
                  coords={m}
                  onRemove={() => onRemoveMarker(index)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
};

export default MarkerList;
