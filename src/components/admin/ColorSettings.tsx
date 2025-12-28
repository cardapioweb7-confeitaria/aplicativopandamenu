import { useState } from 'react'

interface ColorSettingsProps {
  bannerGradient: string
  corBorda: string
  corNome: string
  onBannerGradientChange: (value: string) => void
  onCorBordaChange: (value: string) => void
  onCorNomeChange: (value: string) => void
  onSaveColors: () => void
  onApplyGradient: (gradient: any) => void
}

const gradientBackgrounds = [
  { name: 'Dourado Quente', gradient: 'linear-gradient(135deg, #F5C542 0%, #FFD700 50%, #FFA500 100%)' },
  { name: 'Rosa Pink', gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)' },
  { name: 'Azul Oceano', gradient: 'linear-gradient(135deg, #0066CC 0%, #0099FF 50%, #00CCFF 100%)' },
  { name: 'Verde Natureza', gradient: 'linear-gradient(135deg, #228B22 0%, #32CD32 50%, #90EE90 100%)' },
  { name: 'Roxo Elegante', gradient: 'linear-gradient(135deg, #663399 0%, #9370DB 50%, #BA55D3 100%)' }
]

export function ColorSettings({
  bannerGradient,
  corBorda,
  corNome,
  onBannerGradientChange,
  onCorBordaChange,
  onCorNomeChange,
  onSaveColors,
  onApplyGradient
}: ColorSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Banner Gradient Selection */}
      <div className="border-0 shadow-lg bg-white rounded-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#ec4899' }}>
          Gradiente do Banner
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {gradientBackgrounds.map((gradient, index) => (
            <button
              key={index}
              onClick={() => onApplyGradient(gradient)}
              className="relative h-24 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              style={{ background: gradient.gradient }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200" />
              <span className="absolute bottom-2 left-2 text-white text-sm font-semibold drop-shadow-lg">
                {gradient.name}
              </span>
              {bannerGradient === gradient.gradient && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Color Settings */}
      <div className="border-0 shadow-lg bg-white rounded-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#ec4899' }}>
          Cores do Layout
        </h3>
        
        <div className="space-y-6">
          {/* Cor da Borda */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cor da Borda
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={corBorda}
                onChange={(e) => onCorBordaChange(e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={corBorda}
                onChange={(e) => onCorBordaChange(e.target.value)}
                placeholder="#F5C542"
                className="flex-1 p-3 border border-gray-300 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Cor do Nome */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cor do Nome
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={corNome}
                onChange={(e) => onCorNomeChange(e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={corNome}
                onChange={(e) => onCorNomeChange(e.target.value)}
                placeholder="#FCEBB3"
                className="flex-1 p-3 border border-gray-300 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onSaveColors}
          className="w-full mt-6 py-3 px-8 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
        >
          Salvar Cores
        </button>
      </div>
    </div>
  )
}