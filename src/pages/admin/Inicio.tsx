"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function Inicio() {
  const navigate = useNavigate();
  const [openNotifications, setOpenNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleWhatsAppGroup = () => {
    window.open('https://chat.whatsapp.com/EXEMPLO_DO_SEU_GRUPO', '_blank');
  };

  const toggleNotifications = () => {
    setOpenNotifications(!openNotifications);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start pt-6 px-4 pb-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative">

        {/* TOPO - SAIR ESQUERDA / SINO DIREITA */}
        <div className="w-full max-w-md flex justify-between items-center mb-4">
          
          <Button
            variant="destructive"
            size="sm"
            className="px-3 py-1 text-xs font-semibold"
            onClick={handleLogout}
          >
            SAIR
          </Button>

          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <img
              src="/sinonotifica.gif"
              alt="Notificações"
              className="w-7 h-7 object-contain"
            />
          </button>

        </div>

        {/* PAINEL DE NOTIFICAÇÕES */}
        <div
          className={`fixed top-0 left-0 w-full flex justify-center transition-all duration-300 z-50 ${
            openNotifications ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <div className="w-full max-w-md bg-white rounded-b-3xl shadow-xl p-6 mt-2">
            
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Últimas notificações
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-100 rounded-xl text-sm text-slate-700">
                Nova receita adicionada 🍰
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-sm text-slate-700">
                Atualização do app disponível 🚀
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-sm text-slate-700">
                Novo conteúdo liberado 🎉
              </div>
            </div>

            <button
              onClick={toggleNotifications}
              className="mt-5 w-full text-sm text-slate-500 hover:text-slate-700 transition"
            >
              Fechar
            </button>

          </div>
        </div>

        {/* CARD Instale o App */}
        <Card className="w-full max-w-md border-0 rounded-3xl overflow-hidden bg-[#010135] relative">
          
          <div 
            className="absolute top-4 -right-12 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold px-6 py-2 transform rotate-45 shadow-lg z-10"
            style={{ 
              width: '180px',
              textAlign: 'center',
              fontSize: '0.8rem'
            }}
          >
            Recomendado
          </div>
          
          <CardContent className="p-8 text-center pt-16 md:pt-20">
            <div className="flex flex-col items-center space-y-6 w-full max-w-xs mx-auto">
              
              <div className="flex items-center gap-4 justify-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-2xl">
                  <img 
                    src="/faviconapp.png" 
                    alt="App" 
                    className="w-10 h-10 object-contain"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight text-left leading-tight">
                  INSTALE<br />NOSSO APP
                </h2>
              </div>
              
              <div className="text-white text-base leading-5 text-center space-y-0.5">
                <span className="block">Todas as funcionalidades na</span>
                <span className="block">palma da sua mão agora!</span>
              </div>
              
              <Button 
                className="w-full h-14 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-gray-900 font-bold text-lg rounded-2xl px-8 shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/70 transition-all duration-300 glow-neon"
              >
                Instalar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BANNER DO GRUPO WHATSAPP */}
        <div className="w-full max-w-md mt-6">
          <button
            onClick={handleWhatsAppGroup}
            className="w-full rounded-3xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <img
              src="/grupowhatsapp.png"
              alt="Junte-se ao nosso grupo WhatsApp"
              className="w-full h-auto object-contain"
            />
          </button>
        </div>

      </div>

      <style>{`
        .glow-neon {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
        }
        @media (hover: hover) {
          .glow-neon:hover {
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.8);
          }
        }
      `}</style>
    </>
  )
}
