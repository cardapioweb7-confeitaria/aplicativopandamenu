"use client";

import { ReactNode, useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const tabs = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'receitas', label: 'Receitas' },
  { id: 'arquivos', label: 'Arquivos' },
  { id: 'cardapio', label: 'Cardápio' },
]

export function MobileLayout({ children, activeTab = 'inicio', onTabChange }: MobileLayoutProps) {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab)

  useEffect(() => {
    const saved = localStorage.getItem('admin-active-tab')
    if (saved) setLocalActiveTab(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('admin-active-tab', localActiveTab)
    onTabChange?.(localActiveTab)
  }, [localActiveTab])

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <div className="flex-1 pb-20">
        {children}
      </div>
      
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-pink-200 rounded-t-3xl z-[9999] shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-x 3s ease infinite'
        }}
      >
        <div className="grid grid-cols-4 gap-2 p-3 px-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={localActiveTab === tab.id ? "default" : "ghost"}
              className={cn(
                "h-14 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]",
                localActiveTab === tab.id
                  ? "bg-white text-[#ec4899] shadow-pink-500/50"
                  : "text-white/90 hover:bg-white/20 hover:text-white bg-transparent"
              )}
              onClick={() => setLocalActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}