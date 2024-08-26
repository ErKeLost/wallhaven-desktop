import Image from "@/components/ui/image"
import { useState } from "react"

// export default function WallpaperPreviewDialog() {
//   const [isFavorite, setIsFavorite] = useState(false)

//   // 这里使用一个示例壁纸URL，您可以替换为实际的壁纸URL
//   const wallpaperUrl = "/placeholder.svg?height=1080&width=1920"
//   const thumbnailUrl = "https://w.wallhaven.cc/full/vq/wallhaven-vqjyjl.jpg"

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="p-0 overflow-hidden h-auto">
//           <Image
//             src={thumbnailUrl}
//             alt="Wallpaper thumbnail"
//             width={200}
//             height={150}
//             className="object-cover transition-transform hover:scale-110"
//           />
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[800px]">
//         <DialogHeader>
//           <DialogTitle>壁纸预览</DialogTitle>
//           <DialogDescription>
//             高清壁纸 - 1920x1080
//           </DialogDescription>
//         </DialogHeader>
//         <div className="mt-4">
//           <Image
//             src={wallpaperUrl}
//             alt="Wallpaper preview"
//             width={1920}
//             height={1080}
//             className="w-full h-auto rounded-lg shadow-lg"
//           />
//         </div>
//         <div className="mt-4 flex justify-between items-center">
//           <div className="text-sm text-muted-foreground">
//             上传者：John Doe • 上传时间：2023-06-15
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
//               <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} />
//             </Button>
//             <Button variant="outline" size="icon">
//               <Download />
//             </Button>
//           </div>
//         </div>
//         <DialogFooter className="sm:justify-start">
//           <Button type="button" variant="secondary">
//             查看更多类似壁纸
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

import { Copy, Download, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function WallpaperPreviewDialog({ isOpen, onClose, image, changePaper }) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] h-[95vh] sm:w-[90vw] sm:h-[90vh] md:w-[80vw] md:h-[80vh] lg:w-[70vw] lg:h-[70vh] xl:w-[60vw] xl:h-[60vh] max-w-[1200px] max-h-[800px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>壁纸预览</DialogTitle>
          <DialogDescription>
            高清壁纸 - ID：{image.id}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto mt-4" onClick={() => changePaper(image)}>
          <Image
            src={image.path}
            alt="Wallpaper preview"
            width="100%"
            height="100%"
            className="w-full h-auto object-contain max-h-full rounded-lg shadow-lg"
          />
        </div>
        <div className="flex-shrink-0 mt-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            分辨率：{image.resolution || '未知'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => changePaper(image)}>
              <Download />
            </Button>
          </div>
        </div>
        <DialogFooter className="flex-shrink-0 sm:justify-start mt-4">
          {/* <Button type="button" variant="secondary" onClick={onClose}>
            关闭
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
