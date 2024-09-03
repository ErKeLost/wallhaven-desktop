import { RefObject, useEffect, useState } from 'react';

const useCalculativeWidth = (
  containerRef: RefObject<HTMLElement>,
  marginX: number,
  cols: number
) => {
  const [itemWidth, setItemWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateWidth = () => {
      const containerWidth = containerRef.current!.offsetWidth;
      const totalMargin = marginX * (cols - 1);
      const availableWidth = containerWidth - totalMargin;
      const calculatedWidth = availableWidth / cols;
      setItemWidth(Math.floor(calculatedWidth));
    };

    const resizeObserver = new ResizeObserver(calculateWidth);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef, marginX, cols]);

  return itemWidth;
};

export default useCalculativeWidth;
