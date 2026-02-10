"use client";

import { useDatabase } from '@/hooks/useDatabase'
import { PreviewContent } from '@/components/admin/PreviewContent'

export default function Inicio() {
  const { designSettings, configuracoes, produtos, loading } = useDatabase()

  if (loading || !designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Stats rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-2xl font-bold text-pink-600">{produtos.length}</h3>
          <p className="text-gray-600 text-sm">Produtos</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-2xl font-bold text-green-600">{configuracoes?.total_pedidos || 0}</h3>
          <p className="text-gray-600 text-sm">Pedidos</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-2xl font-bold text-blue-600">{configuracoes?.avaliacao_media?.toFixed(1) || '4.9'}</h3>
          <p className="text-gray-600 text-sm">Avaliação</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-2xl font-bold text-purple-600">Online</h3>
          <p className="text-gray-600 text-sm">Status</p>
        </div>
      </div>

      {/* Prévia do cardápio */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-pink-500 to-purple-500">
          <h2 className="text-2xl font-bold text-white">Prévia do Seu Cardápio</h2>
          <p className="text-white/90">Como seus clientes verão</p>
        </div>
        <div className="p-6 max-h-[70vh] overflow-auto">
          <PreviewContent
            designSettings={designSettings}
            configuracoes={configuracoes}
            produtos={produtos}
            searchTerm=""
            selectedCategory={null}
            favorites={[]}
            onSearchChange={() => {}}
            onCategorySelect={() => {}}
            onToggleFavorite={() => {}}
          />
        </div>
      </div>
    </div>
  )
}