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
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-start pt-24 text-center px-6">

        {/* Imagem centralizada acima do título */}
        <img 
          src="/101012.png" 
          alt="Logo Receitas" 
          className="mx-auto mb-8 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 object-contain drop-shadow-2xl"
        />

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
          Receitas
          <br />
          <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#b88900,#fbbf24,#ffffff,#fbbf24,#b88900)] bg-[length:300%_300%] animate-[goldGradient_6s_linear_infinite]">
            Profissionais
          </span>
        </h1>

        <p className="text-xl md:text-2xl max-w-2xl leading-relaxed mb-8">
          Descubra receitas incríveis <br />
          para elevar sua confeitaria para <br />
          o{" "}
          <span className="text-[#fbbf24] font-semibold underline underline-offset-4 decoration-2">
            próximo Nível!
          </span>
        </p>

        {/* Barra de pesquisa branca sem sombras */}
        <div className="relative w-full max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full pl-6 pr-12 py-4 text-lg bg-white border border-gray-300 rounded-xl focus:outline-none shadow-none text-gray-900"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Seção Recém Adicionados - 2x2 grid */}
        <div className="w-full max-w-4xl mb-12">
          <h2 className="text-2xl md:text-3xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
            Recém Adicionados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer group"
              >
                <div className="h-32 bg-[#262626] rounded-xl mb-4 group-hover:bg-[#333333] transition-colors duration-300"></div>
                <h3 className="font-semibold mb-2 text-white group-hover:text-yellow-400 transition-colors">Receita {i + 1}</h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Categoria</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* CONTEÚDO ABAIXO (exemplo visual) */}
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