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
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col relative">
      
      {/* Conteúdo */}
      <div className="flex-1 pb-36">
        {showBack && (
          <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 shadow-sm">
            <Button
              variant="ghost"
              size="lg"
              onClick={onBack}
              className="w-full text-lg font-bold text-gray-800 hover:text-gray-900 justify-start"
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              Voltar ao Menu Principal
            </Button>
          </div>
        )}

        <div className="h-full overflow-y-auto">
          {content}
        </div>
      </div>

      {/* ============================= */}
      {/* BARRA FLUTUANTE ESTILO APP */}
      {/* ============================= */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md z-[9999]">
        
        <div className="bg-white rounded-full shadow-2xl border border-gray-200 px-3 py-3">
          
          <div className="flex justify-between items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={cn(
                  "flex-1 text-center text-xs sm:text-sm font-semibold transition-all duration-300 rounded-full py-3",
                  activeTab === tab
                    ? "bg-pink-500 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-pink-500"
                )}
              >
                {labels[tab]}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
