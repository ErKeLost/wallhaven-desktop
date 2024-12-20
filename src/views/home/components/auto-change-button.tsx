import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function AutoChangeButton({ autoChange, setAutoChange }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={autoChange ? "default" : "ghost"}
          size="icon"
          className="rounded-full"
          onClick={() => setAutoChange(!autoChange)}
        >
          <Clock className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>自动切换壁纸</p>
      </TooltipContent>
    </Tooltip>
  );
} 
