"use client";

import { Card, CardContent } from '@/components/ui/card'
import { Edit, Circle } from 'lucide-react'

export default function Inicio() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Card className="w-full max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-12 pt-20 pb-20 text-center">
          {/* Logo com bordas duplas: externa rosa e interna branca */}
          <div className="relative mx-auto mb-8 w-48 h-48 group">
            {/* Borda externa ROSA (dupla para profundidade) */}
            <div className="absolute inset-0 mx-8 my-8 rounded-full border-8 border-pink-400 shadow-2xl group-hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 mx-6 my-6 rounded-full border-8 border-pink-500 shadow-2xl" />
            </div>
            
            {/* Container interno com borda BRANCA dupla */}
            <div className="relative z-10 w-full h-full bg-gradient-to-br from-white to-slate-50 shadow-3xl rounded-full border-12 border-white p-6 flex items-center justify-center">
              {/* Placeholder do logo - emoji de bolo */}
              <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-pink-50 to-white shadow-inner p-8">
                <div className="text-7xl animate-bounce [animation-duration:3s]">🎂</div>
              </div>
            </div>
          </div>

          {/* Nome do Cliente com ícone de lápis (visual apenas) */}
          <div className="relative mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Bruno</h1>
            <button 
              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all cursor-pointer group"
              title="Alterar nome (em breve)"
              type="button"
            >
              <Edit className="w-5 h-5 text-gray-500 group-hover:text-pink-500 transition-colors" />
            </button>
          </div>

          {/* Tags de Status com bolinha verde pulsante */}
          <div className="space-y-4">
            {/* Status do Sistema */}
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl shadow-lg border border-emerald-200">
              <div className="relative">
                <Circle className="w-6 h-6 text-emerald-500 animate-ping [animation-duration:2s] [animation-delay:0s]" />
                <Circle className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse [animation-duration:3s] [animation-delay:0.5s]" />
              </div>
              <span className="text-lg font-bold text-emerald-900">Status do Sistema: Online</span>
            </div>

            {/* Seu Acesso */}
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl shadow-lg border border-emerald-200">
              <div className="relative">
                <Circle className="w-6 h-6 text-emerald-500 animate-ping [animation-duration:2s] [animation-delay:0.25s]" />
                <Circle className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse [animation-duration:3s]" />
              </div>
              <span className="text-lg font-bold text-emerald-900">Seu acesso: Vitalício</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}