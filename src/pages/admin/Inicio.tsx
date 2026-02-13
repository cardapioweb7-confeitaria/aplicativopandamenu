"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function Inicio() {
  const navigate = useNavigate();
  const [openNotifications, setOpenNotifications] = useState(false);

  /* 🔒 BLOQUEIO DE SCROLL */
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

  const toggleNotifications = () => {
    setOpenNotifications(!openNotifications);
  };

  const closeNotifications = () => {
    setOpenNotifications(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center pt-6 px-4 pb-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">

        {/* TOPO */}
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
            className="p-2 rounded-full hover:scale-105 active:scale-95 transition"
          >
            <img
              src="/sinonotifica.png"
              alt="Notificações"
              className="w-7 h-7"
            />
          </button>
        </div>

        {/* RESTO DO SEU CONTEÚDO AQUI */}

      </div>

      {/* OVERLAY + PAINEL */}
      {openNotifications && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-start pt-16 bg-black/30 backdrop-blur-sm px-4"
          onClick={closeNotifications}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-6 animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ❌ BOTÃO X */}
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
