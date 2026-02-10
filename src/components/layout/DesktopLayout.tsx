"use client";

import { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DesktopLayoutProps {
  tabs: string[]
  labels: Record<string, string>
  activeTab: string
  onTabChange: (tab: string) => void
  content: ReactNode
}

export function DesktopLayout({
  tabs,
  labels,
  activeTab,
  onTabChange,
  content
}: DesktopLayoutProps) {
  const handleLogout = () => {
    localStorage.removeItem('supabase.auth.token')
    localStorage.removeItem('user_session')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-pink-50 flex">
      {/* Sidebar fixa esquerda */}
      <div 
        className="w-72 border-r border-pink-200 flex flex-col shadow-2xl fixed left-0 top-0 bottom-0 z-50"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-x 3s ease infinite'
        }}
      >
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <img 
              src="/logointernaadmin.png" 
              alt="Panda Menu" 
              className="w-32 h-32 mx-auto mb-4 rounded-2xl shadow-lg"
            />
            <h1 className="text-white text-2xl font-bold mb-1">Panda Menu</h1>
            <p className="text-white/80 text-sm">Cardápio Digital</p>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-3">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-16 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]",
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

        <div className="p-6 pb-8 border-t border-pink-300">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-14 text-white bg-white/20 border-white/30 hover:bg-white/30 hover:text-white transition-all"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
          <div className="text-center mt-4">
            <p className="text-white/70 text-xs">© 2025 Panda Menu</p>
            <p className="text-white/60 text-xs">Todos os direitos reservados</p>
          </div>
        </div>
      </div>

      {/* Conteúdo principal com padding left */}
      <div className="flex-1 ml-72">
        <div className="p-8">
          {content}
        </div>
      </div>
    </div>
  )
}