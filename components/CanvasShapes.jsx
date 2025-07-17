export default function CanvasShapes({ rects, canvasSize }) {
  return (
    <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full">
      {/* Rectangles */}
      {rects.map((r, i) => {
        const x = r.start.x * canvasSize.width;
        const y = r.start.y * canvasSize.height;
        const width = Math.abs(r.end.x - r.start.x) * canvasSize.width;
        const height = Math.abs(r.end.y - r.start.y) * canvasSize.height;

        return (
          <g key={`rect-${i}`}>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              stroke={r.color}
              fill={`${r.color}33`} // Fill with transparency
              strokeWidth={2}
            />
            {/* Label */}
            <foreignObject x={x} y={y - 24} width={140} height={24}>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded text-sm"
                style={{
                  backgroundColor: r.color,
                  color: "#fff",
                  width: "fit-content",
                }}
              >
                <span className="truncate max-w-[100px]">
                  {r.label || `Zone ${i + 1}`}
                </span>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}
