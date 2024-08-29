import { RefObject, useEffect, useState } from 'react';

const useCalculativeWidth = (
  containerRef: RefObject<HTMLElement>,
  marginX: number,
  cols: number
) => {
  const [itemWidth, setItemWidth] = useState(0);

  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const totalMargin = marginX * (cols - 1);
        const availableWidth = containerWidth - totalMargin;
        const calculatedWidth = availableWidth / cols;
        setItemWidth(Math.floor(calculatedWidth));
      }
    };

    calculateWidth();

    // 添加窗口大小变化的监听器
    window.addEventListener('resize', calculateWidth);

    // 清理函数
    return () => {
      window.removeEventListener('resize', calculateWidth);
    };
  }, [containerRef, marginX, cols]);

  return itemWidth;
};

export default useCalculativeWidth;
