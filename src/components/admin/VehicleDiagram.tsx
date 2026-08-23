import { useEffect, useState } from "react";
import { DEFAULT_DIAGRAMS, resolveDiagramUrl, type VehicleSideValue } from "@/admin/vehicleDiagrams";

export interface DiagramMarker {
  id: string;
  marker_label: string;
  x_percent: number;
  y_percent: number;
  status?: string | null;
}

interface Props {
  side: VehicleSideValue;
  storedPath?: string | null;
  markers?: DiagramMarker[];
  /** Wenn gesetzt, erzeugt ein Klick auf die Skizze einen neuen Marker (Prozentkoordinaten). */
  onAddMarker?: (x: number, y: number) => void;
  onSelectMarker?: (id: string) => void;
  activeMarkerId?: string | null;
  alt: string;
}

/**
 * Fahrzeugskizze mit nummerierten Schadensmarkern.
 * Marker werden als Prozentkoordinaten gespeichert und bleiben daher auf
 * jeder Displaygröße positionsstabil.
 */
const VehicleDiagram = ({
  side,
  storedPath,
  markers = [],
  onAddMarker,
  onSelectMarker,
  activeMarkerId,
  alt,
}: Props) => {
  const [url, setUrl] = useState<string>(DEFAULT_DIAGRAMS[side]);

  useEffect(() => {
    let cancelled = false;
    void resolveDiagramUrl(storedPath, side).then((resolved) => {
      if (!cancelled) setUrl(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [storedPath, side]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border bg-card"
      onClick={(event) => {
        if (!onAddMarker) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        onAddMarker(Number(x.toFixed(2)), Number(y.toFixed(2)));
      }}
      role={onAddMarker ? "button" : undefined}
      tabIndex={onAddMarker ? 0 : undefined}
    >
      <img src={url} alt={alt} loading="lazy" className="w-full select-none" draggable={false} />
      {markers.map((marker) => (
        <button
          key={marker.id}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelectMarker?.(marker.id);
          }}
          style={{ left: `${marker.x_percent}%`, top: `${marker.y_percent}%` }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 px-2 py-0.5 text-xs font-semibold shadow ${
            activeMarkerId === marker.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-destructive bg-background text-destructive"
          }`}
          aria-label={`Schaden ${marker.marker_label}`}
        >
          {marker.marker_label}
        </button>
      ))}
    </div>
  );
};

export default VehicleDiagram;
