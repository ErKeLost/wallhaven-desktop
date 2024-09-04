"use client";
import { ReactNode, RefObject, useEffect, useRef, useState, useCallback } from "react";
import useCalculativeWidth from "@/hooks/use-calculative-width";

// 瀑布流项目接口
export interface WaterfallItem {
  scale: number; // 高宽比
}

// 瀑布流组件属性接口
export interface WaterfallProps<T> {
  scrollRef: RefObject<HTMLDivElement>; // 滚动容器的ref
  cols?: number; // 列数，默认为5
  marginX?: number; // 列间距，默认为30
  items: T[]; // 要展示的项目数组
  itemRender: (item: T, index: number) => ReactNode; // 项目渲染函数
  onLoadMore?: () => void; // 加载更多数据的回调函数
}

export default function Waterfall<T extends WaterfallItem>(props: WaterfallProps<T>) {
  const { scrollRef, cols = 5, marginX = 30, items, itemRender, onLoadMore } = props;

  const listRef = useRef<HTMLDivElement>(null); // 瀑布流容器ref
  const colRef = useRef<(HTMLDivElement | null)[]>([]); // 每列的ref数组


  const imgWidth = useCalculativeWidth(listRef, marginX, cols);

  // 存储分配到每列的项目
  const [colList, setColList] = useState<T[][]>([]);

  // 存储每列的高度
  const [colHeight, setColHeight] = useState<number[]>([]);

  // 将项目分配到各列中
  const distributeItems = useCallback((items: T[]) => {
    // 确保 cols 至少为 1
    const validCols = Math.max(1, cols);

    // 使用 validCols 初始化 newColList
    const newColList: T[][] = Array.from({ length: validCols }, () => []);
    const newColHeight = new Array(validCols).fill(0);

    items.forEach((item) => {
      // 找到当前高度最小的列
      const minHeightIndex = newColHeight.indexOf(Math.min(...newColHeight));

      // 添加安全检查
      if (minHeightIndex >= 0 && minHeightIndex < validCols) {
        const estimatedHeight = imgWidth * (item.scale || 1);
        newColHeight[minHeightIndex] += estimatedHeight;
        newColList[minHeightIndex].push(item);
      } else {
        console.warn('Invalid minHeightIndex:', minHeightIndex);
      }
    });

    setColList(newColList);
    setColHeight(newColHeight);
  }, [cols, imgWidth]);
  useEffect(() => {
    if (items?.length > 0 && imgWidth > 0) {
      distributeItems(items);
    }
  }, [items, imgWidth, distributeItems]);

  // 渲染后更新真实列高
  useEffect(() => {
    if (colRef.current) {
      const realHeights = colRef.current.map((col) => col?.offsetHeight || 0);
      setColHeight(realHeights);
    }
  }, [colList]);

  // 添加滚动监听
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (scrollHeight - scrollTop - clientHeight < 100) {
      onLoadMore?.();
    }
  }, [onLoadMore, scrollRef]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll, scrollRef]);

  return (
    <div
      ref={listRef}
      style={{
        display: "flex",
        gap: `${marginX}px`,
        justifyContent: "center",
      }}
    >
      {colList.map((column, colIndex) => (
        <div
          key={colIndex}
          ref={(el) => (colRef.current[colIndex] = el)}
          style={{ width: imgWidth }}
        >
          {column.map((item, itemIndex) => (
            <div key={itemIndex} style={{ marginBottom: `${marginX}px` }}>
              {itemRender(item, itemIndex)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
