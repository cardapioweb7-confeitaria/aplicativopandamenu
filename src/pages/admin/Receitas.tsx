"use client";

import { Download, Clock, Flame, Tag, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    imagemUrl: 'https://images.unsplash.com/photo-1562440499-64b4f3163e9a?w=400&h=300&fit=crop',
    pdfUrl: 'https://example.com/bolo-chocolate.pdf',
    views: 1245,
    dataAdicionado: '2024-01-15'
  },
  {
    id: '2',
    titulo: 'Brigadeiro Gourmet',
    categoria: 'Doces',
    imagemUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    pdfUrl: 'https://example.com/brigadeiro-gourmet.pdf',
    views: 987,
    dataAdicionado: '2024-01-14'
  },
  {
    id: '3',
    titulo: 'Torta de Limão Clássica',
    categoria: 'Tortas',
    imagemUrl: 'https://images.unsplash.com/photo-1603048297194-9e04b8a61a17?w=400&h=300&fit=crop',
    pdfUrl: 'https://example.com/torta-limao.pdf',
    views: 1567,
    dataAdicionado: '2024-01-12'
  },
  {
    id: '4',
    titulo: 'Cupcakes de Baunilha',
    categoria: 'Cupcakes',
    imagemUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
    pdfUrl: 'https://example.com/cupcakes-baunilha.pdf',
    views: 2034,
    dataAdicionado: '2024-01-10'
  },
  {
    id: '5',
    titulo: 'Pão de Mel Recheado',
    categoria: 'Doces',
    imagemUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    pdfUrl: 'https://example.com/pao-mel.pdf',
    views: 890,
    dataAdicionado: '2024-01-08'
  }
]

// Ordenar por data recente
const recemAdicionados = receitasMock
  .sort((a, b) => new Date(b.dataAdicionado).getTime() - new Date(a.dataAdicionado).getTime())
  .slice(0, 4)

// Em alta (mais views)
const emAlta = receitasMock
  .sort((a, b) => b.views - a.views)
  .slice(0, 4)

// Demais receitas
const demais = receitasMock.slice(4)

export default function Receitas() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Receitas Exclusivas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Baixe PDFs completos com receitas testadas e aprovadas. Perfeitas para sua confeitaria!
          </p>
        </div>

        {/* Seção Recém Adicionados */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-7 h-7 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-900">Recém Adicionados</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recemAdicionados.map((receita) => (
              <ReceitaCard key={receita.id} receita={receita} />
            ))}
          </div>
        </section>

        {/* Seção Em Alta */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Flame className="w-7 h-7 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Em Alta</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {emAlta.map((receita) => (
              <ReceitaCard key={receita.id} receita={receita} />
            ))}
          </div>
        </section>

        {/* Todas as Receitas */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Tag className="w-7 h-7 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">Todas as Receitas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {demais.map((receita) => (
              <ReceitaCard key={receita.id} receita={receita} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function ReceitaCard({ receita }: { receita: Receita }) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg">
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-pink-50 group-hover:to-rose-50">
        <img 
          src={receita.imagemUrl} 
          alt={receita.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge variant="secondary" className="mb-2 inline-block bg-white/90 text-gray-800 font-bold px-3 py-1">
            {receita.categoria}
          </Badge>
          <div className="flex items-center gap-2 text-white text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="w-4 h-4" />
            <span>{receita.views.toLocaleString()} visualizações</span>
          </div>
        </div>
      </div>
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:line-clamp-none">
          {receita.titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Button 
          asChild
          size="lg" 
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <a href={receita.pdfUrl} download target="_blank" rel="noopener noreferrer">
            <Download className="w-5 h-5 mr-2" />
            Baixar PDF
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}