"use client";

import React from "react";

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
      <section className="relative w-full min-h-[65vh] flex flex-col items-center justify-start pt-10 text-center px-6">

        {/* LOGO */}
        <img 
          src="/101012.png" 
          alt="Logo Receitas" 
          className="mx-auto mb-4 w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain drop-shadow-2xl"
        />

        {/* TÍTULO */}
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95]">
          <span className="block">Receitas</span>
          <span className="block text-transparent bg-clip-text bg-[linear-gradient(90deg,#b88900,#fbbf24,#ffffff,#fbbf24,#b88900)] bg-[length:300%_300%] animate-[goldGradient_6s_linear_infinite]">
            Profissionais
          </span>
        </h1>

        {/* SUBTÍTULO */}
        <p className="text-lg md:text-xl max-w-2xl leading-relaxed text-gray-200">
          Para adoçar momentos, gerar renda <br />
          ou realizar sonhos.
        </p>

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
