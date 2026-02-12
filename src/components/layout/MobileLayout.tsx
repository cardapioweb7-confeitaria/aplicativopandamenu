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
      
      {/* CONTEÚDO */}
      <div className="flex-1 pb-32">
        {showBack && (
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4 shadow-sm">
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

      {/* MENU INFERIOR SUSPENSO */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center px-4">
        <div className="bg-white shadow-xl rounded-full px-4 py-3 flex gap-2 w-full max-w-md justify-between">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex-1 text-center text-xs sm:text-sm font-semibold py-2 rounded-full transition-colors",
                activeTab === tab
                  ? "bg-pink-500 text-white"
                  : "text-gray-600"
              )}
            >
              {labels[tab]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
