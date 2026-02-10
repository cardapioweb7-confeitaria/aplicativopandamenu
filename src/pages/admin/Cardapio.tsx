"use client";

import DesignSettings from './DesignSettings'
import ProductManager from './ProductManager'

export default function Cardapio() {
  return (
    <div className="space-y-8">
      {/* Tabs internas para Design e Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Design</h2>
          <DesignSettings />
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Produtos</h2>
          <ProductManager />
        </div>
      </div>
    </div>
  )
}