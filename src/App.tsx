import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import AuthProvider from '@/components/auth/AuthProvider'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import PublicRoute from '@/components/auth/PublicRoute'

const Index = lazy(() => import('@/pages/Index'))
const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const CardapioPublico = lazy(() => import('@/pages/CardapioPublico'))
const ReceitasPage = lazy(() => import('@/pages/Receitas'))

function App() {
  return (
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Carregando...</div>}>
            <Routes>
              <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/:slug" element={<PublicRoute><CardapioPublico /></PublicRoute>} />
              <Route path="/receitas" element={<ProtectedRoute><ReceitasPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
      <Toaster />
    </TooltipProvider>
  )
}

export default App