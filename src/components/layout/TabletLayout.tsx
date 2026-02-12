"use client";

import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TabletLayoutProps {
  tabs: string[]
  labels: Record<string, string>
  activeTab: string
  onTabChange: (tab: string) => void
  showBack?: boolean
  onBack?: () => void
  content: ReactNode
}

export function TabletLayout({ tabs, labels, activeTab, onTabChange, showBack = false, onBack, content }: TabletLayoutProps) {
  return (
    <div className="min-h-screen bg-pink-50 flex">
      <div 
        className="w-64 border-r border-pink-200 flex flex-col shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-x 3s ease infinite'
        }}
      >
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-xl font-bold mb-1">Panda Menu</h1>
            <p className="text-white/80 text-sm">Cardápio Digital</p>
          </div>
        </div>
        
        <div className="flex-1 p-6 space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-14 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]",
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
        
        <div className="p-6 pt-0 border-t border-pink-300">
          <div className="text-center">
            <p className="text-white/70 text-xs">© 2025 Panda Menu</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-8 relative">
        {showBack && (
          <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 shadow-sm mb-8 rounded-b-2xl">
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
    </div>
  )
}