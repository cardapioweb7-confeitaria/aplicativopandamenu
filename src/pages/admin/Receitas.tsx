"use client";

import { Download, Clock, Flame, Tag, Eye, Search, X, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

// Interface para receitas mockadas
interface Receita {
  id: string
  titulo: string
  categoria: string
  imagemUrl: string
  pdfUrl: string
  views: number
  dataAdicionado: string
}

// Dados mockados (sem banco)
const receitasMock: Receita[] = [
  {
    id: '1',
    titulo: 'Bolo de Chocolate Perfeito',
    categoria: 'Bolos',
    imagemUrl: 'https://images.unsplash.com/photo-1562440499-64b4f3163e9a?w=400&h=600&fit=crop',
    pdfUrl: 'https://example.com/bolo-chocolate.pdf',
    views: 1245,
    dataAdicionado: '2024-01-15'
  },
  {
    id: '2',
    titulo: 'Brigadeiro Gourmet',
    categoria: 'Doces',
    imagemUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=600&fit=crop',
    pdfUrl: 'https://example.com/brigadeiro-gourmet.pdf',
    views: 987,
    dataAdicionado: '2024-01-14'
  },
  {
    id: '3',
    titulo: 'Torta de Limão Clássica',
    categoria: 'Tortas',
    imagemUrl: 'https://images.unsplash.com/photo-1603048297194-9e04b8a61a17?w=400&h=600&fit=crop',
    pdfUrl: 'https://example.com/torta-limao.pdf',
    views: 1567,
    dataAdicionado: '2024-01-12'
  },
  {
    id: '4',
    titulo: 'Cupcakes de Baunilha',
    categoria: 'Cupcakes',
    imagemUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop',
    pdfUrl: 'https://example.com/cupcakes-baunilha.pdf',
    views: 2034,
    dataAdicionado: '2024-01-10'
  },
  {
    id: '5',
    titulo: 'Pão de Mel Recheado',
    categoria: 'Doces',
    imagemUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=600&fit=crop',
    pdfUrl: 'https://example.com/pao-mel.pdf',
    views: 890,
    dataAdicionado: '2024-01-08'
  }
]

export default function Receitas() {
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar receitas baseado no termo de busca
  const filteredReceitas = receitasMock.filter(receita =>
    receita.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receita.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Recém adicionados filtrados
  const recemAdicionados = filteredReceitas
    .sort((a, b) => new Date(b.dataAdicionado).getTime() - new Date(a.dataAdicionado).getTime())
    .slice(0, 6)

  // Em alta filtrados
  const emAlta = filteredReceitas
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)

  // Demais filtrados
  const demais = filteredReceitas.slice(6)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-x-hidden">
      {/* HERO NETFLIX: FULL-VIEWPORT + OVERLAY + TEXTO CENTRALIZADO */}
      <div 
        className="relative w-full h-screen overflow-hidden"
        style={{
          backgroundImage: `url(/hero)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay gradiente escuro */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/100" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        
        {/* Conteúdo hero centralizado */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 drop-shadow-2xl leading-tight tracking-tight">
            Receitas
            <br />
            <span className="text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 bg-clip-text">Exclusivas</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Descubra receitas incríveis para elevar sua confeitaria
          </p>
        </div>
      </div>

      {/* BARRA DE PESQUISA NETFLIX (MANCHAS PRETA + ÍCONE BRANCO + INPUT REDONDO) */}
      <div className="relative bg-black/80 backdrop-blur-md border-b border-gray-800 py-4 px-6 md:px-12 z-10">
        <div className="max-w-4xl mx-auto relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 z-10 pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar receitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-4 text-lg bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-0 transition-all duration-300"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-16">
        {/* ROW RECÉM ADICIONADOS - SCROLL HORIZONTAL NETFLIX */}
        {recemAdicionados.length > 0 && (
          <section>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <Clock className="w-10 h-10 text-red-500 shrink-0" />
              Recém Adicionados
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 snap-x snap-mandatory">
              {recemAdicionados.map((receita) => (
                <ReceitaPoster key={receita.id} receita={receita} />
              ))}
            </div>
          </section>
        )}

        {/* ROW EM ALTA */}
        {emAlta.length > 0 && (
          <section>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <Flame className="w-10 h-10 text-orange-500 shrink-0" />
              Em Alta
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 snap-x snap-mandatory">
              {emAlta.map((receita) => (
                <ReceitaPoster key={receita.id} receita={receita} />
              ))}
            </div>
          </section>
        )}

        {/* ROW TODAS AS RECEITAS */}
        {demais.length > 0 && (
          <section>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <Tag className="w-10 h-10 text-purple-500 shrink-0" />
              Todas as Receitas
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 snap-x snap-mandatory">
              {demais.map((receita) => (
                <ReceitaPoster key={receita.id} receita={receita} />
              ))}
            </div>
          </section>
        )}

        {/* VAZIO */}
        {filteredReceitas.length === 0 && searchTerm && (
          <div className="text-center py-32">
            <Search className="w-24 h-24 text-gray-600 mx-auto mb-8 opacity-50" />
            <h3 className="text-4xl font-black text-gray-400 mb-4">Nenhuma receita encontrada</h3>
            <p className="text-xl text-gray-500">Tente buscar por outro termo</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ReceitaPoster({ receita }: { receita: Receita }) {
  return (
    <div className="group relative w-44 flex-shrink-0 snap-center hover:scale-110 transition-all duration-300 cursor-pointer">
      {/* Poster vertical Netflix */}
      <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-800 to-black group-hover:shadow-red-500/25">
        <img 
          src={receita.imagemUrl.replace('h=300', 'h=600')} 
          alt={receita.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4" />
        
        {/* Badge categoria */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-red-600/90 text-white font-bold px-3 py-1 backdrop-blur-sm">
            {receita.categoria}
          </Badge>
        </div>
        
        {/* Play button hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-20 h-20 bg-red-600/90 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-200">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      </div>
      
      {/* Título abaixo */}
      <h3 className="mt-3 text-sm font-bold text-white line-clamp-2 px-1 leading-tight">
        {receita.titulo}
      </h3>
      
      {/* Views */}
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
        <Eye className="w-3 h-3" />
        <span>{receita.views.toLocaleString()} views</span>
      </div>
    </div>
  )
}