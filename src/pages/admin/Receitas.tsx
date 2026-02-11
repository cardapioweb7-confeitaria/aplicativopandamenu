"use client";

import React from "react";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* ANIMAÇÃO DO GRADIENTE DOURADO */}
      <style>
        {`
          @keyframes goldGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {/* HERO */}
      <section className="relative w-full min-h-[55vh] flex flex-col items-center justify-start pt-12 text-center px-6">

        {/* LOGO */}
        <img 
          src="/101012.png" 
          alt="Logo Receitas" 
          className="mx-auto mb-6 w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain drop-shadow-2xl"
        />

        {/* TÍTULO */}
        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[0.95]">
          <span className="block">Receitas</span>
          <span className="block text-transparent bg-clip-text bg-[linear-gradient(90deg,#b88900,#fbbf24,#ffffff,#fbbf24,#b88900)] bg-[length:300%_300%] animate-[goldGradient_6s_linear_infinite]">
            Profissionais
          </span>
        </h1>

        {/* BARRA DE PESQUISA */}
        <div className="relative w-full max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full pl-6 pr-12 py-4 text-lg bg-white border border-gray-300 rounded-xl focus:outline-none shadow-none text-gray-900"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

      </section>

      {/* CONTEÚDO ABAIXO */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] p-6 rounded-2xl"
            >
              <div className="h-32 bg-[#262626] rounded-xl mb-4"></div>
              <h3 className="font-semibold mb-2">Receita {i + 1}</h3>
              <p className="text-sm text-gray-400">Categoria</p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}
