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
          background: 'linear-gradient(135deg, #ff6fae 30%, #ff9acb 50%, #ff9acb 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-x 10s ease infinite'
        }}
      >
        {/* Logo / Espaço superior */}
        <div className="p-10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-white tracking-wider">🍰 Panda Menu</h1>
            <p className="text-white/80 text-sm mt-1">Confeitaria & Receitas</p>
          </div>
        </div>

        {/* Menu de Tabs */}
        <div className="flex-1 px-6 py-10 space-y-4">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="default"
              style={{
                backgroundColor: activeTab === tab ? undefined : "#E33688", // Cor fixa quando inativo
                backgroundImage: activeTab === tab
                  ? "linear-gradient(90deg, #FFD700, #FFC700, #FFB700)" // ✅ Gradiente dourado do botão ativo
                  : undefined
              }}
              className={cn(
                "w-full text-center rounded-2xl font-bold text-white text-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.97] py-6", // ✅ removi h-16, usei padding
                activeTab === tab
                  ? "shadow-[0_0_15px_#FF72A1] bg-clip-padding" // Glow dourado
                  : ""
              )}
              onClick={() => onTabChange(tab)}
            >
              {labels[tab]}
            </Button>
          ))}
        </div>

        {/* Rodapé */}
        <div className="p-6 pb-8 border-t border-pink-300">
          <Button
            variant="outline"
            className="w-fit justify-start gap-3 h-14 text-white bg-white/20 border-white/30 hover:bg-white/30 hover:text-white transition-all rounded-3xl"
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
      <div className="flex-1 ml-72 bg-gradient-to-b from-pink-50 via-pink-25 to-white min-h-screen p-8">
        {content}
      </div>
    </div>
  )
}
