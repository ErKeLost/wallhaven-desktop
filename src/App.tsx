import { useState, useEffect, useCallback } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "@/components/ui/image";
import { Carousel, Card } from "@/components/ui/cards-carousel";
import { useDownloadListeners } from "./hooks/use-listen-download";
import WallpaperPreviewDialog from "@/components/wallpaper-preview-dialog";
import Swiper from "@/components/swiper";
function App() {
  const [imageData, setImageData] = useState([]);
  const [topQuery, setTopQuery] = useState({
    page: 1,
    toprange: "2y",
  });

  const query = useCallback(async () => {
    setTopQuery((prevState) => ({ ...prevState, page: prevState.page + 1 }));
    const res = await fetch(
      `https://heaven-walls-api.vercel.app/api/wallhaven/topwalls?page=${topQuery.page}&toprange=${topQuery.toprange}`
    );
    const data = await res.json();
    console.log(data);
    setImageData(data.data);
  }, [topQuery.page, topQuery.toprange]);

  useEffect(() => {
    query();
  }, []);

  const changePaper = async (item) => {
    await invoke("download_and_set_wallpaper", {
      url: item.path,
      fileName: "wallhaven-" + item.id,
      // resolutions: `${9999}x${1000}`
    });
  };

  const queryPaper = () => {
    query();
  };

  const { startListening, stopListening, isListening } = useDownloadListeners();

  // 当需要开始监听时调用
  const handleStartDownload = useCallback(() => {
    startListening();
    // 其他下载开始的逻辑...
  }, [startListening]);

  // 当需要停止监听时调用
  const handleStopDownload = useCallback(() => {
    stopListening();
    // 其他下载停止的逻辑...
  }, [stopListening]);

  // 在组件卸载时确保停止监听
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (item) => {
    setSelectedImage(item);
    setIsDialogOpen(true);
  };
  return (
    <div>
      <WallpaperPreviewDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        image={selectedImage}
        changePaper={changePaper}
      />
      <ModeToggle />
      <Swiper
        data={imageData}
        onImageClick={handleImageClick}
      />
    </div>
  );
}

export function CardsCarousel({ imageData, onChangePaper }) {
  return (
    <div className="w-full h-full">

      {/* <Carousel items={cards} /> */}
    </div>
  );
}

export default App;
