"use client";

import { ReactNode } from "react";
import { Heart, MessageCircle, Flame, Home } from "lucide-react";
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
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden md:hidden">
      
      {/* CONTEÚDO */}
      <div className="flex-1 overflow-y-auto pb-32">
        {content}
      </div>

      {/* MENU FLUTUANTE */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
        <div className="bg-[#1a0f2e] rounded-full px-10 py-5 flex items-center gap-12 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          
          {/* HOME */}
          <button
            onClick={() => onTabChange("home")}
            className={cn(
              "transition-all duration-300 p-2 rounded-full",
              activeTab === "home"
                ? "scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] bg-white/20"
                : "opacity-90 hover:bg-white/10"
            )}
            aria-label="Home"
          >
            <Home className="w-9 h-9 text-white" />
          </button>

          {/* FAVORITOS */}
          <button
            onClick={() => onTabChange("favoritos")}
            className={cn(
              "transition-all duration-300 p-2 rounded-full",
              activeTab === "favoritos"
                ? "scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] bg-white/20"
                : "opacity-90 hover:bg-white/10"
            )}
            aria-label="Favoritos"
          >
            <Heart className="w-9 h-9 text-white" />
          </button>

          {/* MENSAGENS */}
          <button
            onClick={() => onTabChange("mensagens")}
            className={cn(
              "transition-all duration-300 p-2 rounded-full",
              activeTab === "mensagens"
                ? "scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] bg-white/20"
                : "opacity-90 hover:bg-white/10"
            )}
            aria-label="Mensagens"
          >
            <MessageCircle className="w-9 h-9 text-white" />
          </button>

          {/* TRENDING */}
          <button
            onClick={() => onTabChange("trending")}
            className={cn(
              "transition-all duration-300 p-2 rounded-full",
              activeTab === "trending"
                ? "scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] bg-white/20"
                : "opacity-90 hover:bg-white/10"
            )}
            aria-label="Trending"
          >
            <Flame className="w-9 h-9 text-white" />
          </button>

        </div>
      </div>
    </div>
  );
}