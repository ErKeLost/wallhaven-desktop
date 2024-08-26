import { useState, useEffect } from "react";
import { Motion, spring } from "react-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const aspectRatios = [
  { name: "Ultrawide", ratio: 21 / 9 },
  { name: "16:9", ratio: 16 / 9 },
  { name: "16:10", ratio: 16 / 10 },
  { name: "4:3", ratio: 4 / 3 },
  { name: "5:4", ratio: 5 / 4 },
];

export default function InteractiveResolutionPicker({
  isOpen,
  onClose,
  onSelect,
  imageUrl,
}) {
  const [selectedRatio, setSelectedRatio] = useState(aspectRatios[0]);
  const [resolutionScale, setResolutionScale] = useState(50);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsExpanded(true);
    }
  }, [isOpen]);

  const handleSelect = () => {
    const width = Math.round((resolutionScale / 100) * 3840);
    const height = Math.round(width / selectedRatio.ratio);
    onSelect(`${width} × ${height}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="relative w-full h-full">
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        <Motion style={{ y: spring(isExpanded ? 0 : 100) }}>
          {({ y }) => (
            <div
              className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md p-4 rounded-t-2xl shadow-lg"
              style={{
                transform: `translateY(${y}%)`,
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Resolution Picker</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {isExpanded && (
                <>
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {aspectRatios.map((ratio) => (
                      <TooltipProvider key={ratio.name}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                selectedRatio.name === ratio.name
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => setSelectedRatio(ratio)}
                              className="whitespace-nowrap"
                            >
                              {ratio.name}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Aspect ratio: {ratio.ratio.toFixed(2)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                  <div className="mb-4">
                    <Slider
                      value={[resolutionScale]}
                      onValueChange={(value) => setResolutionScale(value[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>Low Resolution</span>
                      <span>High Resolution</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">
                      {Math.round((resolutionScale / 100) * 3840)} ×{" "}
                      {Math.round(
                        ((resolutionScale / 100) * 3840) / selectedRatio.ratio
                      )}
                    </div>
                    <Button onClick={handleSelect}>Apply Resolution</Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Motion>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 ${
              10 - resolutionScale / 10
            }px rgba(0, 0, 0, 0.5)`,
            transition: "box-shadow 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
