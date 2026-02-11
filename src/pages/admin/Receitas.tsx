"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess } from "@/utils/toast";

export default function Receitas() {
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Verificar role do usuário com fallback hardcoded
  useEffect(() => {
    const fetchRole = async () => {
      console.log('🔍 [Receitas] Verificando role - user:', user?.email, 'user.id:', user?.id);
      
      if (!user) {
        console.log('❌ [Receitas] User não carregado');
        setLoadingRole(false);
        return;
      }

      try {
        // 1. Fallback hardcoded para teste@gmail.com
        if (user.email === 'teste@gmail.com') {
          console.log('✅ [Receitas] Fallback hardcoded: teste@gmail.com detectado');
          setIsOwner(true);
          setLoadingRole(false);
          return;
        }

        // 2. Fetch role do profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        console.log('🔍 [Receitas] Fetch profiles result:', { data, error });

        if (error && error.code !== 'PGRST116') {
          console.error('❌ [Receitas] Erro ao buscar role:', error);
        }

        const role = data?.role;
        console.log('🔍 [Receitas] Role do DB:', role);

        if (role === 'owner') {
          console.log('✅ [Receitas] Role owner confirmada via DB');
          setIsOwner(true);
        } else {
          console.log('❌ [Receitas] Role não é owner:', role);
          setIsOwner(false);
        }
      } catch (error) {
        console.error('❌ [Receitas] Erro ao verificar role:', error);
        setIsOwner(false);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, [user]);

  console.log('🔍 [Receitas] Render - isOwner:', isOwner, 'loadingRole:', loadingRole);

  if (loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verificando acesso...</p>
        </div>
      </div>
    );
  }

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
        {/* BOTÃO PEQUENO NO CANTO ESQUERDO SUPERIOR - APENAS PARA OWNERS */}
        {!loadingRole && isOwner && (
          <div className="absolute top-2 left-4 z-20">
            <Button 
              size="sm"
              className="px-3 py-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 border border-green-300"
              style={{
                backgroundColor: '#D4EDDA',
                color: '#155724',
                borderColor: '#C3E6CB'
              }}
              onClick={() => {
                console.log('🧁 [Receitas] Botão Cadastrar Receita clicado!')
                showSuccess('Funcionalidade em desenvolvimento!')
              }}
            >
              Cadastrar Receita
            </Button>
          </div>
        )}

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