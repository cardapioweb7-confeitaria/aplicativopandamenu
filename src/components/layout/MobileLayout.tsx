import { ReactNode } from 'react'
import { ArrowLeft, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const cardapioTabs = [
  { id: 'preview', label: 'Prévia' },
  { id: 'design', label: 'Design' },
  { id: 'products', label: 'Produtos' },
]

export function MobileLayout({ children, activeTab = 'preview', onTabChange }: MobileLayoutProps) {
  const [showCardapioMenu, setShowCardapioMenu] = useState(false)

  const logoUrl = import.meta.env.VITE_SYSTEM_LOGO_URL

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <div className="flex-1 pb-16">
        {children}
      </div>
      
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-pink-200 rounded-t-2xl z-50"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
          animation: 'gradient-x 3s ease infinite',
          backgroundSize: '200% 200%'
        }}
      >
        <div className="grid grid-cols-1 gap-1 p-2">
          {!showCardapioMenu ? (
            // Menu principal - apenas Cardápio
            <Button
              onClick={() => setShowCardapioMenu(true)}
              className="w-full h-14 rounded-xl font-[700] text-base bg-white text-pink-600 hover:bg-gray-50 transition-all"
            >
              <Menu className="w-5 h-5 mr-2" />
              Cardápio
            </Button>
          ) : (
            // Submenu do Cardápio com Voltar
            <div className="space-y-2">
              <Button
                onClick={() => setShowCardapioMenu(false)}
                className="w-full h-12 rounded-lg font-[600] text-sm bg-white/20 text-white hover:bg-white/30 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              
              <div className="grid grid-cols-3 gap-1">
                {cardapioTabs.map((tab) => {
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'ghost'}
                      className={cn(
                        "flex items-center justify-center h-12 rounded-lg font-[700] text-xs",
                        activeTab === tab.id 
                          ? "bg-white text-[#ec4899] hover:bg-white hover:text-[#ec4899]"
                          : "text-[#fce7f3] hover:bg-[#f9a8d4]/20 hover:text-white"
                      )}
                      onClick={() => onTabChange?.(tab.id)}
                    >
                      <span
                        className={cn(
                          "text-xs font-[700]",
                          activeTab === tab.id
                            ? "text-[#ec4899]"
                            : "text-[#fce7f3]"
                        )}
                      >
                        {tab.label}
                      </span>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}