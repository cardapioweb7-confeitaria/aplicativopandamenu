"use client";

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

export default function Inicio() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start md:justify-center pt-2 px-4 pb-8 md:p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <Card className="w-full max-w-md border-0 rounded-3xl overflow-hidden bg-white mt-8 md:mt-12">
          <CardContent className="pt-12 md:pt-20 p-8 md:p-12 pb-8 md:pb-12 text-center">
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
            <div className="space-y-2 mx-auto w-64 p-6 rounded-2xl border-2 border-dashed border-pink-300 bg-white/50 shadow-lg backdrop-blur-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="grid grid-cols-[1fr_auto] items-center gap-1">
                <span className="text-lg font-medium text-gray-800">Seu acesso é</span>
                <span className="inline-block bg-[#660033]/70 text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  Vitalício
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-1">
                <span className="text-lg font-medium text-gray-800">Você agora é</span>
                <span className="inline-block bg-[#660033]/70 text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  Premium
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-1">
                <span className="text-lg font-medium text-gray-800">Nível Atual é</span>
                <span className="inline-block bg-[#660033]/70 text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  Iniciante
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NOVO CARD: Instale o App - AZUL ESCURO #010135 + faviconapp.png + layout empilhado centralizado responsivo */}
        <Card className="w-full max-w-md border-0 rounded-3xl overflow-hidden bg-[#010135] mt-6">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-6">
              {/* Ícone faviconapp.png com fundo BRANCO - centralizado e responsivo */}
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shrink-0">
                <img 
                  src="/faviconapp.png" 
                  alt="App" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              
              {/* Textos centralizados - SUBTEXTO EM DUAS LINHAS EXATAS */}
              <div className="text-gray-200 text-sm max-w-sm mx-auto leading-6 text-center space-y-1">
                <span>Acesse todas as funcionalidades</span>
                <span>de forma rápida</span>
              </div>
              
              {/* Botão NEON ROSA abaixo, centralizado full-width responsivo */}
              <Button 
                className="w-full max-w-xs h-14 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 hover:from-pink-500 hover:via-rose-500 hover:to-fuchsia-600 text-white font-bold text-lg rounded-2xl px-8 shadow-lg shadow-pink-500/50 hover:shadow-xl hover:shadow-pink-500/70 transition-all duration-300 glow-neon"
              >
                Instalar
              </Button>
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
        .glow-neon {
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
        }
        @media (hover: hover) {
          .glow-neon:hover {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.8);
          }
        }
      `}</style>
    </>
  )
}