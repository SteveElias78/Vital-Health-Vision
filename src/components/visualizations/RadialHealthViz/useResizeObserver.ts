
import { useState, useEffect, RefObject } from 'react';

export const useResizeObserver = (
  svgRef: RefObject<SVGSVGElement>
): { width: number; height: number } => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    const updateSize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        // Make it square based on the smaller dimension
        const width = container.clientWidth;
        const height = container.clientHeight;
        const size = Math.min(width, height);
        setSize({ width: size, height: size });
      }
    };

    // Initial size
    updateSize();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateSize);
    if (svgRef.current.parentElement) {
      resizeObserver.observe(svgRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [svgRef]);

  return size;
};
