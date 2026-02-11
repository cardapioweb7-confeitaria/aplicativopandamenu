"use client";

import { Card, CardContent } from '@/components/ui/card'
import { Edit } from 'lucide-react'

export default function Inicio() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start md:justify-center pt-2 px-4 pb-8 md:p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <Card className="w-full max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="pt-4 md:pt-12 p-8 md:p-12 pb-16 md:pb-20 text-center">
            {/* Logo EXATA do cardapio público + borda rosa ANIMADA */}
            <div className="relative mx-auto mb-8 w-48 h-48">
              {/* Anel gradient FULL SIZE - borda colorida externa girando */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 animate-[spin_6s_linear_infinite]" />
              
              {/* Outer: CONIC-GRADIENT BORDER ANIMADO + padding - substitui solid border */}
              <div 
                className="absolute inset-0 rounded-full shadow-lg flex items-center justify-center bg-transparent animate-spin-border"
                style={{
                  padding: '3px',
                  backgroundImage: 'conic-gradient(#ec4899 0deg, #f472b6 90deg, #ec4899 180deg, #f472b6 270deg, #ec4899 360deg)',
                  backgroundClip: 'content-box',
                  WebkitBackgroundClip: 'content-box',
                  boxSizing: 'border-box' as const
                }}
              >
                {/* Inner: white border + padding - EXATO do Logo.tsx */}
                <div 
                  className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white"
                  style={{
                    border: '3px solid white',
                    padding: '2px'
                  }}
                >
                  {/* Imagem PREENCHE perfeitamente - object-cover para foto */}
                  <img 
                    src="/1012.jpeg" 
                    alt="Foto" 
                    className="w-full h-full object-cover rounded-full block shadow-lg" 
                  />
                </div>
              </div>
            </div>

            {/* Nome do Cliente com ícone de lápis (visual apenas) */}
            <div className="relative mb-10 p-6 rounded-2xl bg-white">
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

      <style>{`
        @keyframes spin-border {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-border {
          animation: spin-border 3s linear infinite;
        }
      `}</style>
    </>
  )
}