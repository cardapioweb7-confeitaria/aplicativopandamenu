"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function Inicio() {
  const navigate = useNavigate();
  const [nivel, setNivel] = useState('cliente');
  const [loadingNivel, setLoadingNivel] = useState(true);

  useEffect(() => {
    const fetchNivel = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          const userRole = data?.role || 'user';
          setNivel(userRole === 'admin' || userRole === 'owner' ? 'Administrador' : 'cliente');
        }
      } catch (error) {
        console.error('Erro ao buscar nível:', error);
        setNivel('cliente');
      } finally {
        setLoadingNivel(false);
      }
    };

    fetchNivel();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start md:justify-center pt-2 px-4 pb-8 md:p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 space-y-6">

        {/* CARD DE ACESSO - MODERNIZADO */}
        <Card className="w-full max-w-xs border-0 rounded-3xl overflow-hidden bg-white shadow-lg mt-6 md:mt-8">
          <CardContent className="relative pt-6 p-6 text-center">
            {/* BOTÃO SAIR VERMELHO - APENAS MOBILE - TOP-LEFT */}
            <div className="md:hidden absolute top-3 left-3 z-30">
              <Button
                variant="destructive"
                size="sm"
                className="px-3 py-1 text-xs font-semibold h-auto"
                onClick={handleLogout}
              >
                SAIR
              </Button>
            </div>

            {/* Status moderno */}
            <div className="space-y-3 mx-auto w-48 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-medium">Seu acesso é</span>
                <span className="bg-pink-700/80 text-white px-2 py-0.5 rounded-full font-semibold text-xs">
                  Vitalício
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Você agora é</span>
                <span className="bg-pink-700/80 text-white px-2 py-0.5 rounded-full font-semibold text-xs">
                  Premium
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Nível Atual</span>
                <span className="bg-pink-700/80 text-white px-2 py-0.5 rounded-full font-semibold text-xs">
                  {loadingNivel ? 'Carregando...' : nivel}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD Instale o App - mantido sem alterações */}
        <Card className="w-full max-w-md border-0 rounded-3xl overflow-hidden bg-[#010135] mt-6 relative">
          {/* Faixa "Recomendado" */}
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
            <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
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
              
              <div className="text-white text-base max-w-sm mx-auto leading-5 text-center space-y-0.5">
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
