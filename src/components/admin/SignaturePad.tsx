import { useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { secondaryButton } from "@/components/admin/AdminUI";

interface Props {
  label: string;
  /** Wird mit dem PNG-DataURL aufgerufen, sobald der Nutzer den Stift absetzt. */
  onChange: (dataUrl: string | null) => void;
  value?: string | null;
}

/** Touch-optimiertes Unterschriftsfeld für Tablet und Smartphone. */
const SignaturePad = ({ label, onChange, value }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(!!value);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
  }, []);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    drawing.current = true;
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(event);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasInk(true);
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(canvasRef.current?.toDataURL("image/png") ?? null);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    onChange(null);
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <button type="button" onClick={clear} className={`${secondaryButton} !px-3 !py-1.5 text-xs`}>
          <Eraser className="h-3.5 w-3.5" /> Löschen
        </button>
      </div>
      {value && !hasInk ? (
        <img
          src={value}
          alt={`${label} (gespeichert)`}
          className="h-32 w-full rounded-xl border border-border bg-background object-contain"
        />
      ) : (
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="h-32 w-full touch-none rounded-xl border border-dashed border-border bg-background"
        />
      )}
      <p className="mt-1 text-xs text-muted-foreground">
        {hasInk ? "Unterschrift erfasst." : "Bitte im Feld unterschreiben."}
      </p>
    </div>
  );
};

export default SignaturePad;
