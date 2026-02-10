import { ReactNode } from 'react'
import { ArrowLeft, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface DesktopLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const cardapioTabs = [
  { id: 'preview', label: 'Prévia do Cardápio' },
  { id: 'design', label: 'Design' },
  { id: 'products', label: 'Produtos' },
]

export function DesktopLayout({
  children,
  activeTab = 'preview',
  onTabChange,
}: DesktopLayoutProps) {
  const navigate = useNavigate()
  const [showCardapioMenu, setShowCardapioMenu] = useState(false)
  const systemName = import.meta.env.VITE_SYSTEM_NAME || 'Menu Bolo'

  const handleLogout = () => {
    localStorage.removeItem('supabase.auth.token')
    localStorage.removeItem('user_session')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-pink-50 flex">
      {/* MENU LATERAL FIXO */}
      <div
        className="w-64 flex flex-col fixed left-0 top-0 bottom-0 z-50"
        style={{
          background:
            'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
          animation: 'gradient-x 3s ease infinite',
          backgroundSize: '200% 200%',
        }}
      >
        <div className="p-8 pt-12">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-40 h-40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                <img
                  src="/logointernaadmin.png"
                  alt={`${systemName} Logo`}
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 pt-0">
          <div className="space-y-3">
            {!showCardapioMenu ? (
              // Menu principal - apenas Cardápio
              <Button
                onClick={() => setShowCardapioMenu(true)}
                className="w-full justify-start gap-3 h-12 text-white hover:bg-white/20 hover:text-white"
              >
                <Menu size={20} />
                <span className="font-[650]">Cardápio</span>
              </Button>
            ) : (
              // Submenu do Cardápio com Voltar
              <div className="space-y-2">
                <Button
                  onClick={() => setShowCardapioMenu(false)}
                  className="w-full justify-start gap-3 h-10 text-white/80 hover:bg-white/20 hover:text-white"
                >
                  <ArrowLeft size={18} />
                  <span className="font-[600]">Voltar</span>
                </Button>
                
                {cardapioTabs.map((tab) => {
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3 h-12 text-white hover:bg-white/20 hover:text-white',
                        activeTab === tab.id
                          ? 'bg-white text-[#ec4899] hover:bg-white hover:text-[#ec4899]'
                          : ''
                      )}
                      onClick={() => onTabChange?.(tab.id)}
                    >
                      <span className="font-[650]">{tab.label}</span>
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 pb-8 space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 text-white bg-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-[650]">Sair</span>
          </Button>
          
          <div className="text-center">
            <p className="text-white/70 text-xs">
              © 2025 {systemName}
            </p>
            <p className="text-white/60 text-xs">
              Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  )
}