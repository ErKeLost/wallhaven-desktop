import { useState, useEffect, useCallback } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "@/components/ui/image";
import { Carousel, Card } from "@/components/ui/cards-carousel";
import { useDownloadListeners } from "./hooks/use-listen-download";
function App() {
  const [imageData, setImageData] = useState([]);
  const [topQuery, setTopQuery] = useState({
    page: 1,
    toprange: "1y",
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

  return (
    <div>
      <CardsCarousel imageData={imageData} onChangePaper={changePaper} />
      <ModeToggle />
    </div>
  );
}

export function CardsCarousel({ imageData, onChangePaper }) {
  const cards = imageData.map((card, index) => (
    <Card key={card.path} card={card} index={index} onChangePaper={onChangePaper} />
  ));

  return (
    <div className="w-full h-full py-20">
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

export default App;
