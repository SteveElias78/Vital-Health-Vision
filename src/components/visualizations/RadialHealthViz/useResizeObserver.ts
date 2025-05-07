
import { useState, useEffect, RefObject } from 'react';

export function useResizeObserver(
  ref: RefObject<Element>
): { width: number; height: number } | undefined {
  const [dimensions, setDimensions] = useState<
    { width: number; height: number } | undefined
  >();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (!entries.length) return;

      const entry = entries[0];
      
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      
      // Only update if dimensions actually changed
      if (dimensions?.width !== width || dimensions?.height !== height) {
        setDimensions({
          width,
          height
        });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, dimensions]);

  return dimensions;
}
