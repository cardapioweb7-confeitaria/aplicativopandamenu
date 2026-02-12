import { Navigate } from 'react-router-dom'
import { useAuthContext } from './AuthProvider'
import { ReactNode } from 'react'
import { LoadingScreen } from '@/components/admin/LoadingScreen'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return <LoadingScreen message="Verificando autenticação..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}