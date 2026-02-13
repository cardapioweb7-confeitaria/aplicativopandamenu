"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Inicio() {
  const navigate = useNavigate();
  const [openNotifications, setOpenNotifications] = useState(false);
  const isMobile = useIsMobile();

  /* 🔒 BLOQUEIA SCROLL */
  useEffect(() => {
    if (openNotifications) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openNotifications]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  const handleWhatsAppGroup = () => {
    window.open('https://chat.whatsapp.com/EXEMPLO_DO_SEU_GRUPO', '_blank');
  };

  const toggleNotifications = () => {
    setOpenNotifications(!openNotifications);
  };

  const closeNotifications = () => {
    setOpenNotifications(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start pt-6 px-4 pb-8 bg-white">

        {/* TOPO */}
        <div className="w-full max-w-md flex justify-between items-center mb-4">
          
          {isMobile && (
            <Button
              variant="destructive"
              size="sm"
              className="px-3 py-1 text-xs font-semibold"
              onClick={handleLogout}
            >
              SAIR
            </Button>
          )}

          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:scale-105 active:scale-95 transition"
          >
            <img
              src="/alarme.png"
              alt="Notificações"
              className="w-7 h-7"
            />
          </button>
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
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-2xl">
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
                className="w-full h-14 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-gray-900 font-bold text-lg rounded-2xl px-8 shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/70 transition-all duration-300"
              >
                Instalar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BANNER WHATSAPP */}
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

      {/* OVERLAY + NOTIFICAÇÕES */}
      {openNotifications && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-start pt-16 bg-black/30 backdrop-blur-sm px-4"
          onClick={closeNotifications}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-6 animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            {/* BOTÃO X */}
            <button
              onClick={closeNotifications}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Últimas notificações
            </h3>

            <div className="space-y-4">

              <div className="flex gap-3 p-4 bg-slate-100 rounded-xl">
                <img
                  src="/favicon.png"
                  alt="App"
                  className="w-6 h-6 mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm text-slate-800">
                    Nova receita adicionada
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    13/02/2026 • 14:32
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-slate-100 rounded-xl">
                <img
                  src="/favicon.png"
                  alt="App"
                  className="w-6 h-6 mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm text-slate-800">
                    Atualização do app disponível
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    12/02/2026 • 09:10
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </>
  );
}