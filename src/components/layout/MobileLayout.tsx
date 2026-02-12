"use client";

import { ReactNode } from "react";
import { Heart, MessageCircle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  content: ReactNode;
}

export function MobileLayout({
  activeTab,
  onTabChange,
  content,
}: MobileLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      
      {/* CONTEÚDO */}
      <div className="flex-1 overflow-y-auto pb-32">
        {content}
      </div>

      {/* MENU FLUTUANTE */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
        <div className="bg-[#1a0f2e] rounded-full px-10 py-5 flex items-center gap-12 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          
          {/* HOME (PNG PERSONALIZADO) */}
          <button
            onClick={() => onTabChange("home")}
            className={cn(
              "transition-all duration-300",
              activeTab === "home" ? "scale-110" : ""
            )}
          >
            <img
              src="/icons/homeapp.png"
              alt="Home"
              className="w-7 h-7"
            />
          </button>

          {/* FAVORITOS */}
          <button
            onClick={() => onTabChange("favoritos")}
            className={cn(
              "transition-all duration-300",
              activeTab === "favoritos" ? "scale-110" : "opacity-80"
            )}
          >
            <Heart className="w-7 h-7 text-white" />
          </button>

          {/* MENSAGENS */}
          <button
            onClick={() => onTabChange("mensagens")}
            className={cn(
              "transition-all duration-300",
              activeTab === "mensagens" ? "scale-110" : "opacity-80"
            )}
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </button>

          {/* TRENDING */}
          <button
            onClick={() => onTabChange("trending")}
            className={cn(
              "transition-all duration-300",
              activeTab === "trending" ? "scale-110" : "opacity-80"
            )}
          >
            <Flame className="w-7 h-7 text-white" />
          </button>

        </div>
      </div>
    </div>
  );
}
