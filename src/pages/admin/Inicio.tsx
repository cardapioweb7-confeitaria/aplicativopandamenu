"use client";

import { Card, CardContent } from '@/components/ui/card'
import { Edit } from 'lucide-react'

export default function Inicio() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center pt-2 px-4 pb-8 md:p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Card className="w-full max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
        <CardContent className="pt-4 md:pt-12 p-8 md:p-12 pb-16 md:pb-20 text-center">
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
                <div className="text-7xl">🎂</div>
              </div>
            </div>
          </div>

          {/* Nome do Cliente com ícone de lápis (visual apenas) */}
          <div className="relative mb-10 p-6 rounded-2xl border border-dotted border-gray-200/50 shadow-sm">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Bruno</h1>
            <button 
              className="absolute -top-3 -right-3 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all cursor-pointer group border border-gray-100"
              title="Alterar nome (em breve)"
              type="button"
            >
              <Edit className="w-4 h-4 text-gray-500 group-hover:text-pink-500 transition-colors" />
            </button>
          </div>

          {/* Tags de Status com fundo creme/amarelo */}
          <div className="space-y-4">
            {/* Status do Sistema */}
            <div className="w-full flex items-center justify-center p-4 bg-amber-50 rounded-2xl shadow-lg border border-amber-200 whitespace-nowrap">
              <span className="text-lg font-bold text-emerald-900 whitespace-nowrap">Status do Sistema: Online</span>
            </div>

            {/* Seu Acesso */}
            <div className="w-full flex items-center justify-center p-4 bg-amber-50 rounded-2xl shadow-lg border border-amber-200 whitespace-nowrap">
              <span className="text-lg font-bold text-emerald-900 whitespace-nowrap">Seu acesso: Vitalício</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}