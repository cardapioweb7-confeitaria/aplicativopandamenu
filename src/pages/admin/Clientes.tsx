"use client";

import { useDatabase } from '@/hooks/useDatabase'

export default function Clientes() {
  const { designSettings, loading } = useDatabase()

  if (loading || !designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md w-full text-center">
        <div 
          className="p-12 rounded-3xl shadow-2xl border-4 border-dashed"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
            color: 'white'
          }}
        >
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔧</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Em Manutenção</h1>
          <p className="text-lg opacity-90 mb-8">
            Esta seção está sendo preparada para você.
          </p>
          <p className="text-sm opacity-80">
            Volte em breve para mais funcionalidades!
          </p>
        </div>
      </div>
    </div>
  )
}