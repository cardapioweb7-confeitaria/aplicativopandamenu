"use client";

import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TabletLayoutProps {
  tabs: string[];
  labels: Record<string, string>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  showBack?: boolean;
  onBack?: () => void;
  content: ReactNode;
}

export function TabletLayout({
  tabs,
  labels,
  activeTab,
  onTabChange,
  showBack = false,
  onBack,
  content,
}: TabletLayoutProps) {
  return (
    <div className="min-h-screen bg-pink-50 relative flex flex-col">
      
      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 p-8 pb-32">
        {showBack && (
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-6 shadow-sm mb-8 rounded-b-2xl">
            <Button
              variant="ghost"
              size="lg"
              onClick={onBack}
              className="text-xl font-bold text-gray-800 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              Voltar ao Menu Principal
            </Button>
          </div>
        )}
        {content}
      </div>

      {/* MENU INFERIOR SUSPENSO */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white shadow-xl rounded-full px-6 py-4 flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                activeTab === tab
                  ? "bg-pink-500 text-white"
                  : "text-gray-600 hover:text-pink-500"
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
