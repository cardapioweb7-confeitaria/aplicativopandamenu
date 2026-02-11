"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Receitas() {
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Verificar role do usuário
  useEffect(() => {
    const fetchRole = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar role:', error);
          }

          setIsOwner(data?.role === 'owner');
        } catch (error) {
          console.error('Erro ao verificar role:', error);
        }
      }
      setLoadingRole(false);
    };

    fetchRole();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* ANIMAÇÃO DO GRADIENTE DOURADO */}
      <style>{`
        @keyframes goldGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* HERO */}
      <section className="relative w-full min-h-[40vh] flex flex-col items-center justify-start pt-12 text-center px-6">
        {/* LOGO */}
        <img 
          src="/101012.png" 
          alt="Logo Receitas" 
          className="mx-auto mb-4 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain drop-shadow-2xl"
        />

        {/* TÍTULO */}
        <h1 className="text-3xl md:text-5xl font-black mb-6 leading-[0.95]">
          <span className="block">Receitas</span>
          <span className="block text-transparent bg-clip-text bg-[linear-gradient(90deg,#b88900,#fbbf24,#ffffff,#fbbf24,#b88900)] bg-[length:300%_300%] animate-[goldGradient_6s_linear_infinite]">
            Profissionais
          </span>
        </h1>

        {/* BARRA DE PESQUISA */}
        <div className="relative w-full max-w-md mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar receitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg bg-white border border-gray-300 rounded-xl focus:outline-none shadow-none text-gray-900"
          />
        </div>

        {/* BOTÃO "Cadastrar Receita" - APENAS PARA OWNERS */}
        {!loadingRole && isOwner && (
          <div className="w-full max-w-md mx-auto">
            <Button 
              className="w-full h-14 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 hover:from-pink-700 hover:via-purple-700 hover:to-pink-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-6 h-6 mr-3" />
              Cadastrar Receita
            </Button>
          </div>
        )}
      </section>

      {/* CONTEÚDO ABAIXO - Grid de Cards */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="bg-[#1a1a1a] border-gray-800 hover:bg-[#262626] transition-all duration-200 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 group"
            >
              <CardHeader className="p-0">
                <div className="h-40 bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-pink-900 group-hover:to-purple-900 transition-all duration-300"></div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-pink-400 transition-colors">Receita {i + 1}</h3>
                <p className="text-sm text-gray-400 mb-3">Categoria Exemplo</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>⭐ 4.9</span>
                  <span>•</span>
                  <span>30 min</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}