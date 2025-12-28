import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BannerProps {
  logoUrl?: string
  borderColor: string
  bannerGradient?: string
  showLogoutButton?: boolean
}

export function Banner({ 
  logoUrl, 
  borderColor, 
  bannerGradient,
  showLogoutButton = false
}: BannerProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div 
      className="w-full"
      style={{ 
        position: 'relative', 
        height: '220px', // Aumentado de 180px para 220px
        overflow: 'hidden',
        backgroundImage: bannerGradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-x 3s ease infinite'
      }} 
    >
      {showLogoutButton && (
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-white/90 hover:bg-white text-gray-700 border-white/50 backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      )}
    </div>
  )
}