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

import { Copy } from "lucide-react"

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

export default function DialogCloseButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
