"use client";

import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
tabs: string[];
labels: Record<string, string>;
activeTab: string;
onTabChange: (tab: string) => void;
showBack?: boolean;
onBack?: () => void;
content: ReactNode;
}

export function MobileLayout({
tabs,
labels,
activeTab,
onTabChange,
showBack = false,
onBack,
content,
}: MobileLayoutProps) {
return ( <div className="min-h-screen bg-pink-50 flex flex-col"> <div className="flex-1 pb-32">
{showBack && ( <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 shadow-sm"> <Button
           variant="ghost"
           size="lg"
           onClick={onBack}
           className="w-full text-lg font-bold text-gray-800 hover:text-gray-900 justify-start"
         > <ArrowLeft className="w-6 h-6 mr-3" />
Voltar ao Menu Principal </Button> </div>
)}

```
    <div className="h-full overflow-y-auto">{content}</div>
  </div>

  {/* Barra flutuante */}
  <div
    className="
      fixed
      bottom-4
      left-4
      right-4
      z-[9999]
      rounded-3xl
      border border-white/40
      shadow-[0_10px_30px_rgba(0,0,0,0.25)]
      backdrop-blur-xl
    "
    style={{
      background:
        "linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)",
      backgroundSize: "200% 200%",
      animation: "gradient-x 3s ease infinite",
    }}
  >
    <div className="grid grid-cols-4 gap-2 p-3">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "default" : "ghost"}
          className={cn(
            "h-14 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]",
            activeTab === tab
              ? "bg-white text-[#ec4899] shadow-pink-500/50"
              : "text-white/90 hover:bg-white/20 hover:text-white bg-transparent"
          )}
          onClick={() => onTabChange(tab)}
        >
          {labels[tab]}
        </Button>
      ))}
    </div>
  </div>
</div>
```

);
}
