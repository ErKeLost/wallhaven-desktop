import { useState, useEffect, useCallback, useRef, SVGProps } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "@/components/ui/image";
import { useMediaQuery } from 'react-responsive';
import Waterfall, { WaterfallItem } from "@/components/water-fall";
import Draggable from 'react-draggable';
import Link from "@/components/ui/link";
import { useDownloadListeners } from "@/hooks/use-listen-download";
import WallpaperPreviewDialog from "@/components/wallpaper-preview-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarIcon,
  Loader,
  HomeIcon,
  MailIcon,
  PencilIcon,
  Shuffle,
  PartyPopper,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Dock, DockIcon } from "@/components/ui/dock";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Loading from "@/components/ui/loading";

export default function Dashboard() {
  const [progress, setProgress] = useState(0);
  const [imageData, setImageData] = useState(null);
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
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.start();
    }
  }, []);

  useEffect(() => {
    const unlisten1 = listen('download_start', () => {
      // setStatus('下载开始');
      console.log('download_start');

    });

    const unlisten2 = listen('download_progress', (event: { payload: number }) => {
      // setProgress(event.payload);
      console.log('download_progress', event.payload);
      setProgress(event.payload);
    });

    const unlisten3 = listen('download_complete', () => {
      // setStatus('下载完成');
      console.log('download_complete');
    });

    return () => {
      unlisten1.then(f => f());
      unlisten2.then(f => f());
      unlisten3.then(f => f());
    };
  }, []);
  
  const scrollRef = useRef(null);

  return (
    <>
      <div className="flex-1 w-full overflow-x-hidden" ref={scrollRef} >
        <div className="flex w-full justify-between items-center p-4 px-8 mb-6">
          <Search />
          <div className="flex items-center gap-20">
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                prefetch={false}
              >
                <PartyPopper className="h-5 w-5" />
                Popular
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                prefetch={false}
              >
                <SearchIcon className="h-5 w-5" />
                Latest
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                prefetch={false}
              >
                <Shuffle className="h-5 w-5" />
                Random
              </Link>
            </div>
            <SignIn />
          </div>
        </div>
        <div className="z-10">
          <DockActionBar />
        </div>
        <WaterFallComp onImageClick={handleImageClick} scrollRef={scrollRef} />
      </div >
      <WallpaperPreviewDialog
        progress={progress}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        image={selectedImage}
        changePaper={changePaper}
      />
    </>
  );
}

export type IconProps = React.HTMLAttributes<SVGElement>;

const Icons = {
  calendar: (props: IconProps) => <CalendarIcon {...props} />,
  email: (props: IconProps) => <MailIcon {...props} />,
  linkedin: (props: IconProps) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>LinkedIn</title>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  ),
  x: (props: IconProps) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>X</title>
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </svg>
  ),
  youtube: (props: IconProps) => (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>youtube</title>
      <path d="M29.41,9.26a3.5,3.5,0,0,0-2.47-2.47C24.76,6.2,16,6.2,16,6.2s-8.76,0-10.94.59A3.5,3.5,0,0,0,2.59,9.26,36.13,36.13,0,0,0,2,16a36.13,36.13,0,0,0,.59,6.74,3.5,3.5,0,0,0,2.47,2.47C7.24,25.8,16,25.8,16,25.8s8.76,0,10.94-.59a3.5,3.5,0,0,0,2.47-2.47A36.13,36.13,0,0,0,30,16,36.13,36.13,0,0,0,29.41,9.26ZM13.2,20.2V11.8L20.47,16Z" />
    </svg>
  ),
  github: (props: IconProps) => (
    <svg viewBox="0 0 438.549 438.549" {...props}>
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      ></path>
    </svg>
  ),
};

const DATA = {
  navbar: [
    { href: "#", icon: HomeIcon, label: "Home" },
    { href: "#", icon: PencilIcon, label: "Blog" },
  ],
  contact: {
    social: {
      GitHub: {
        name: "GitHub",
        url: "#",
        icon: Icons.github,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "#",
        icon: Icons.linkedin,
      },
      X: {
        name: "X",
        url: "#",
        icon: Icons.x,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,
      },
    },
  },
};

