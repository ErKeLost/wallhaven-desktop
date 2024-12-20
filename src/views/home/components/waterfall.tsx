import { useMediaQuery } from "react-responsive";
import { Card } from "@/components/ui/card";
import Image from "@/components/ui/image";
import Waterfall from "@/components/water-fall";
import Loading from "@/components/ui/loading";

export function WaterFallComp({
  onImageClick,
  scrollRef,
  imageData,
  onLoadMore,
  isLoading,
}) {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const isMediumScreen = useMediaQuery({ minWidth: 768 });

  const getColumnCount = () => {
    if (isLargeScreen) return 4;
    if (isMediumScreen) return 3;
    return 2;
  };

  return (
    <div ref={scrollRef} className="px-4 pb-24">
      <Waterfall
        columnCount={getColumnCount()}
        columnGap={16}
        rowGap={16}
        onLoadMore={onLoadMore}
      >
        {imageData.map((item, index) => (
          <Card
            key={item.id}
            className="overflow-hidden cursor-pointer group"
            onClick={() => onImageClick(item)}
          >
            <div className="relative">
              <Image
                src={item.thumbs.proxyLarge}
                alt={`Wallpaper ${index}`}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm">点击预览</span>
              </div>
            </div>
          </Card>
        ))}
      </Waterfall>
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      )}
    </div>
  );
} 
