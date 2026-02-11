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
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-start pt-24 text-center px-6">

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
          Receitas
          <br />
          <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#b88900,#fbbf24,#ffffff,#fbbf24,#b88900)] bg-[length:300%_300%] animate-[goldGradient_6s_linear_infinite]">
            Profissionais
          </span>
        </h1>

        <p className="text-xl md:text-2xl max-w-2xl leading-relaxed">
          Descubra receitas incríveis <br />
          para elevar sua confeitaria para <br />
          o{" "}
          <span className="text-[#fbbf24] font-semibold underline underline-offset-4 decoration-2">
            próximo Nível!
          </span>
        </p>

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
