"use client";

import { Clock, Flame, Tag, Eye, Search, X, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Receita {
  id: string;
  titulo: string;
  categoria: string;
  imagemUrl: string;
  pdfUrl: string;
  views: number;
  dataAdicionado: string;
}

const receitasMock: Receita[] = [
  {
    id: "1",
    titulo: "Bolo de Chocolate Perfeito",
    categoria: "Bolos",
    imagemUrl:
      "https://images.unsplash.com/photo-1562440499-64b4f3163e9a?w=400&h=600&fit=crop",
    pdfUrl: "#",
    views: 1245,
    dataAdicionado: "2024-01-15",
  },
  {
    id: "2",
    titulo: "Brigadeiro Gourmet",
    categoria: "Doces",
    imagemUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=600&fit=crop",
    pdfUrl: "#",
    views: 987,
    dataAdicionado: "2024-01-14",
  },
  {
    id: "3",
    titulo: "Torta de Limão Clássica",
    categoria: "Tortas",
    imagemUrl:
      "https://images.unsplash.com/photo-1603048297194-9e04b8a61a17?w=400&h=600&fit=crop",
    pdfUrl: "#",
    views: 1567,
    dataAdicionado: "2024-01-12",
  },
  {
    id: "4",
    titulo: "Cupcakes de Baunilha",
    categoria: "Cupcakes",
    imagemUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop",
    pdfUrl: "#",
    views: 2034,
    dataAdicionado: "2024-01-10",
  },
];

export default function Receitas() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReceitas = receitasMock.filter(
    (receita) =>
      receita.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receita.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recemAdicionados = [...filteredReceitas]
    .sort(
      (a, b) =>
        new Date(b.dataAdicionado).getTime() -
        new Date(a.dataAdicionado).getTime()
    )
    .slice(0, 6);

  const emAlta = [...filteredReceitas]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      
      {/* HERO */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
          Receitas
          <br />
          <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#ef4444,#ec4899,#fbbf24,#ef4444)] bg-[length:300%_300%] animate-[gradientMove_6s_linear_infinite]">
            Profissionais
          </span>
        </h1>

        <p className="text-xl text-gray-300 max-w-xl">
          Descubra receitas incríveis para elevar sua confeitaria
        </p>
      </div>

      {/* BUSCA */}
      <div className="px-6 md:px-12 pb-10">
        <div className="max-w-4xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar receitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-12 py-4 bg-gray-900 border-gray-700 text-white rounded-full"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* LISTAS */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 pb-20">
        <Section titulo="Recém Adicionados" icon={<Clock />} data={recemAdicionados} />
        <Section titulo="Em Alta" icon={<Flame />} data={emAlta} />
      </div>

      {/* KEYFRAMES DA ANIMAÇÃO */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}

function Section({
  titulo,
  icon,
  data,
}: {
  titulo: string;
  icon: React.ReactNode;
  data: Receita[];
}) {
  if (data.length === 0) return null;

  return (
    <section>
      <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
        {icon}
        {titulo}
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {data.map((receita) => (
          <ReceitaPoster key={receita.id} receita={receita} />
        ))}
      </div>
    </section>
  );
}

function ReceitaPoster({ receita }: { receita: Receita }) {
  return (
    <div className="group relative w-44 flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-110">
      <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-gray-800 shadow-xl">
        <img
          src={receita.imagemUrl}
          alt={receita.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3">
          <Badge className="bg-red-600 text-white">
            {receita.categoria}
          </Badge>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="bg-red-600 rounded-full p-4">
            <Play className="text-white" />
          </div>
        </div>
      </div>

      <h3 className="mt-3 text-sm font-bold line-clamp-2">
        {receita.titulo}
      </h3>

      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
        <Eye className="w-3 h-3" />
        {receita.views} views
      </div>
    </div>
  );
}
