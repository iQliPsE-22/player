import { useState, useRef, useLayoutEffect } from "react";
import CanvasShapes from './CanvasShapes';

export default function RectCanvas({ rects, currentTime, children }) {
  const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      const width = container.clientWidth;
      const height = container.clientHeight;
      setCanvasSize({ width, height });
    }
  }, [children]);

  return (
    <div ref={containerRef} className="relative w-full select-none overflow-hidden">
      <div className="relative w-full h-full overflow-hidden border border-gray-300 rounded-lg">
        {/* Children (video player) will be rendered here */}
        {children}
        <CanvasShapes rects={rects} currentTime={currentTime} canvasSize={canvasSize} />
      </div>
    </div>
  );
}
