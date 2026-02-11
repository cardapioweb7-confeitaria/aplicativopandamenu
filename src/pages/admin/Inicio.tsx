"use client";

import { Card, CardContent } from '@/components/ui/card'
import { Edit, Circle } from 'lucide-react'

export default function Inicio() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{
           background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
         }}>
      <Card className="w-full max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden" 
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        <CardContent className="p-12 pt-20 pb-20 text-center">
          {/* Logo com bordas duplas: externa rosa, interna branca */}
          <div className="relative mx-auto mb-8 group">
            {/* Borda externa ROSA (dupla para profundidade) */}
            <div className="absolute inset-0 mx-8 my-8 rounded-full border-8 border-pink-400 shadow-2xl group-hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 mx-6 my-6 rounded-full border-8 border-pink-500 shadow-2xl" />
            </div>
            
            {/* Container interno com borda BRANCA dupla */}
            <div className="relative z-10 w-48 h-48 bg-gradient-to-br from-white to-gray-50 shadow-3xl rounded-full border-12 border-white p-6 flex items-center justify-center">
              {/* Placeholder do logo - emoji de bolo */}
              <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-pink-50 to-white shadow-inner p-8">
                <div className="text-7xl animate-bounce-slow">🎂</div>
              </div>
            </div>
          </div>

          {/* Nome do Cliente com ícone de lápis (visual apenas) */}
          <div className="relative mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Bruno</h1>
            <button 
              className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all cursor-pointer group"
              title="Alterar nome (em breve)"
              onClick={() => {}} // Visual apenas
            >
              <Edit className="w-5 h-5 text-gray-500 group-hover:text-pink-500 transition-colors" />
            </button>
          </div>

          {/* Tags de Status com bolinha verde pulsante */}
          <div className="space-y-4">
            {/* Status do Sistema */}
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl shadow-lg border border-emerald-200">
              <div className="relative">
                <Circle className="w-6 h-6 text-emerald-500 animate-ping-slow" />
                <Circle className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
              </div>
              <span className="text-lg font-bold text-emerald-900">Status do Sistema: Online</span>
            </div>

            {/* Seu Acesso */}
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl shadow-lg border border-emerald-200">
              <div className="relative">
                <Circle className="w-6 h-6 text-emerald-500 animate-ping-slow" style={{ animationDelay: '0.25s' }} />
                <Circle className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse-slow" />
              </div>
              <span className="text-lg font-bold text-emerald-900">Seu acesso: Vitalício</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes ping-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}