import { HomeIcon, History, PencilIcon } from "lucide-react";
import { Icons } from "@/components/icons";

export const DATA = {
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/history", icon: History, label: "History" },
    { href: "/blog", icon: PencilIcon, label: "Blog" },
  ],
  contact: {
    social: {
      // ... 社交媒体配置 ...
    },
  },
};

export const API_BASE_URL = 'https://wallhaven.fun/api/wallhaven'; 
