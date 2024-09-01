import Image from "@/components/ui/image";
import { useState, useCallback, useEffect } from "react";
import { Copy, Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InteractiveResolutionPicker from "./interactiveResolutionPicker";

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
    console.log("Selected resolution:", resolution);
    // Handle the selected resolution here
    // For example, you might want to update the image resolution
    // changePaper({ ...image, resolution: resolution });
    setIsPickerOpen(false);
  }, []);

  const handlePickerClose = useCallback(() => {
    console.log("这个方法会执行么");
    
    setIsPickerOpen(false);
    // We don't call onClose() here, so the main dialog stays open
  }, []);


  useEffect(() => {
    console.log("isPickerOpen changed:", isPickerOpen);
  }, [isPickerOpen]);

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] h-[95vh] sm:w-[90vw] sm:h-[90vh] md:w-[80vw] md:h-[80vh] lg:w-[70vw] lg:h-[70vh] xl:w-[70vw] xl:h-[70vh] max-w-[1200px] max-h-[800px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>壁纸预览 下载进度{progress}</DialogTitle>
          <DialogDescription>高清壁纸 - ID：{image.id}</DialogDescription>
        </DialogHeader>
        <div
          className="flex-grow overflow-y-auto mt-4 relative"
          onClick={handleImageClick}
        >
          <Image
            src={image.path}
            alt="Wallpaper preview"
            width="100%"
            height="100%"
            className="w-full h-auto object-contain max-h-full rounded-lg shadow-lg cursor-pointer"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-lg font-semibold">
              Click to change resolution
            </span>
          </div>
          {isPickerOpen && (
            <InteractiveResolutionPicker
              isOpen={isPickerOpen}
              onClose={handlePickerClose}
              onSelect={handleResolutionSelect}
              imageUrl={image.path}
              onOpen={() => setIsPickerOpen(true)}
            />
          )}
        </div>
        <div className="flex-shrink-0 mt-4 flex justify-between items-center">
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
