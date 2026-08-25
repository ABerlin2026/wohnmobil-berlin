import { useEffect, useState } from "react";
import { cleanMarkerText } from "@/admin/constants";
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
  /** Noch nicht gespeicherter Marker (Vorschau). */
  pendingMarker?: { x: number; y: number } | null;
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
  pendingMarker,
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
      className={`relative w-full overflow-hidden rounded-xl border border-border bg-card ${
        onAddMarker ? "cursor-crosshair touch-manipulation" : ""
      }`}
      onPointerUp={(event) => {
        if (!onAddMarker) return;
        if ((event.target as HTMLElement).closest("button[data-marker]")) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        if (x < 0 || y < 0 || x > 100 || y > 100) return;
        onAddMarker(Number(x.toFixed(2)), Number(y.toFixed(2)));
      }}
      role={onAddMarker ? "button" : undefined}
      tabIndex={onAddMarker ? 0 : undefined}
    >
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="pointer-events-none w-full select-none"
        draggable={false}
      />
      {pendingMarker && (
        <span
          style={{ left: `${pendingMarker.x}%`, top: `${pendingMarker.y}%` }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-2 border-primary bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary"
        >
          neu
        </span>
      )}

      {markers.map((marker) => (
        <button
          key={marker.id}
          type="button"
          data-marker
          onPointerUp={(event) => event.stopPropagation()}
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
          aria-label={`Schaden ${cleanMarkerText(marker.marker_label)}`}
        >
          {cleanMarkerText(marker.marker_label)}
        </button>
      ))}
    </div>
  );
};

export default VehicleDiagram;
