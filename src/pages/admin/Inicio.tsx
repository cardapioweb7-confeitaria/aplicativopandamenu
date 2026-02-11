"use client";

import { Card, CardContent } from '@/components/ui/card'
import { Edit } from 'lucide-react'

export default function Inicio() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start md:justify-center pt-2 px-4 pb-8 md:p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <Card className="w-full max-w-md border-0 rounded-3xl overflow-hidden bg-white">
          <CardContent className="pt-4 md:pt-12 p-8 md:p-12 pb-16 md:pb-20 text-center">
            {/* Logo EXATA do cardapio público + borda rosa ANIMADA */}
            <div className="relative mx-auto mb-2 w-48 h-48">
              {/* Anel gradient FULL SIZE - borda colorida externa girando SOZINHA */}
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 animate-[spin_6s_linear_infinite]"
                style={{
                  zIndex: 1,
                  filter: 'blur(0px)'
                }}
              />
              
              {/* Container ESTÁTICO da imagem + bordas internas (z-10 > girando) */}
              <div 
                className="relative z-10 w-full h-full flex items-center justify-center rounded-full"
                style={{
                  padding: '6px',
                  backgroundClip: 'content-box',
                  WebkitBackgroundClip: 'content-box',
                  boxSizing: 'border-box'
                }}
              >
                {/* Borda branca interna + padding - EXATO do Logo.tsx */}
                <div 
                  className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white"
                  style={{
                    border: '3px solid white',
                    padding: '2px'
                  }}
                >
                  {/* Imagem PREENCHE perfeitamente - object-cover para foto ESTÁTICA */}
                  <img 
                    src="/1012.jpeg" 
                    alt="Foto" 
                    className="w-full h-full object-cover rounded-full block" 
                  />
                </div>
              </div>
            </div>

            {/* Nome do Cliente com ícone de lápis inline na mesma linha */}
            <div className="flex items-center justify-center gap-2 mb-6 p-4 rounded-2xl bg-white">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Olá Bruno</h1>
              <button 
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all cursor-pointer group border border-gray-100 flex-shrink-0"
                title="Alterar nome (em breve)"
                type="button"
              >
                <Edit className="w-5 h-5 text-gray-500 group-hover:text-pink-500 transition-colors" />
              </button>
            </div>

            {/* Status simples - texto empilhado sem background, centralizado no bloco mas alinhado à esquerda */}
            <div className="space-y-2 mx-auto w-80 text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold text-gray-800">Sua conta é</span>
                <span className="inline-block bg-[#660033] text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  Premium
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold text-gray-800">Seu acesso é</span>
                <span className="inline-block bg-[#660033] text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  Vitalício
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold text-gray-800">Meu Nível é</span>
                <span className="inline-block bg-[#660033] text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  Iniciante
                </span>
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