export function DockActionBar() {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef} defaultPosition={{ x: 0, y: 0 }}>
      <div ref={nodeRef} className="cursor-move !fixed z-10 inset-x-0 bottom-16 flex justify-center">
        <TooltipProvider>
          <Dock direction="middle">
            {DATA.navbar.map((item) => (
              <DockIcon key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-12 rounded-full"
                      )}
                    >
                      <item.icon className="size-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            ))}
            <div className="h-full" />
            {Object.entries(DATA.contact.social).map(([name, social]) => (
              <DockIcon key={name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={social.url}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-12 rounded-full"
                      )}
                    >
                      <social.icon className="size-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{name}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            ))}
            <div className="h-full py-2" />
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ModeToggle />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          </Dock>
        </TooltipProvider>
      </div>
    </Draggable >
  );
}

export function Search() {
  return (
    <div className="rounded-lg p-4 min-w-[220px]">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
        <Input
          placeholder="Search..."
          className="pl-10 pr-10 rounded-md border border-white/20 bg-transparent py-2 text-sm ring-offset-background placeholder:text-white/60 focus:outline-none focus:ring-0 focus:border-white/20 min-w-[220px]"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <XIcon className="w-5 h-5 text-white/60" />
          <span className="sr-only">Clear</span>
        </Button>
      </div>
    </div>
  );
}

export function SignIn() {
  return (
    <div className="flex justify-center">
      <Button className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">Sign In</Button>
    </div>
  )
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function WaterFallComp({ onImageClick, scrollRef }) {
  // const scrollRef = useRef<HTMLDivElement>(null);
  /**测试的列表数据 */
  interface item extends WaterfallItem {
    /**图片路径 */
    src: string;
    /**图片描述 */
    text: string;
  }

  const isExtraLargeScreen = useMediaQuery({ minWidth: 2560 });
  const isLargeScreen = useMediaQuery({ minWidth: 1920, maxWidth: 2559 });
  const isMediumScreen = useMediaQuery({ minWidth: 1280, maxWidth: 1919 });
  const isSmallScreen = useMediaQuery({ minWidth: 768, maxWidth: 1279 });
  const isExtraSmallScreen = useMediaQuery({ maxWidth: 767 });

  const getCols = () => {
    if (isExtraLargeScreen) return 5;    // 2560px 及以上
    if (isLargeScreen) return 5;         // 1920px - 2559px
    if (isMediumScreen) return 4;        // 1280px - 1919px
    if (isSmallScreen) return 2;         // 768px - 1279px
    if (isExtraSmallScreen) return 1;    // 767px 及以下
    return 5; // 默认值
  };

  // loading data
  const [imageData, setImageData] = useState([]);
  const [page, setPage] = useState(1);
  const [toprange, setToprange] = useState('1M'); // 假设默认值为 '1M'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (currentPage) => {
    if (isLoading) return; // 如果正在加载，直接返回
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://heaven-walls-api.vercel.app/api/wallhaven/topwalls?page=${currentPage}&toprange=${toprange}`
      );
      const data = await res.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toprange]);


  const loadInitialData = useCallback(async () => {
    const initialData = await fetchData(1);
    setImageData(initialData);
    setPage(1);
  }, [fetchData]);

  const onLoadMore = useCallback(async () => {
    if (isLoading) return;
    const nextPage = page + 1;
    const newData = await fetchData(nextPage);
    setImageData(prevData => [...prevData, ...newData]);
    setPage(nextPage);
  }, [fetchData, page, isLoading]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <main className="w-full overflow-y-auto">
      <Waterfall
        scrollRef={scrollRef}
        cols={getCols()}
        marginX={10}
        items={imageData}
        itemRender={(item, index) => (
          <Card onClick={() => onImageClick(item)} className="my-2  rounded-xl overflow-hidden">
            <Image src={item.thumbs.large} className="w-full" />
          </Card>
        )}
        onLoadMore={onLoadMore}
      />
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin">
            <Loading />
          </div>
        </div>
      )}
    </main>
  );
}



export const Logo = () => {
  return (
    <div
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 my-6"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        WallHaven
      </motion.span>
    </div>
  );
};
export const LogoIcon = () => {
  return (
    <div
      className="font-normal my-6 flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </div>
  );
};


