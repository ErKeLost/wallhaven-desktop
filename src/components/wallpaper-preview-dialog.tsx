import Image from "@/components/ui/image";
import { useState, useCallback } from "react";
import { Copy, Download, Heart, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InteractiveResolutionPicker from "./interactiveResolutionPicker";
import { motion } from "framer-motion";

export default function WallpaperPreviewDialog({
  isOpen,
  onClose,
  image,
  changePaper,
  progress
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleImageClick = useCallback(() => {
    setIsPickerOpen(true);
  }, []);

  const handleResolutionSelect = useCallback((resolution) => {
    setIsPickerOpen(false);
  }, []);

  const handlePickerClose = useCallback(() => {
    setIsPickerOpen(false);
  }, []);

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[70vw] max-w-[1200px] flex flex-col overflow-hidden"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>壁纸预览 下载进度{progress}</DialogTitle>
          <DialogDescription>高清壁纸 - ID：{image.id}</DialogDescription>
        </DialogHeader>

        <div className="relative flex items-center justify-center">
          {/* 背景模糊效果 */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${image.thumbs.proxySmall})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(10px)',
              opacity: 0.6,
              transform: 'scale(1.1)',
            }}
          />

          {/* 主图片 */}
          <div
            className="relative z-1 flex-grow"
            onClick={handleImageClick}
          >
            <Image
              src={image.basePath}
              alt="Wallpaper preview"
              width="100%"
              height="auto"
              className="w-full h-auto object-contain rounded-lg shadow-lg cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Maximize2 className="w-8 h-8 text-white" />
            </div>
          </div>

          {isPickerOpen && (
            <InteractiveResolutionPicker
              isOpen={isPickerOpen}
              onClose={handlePickerClose}
              onSelect={handleResolutionSelect}
              imageUrl={image.basePath}
              onOpen={() => setIsPickerOpen(true)}
            />
          )}
        </div>

        <div className="flex-shrink-0 mt-4 flex justify-between items-center relative z-2">
          <div className="text-sm text-muted-foreground">
            分辨率：{image.resolution || "未知"}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={isFavorite ? "fill-red-500 text-red-500" : ""}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => changePaper(image)}
            >
              <Download />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
