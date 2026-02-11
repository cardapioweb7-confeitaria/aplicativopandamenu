"use client";

import { ReactNode, useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileLayoutProps {
  tabs: string[]
  labels: Record<string, string>
  activeTab: string
  onTabChange: (tab: string) => void
  showBack?: boolean
  onBack?: () => void
  content: ReactNode
}

export function MobileLayout({ tabs, labels, activeTab, onTabChange, showBack = false, onBack, content }: MobileLayoutProps) {
  const [showNav, setShowNav] = useState(true)

  const toggleNav = () => {
    setShowNav(!showNav)
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <div className="flex-1 pb-28"> {/* pb-28 = 112px → cobre nav + margem segura */}
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
        <div className="h-full overflow-y-auto"> {/* Scroll seguro no conteúdo */}
          {content}
        </div>
      </div>
      
      {/* Nav colapsível com animação */}
      <AnimatePresence mode="wait">
        {showNav ? (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-0 left-0 right-0 border-t border-pink-200 rounded-t-3xl z-[9999] shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient-x 3s ease infinite'
            }}
          >
            <div className="relative">
              {/* Botão central para ocultar - METEDE DENTRO / METEDE FORA */}
              <div className="absolute left-1/2 top-[-20px] -translate-x-1/2 z-20">
                <Button
                  onClick={toggleNav}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-xl shadow-2xl border-3 border-white/80 hover:bg-white hover:scale-110 transition-all duration-200"
                >
                  <ChevronDown className="w-4 h-4 text-pink-600" />
                </Button>
              </div>
              
              {/* Tabs sem padding extra - botão não cobre */}
              <div className="grid grid-cols-3 gap-2 p-3 px-6 pb-4">
                {tabs.map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "ghost"}
                    className={cn(
                      "h-14 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]",
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
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '100%' }}
            exit={{ y: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999]"
          >
            <Button
              onClick={toggleNav}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-white/95 backdrop-blur-xl shadow-2xl border-4 border-white hover:bg-white hover:scale-110 transition-all duration-200"
            >
              <ChevronUp className="w-5 h-5 text-pink-600" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}