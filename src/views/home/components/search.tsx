import { useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="w-full lg:w-auto min-w-[280px]">
      <div className={cn(
        "relative group transition-all duration-300",
        isFocused && "scale-105"
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-0 transition-opacity duration-300",
          (isFocused || searchTerm) && "opacity-25"
        )} />

        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 z-10 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="搜索壁纸..."
            className={cn(
              "w-full pl-10 pr-10 py-2 text-sm bg-background/60 backdrop-blur-sm",
              "border border-border/50 rounded-lg shadow-sm",
              "placeholder:text-muted-foreground/70",
              "focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary/20",
              "transition-all duration-300",
              isFocused && "border-primary/50"
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-2 z-10",
                "hover:bg-background/80 hover:text-foreground",
                "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
              )}
              onClick={() => {
                setSearchTerm("");
                onSearch("");
              }}
            >
              <XIcon className="w-4 h-4 text-muted-foreground/70" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>

        <div className="absolute right-3 top-full mt-1 text-xs text-muted-foreground/70">
          按 Enter 搜索
        </div>
      </div>
    </div>
  );
} 
