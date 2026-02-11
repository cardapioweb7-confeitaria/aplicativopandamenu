"use client";

import { Download, Clock, Flame, Tag, Eye, Search, X } from 'lucide-react'
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
    .slice(0, 4)

  // Em alta filtrados
  const emAlta = filteredReceitas
    .sort((a, b) => b.views - a.views)
    .slice(0, 4)

  // Demais filtrados
  const demais = filteredReceitas.slice(4)

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-8 pb-12"> {/* Fundo cinza clarinho + pt-20 topo */}
      <div className="max-w-6xl mx-auto">
        {/* Header com mais espaçamento */}
        <div className="text-center mb-20"> {/* mb-20 ao invés de mb-12 */}
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Receitas Exclusivas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Baixe PDFs completos com receitas testadas e aprovadas. Perfeitas para sua confeitaria!
          </p>
        </div>

        {/* Barra de pesquisa ROSA com sombra CONCENTRADA inferior-direita + SEM BORDA */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5 z-10 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar receitas ou categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl font-medium shadow-[0_10px_30px_rgba(236,72,153,0.6),0_5px_15px_rgba(236,72,153,0.3)] focus:outline-none focus:ring-0 transition-all duration-300 group-hover:shadow-[0_12px_35px_rgba(236,72,153,0.7),0_6px_18px_rgba(236,72,153,0.4)]"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
                backgroundSize: '200% 200%',
                color: 'white',
                border: 'none' // SEM BORDA
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Mostrando resultados para "{searchTerm}"
            </p>
          )}
        </div>

        {/* Seção Recém Adicionados */}
        {recemAdicionados.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-7 h-7 text-pink-500" />
              <h2 className="text-2xl font-bold text-gray-900">Recém Adicionados</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {recemAdicionados.map((receita) => (
                <ReceitaCard key={receita.id} receita={receita} />
              ))}
            </div>
          </section>
        )}

        {/* Seção Em Alta */}
        {emAlta.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Flame className="w-7 h-7 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Em Alta</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {emAlta.map((receita) => (
                <ReceitaCard key={receita.id} receita={receita} />
              ))}
            </div>
          </section>
        )}

        {/* Todas as Receitas */}
        {demais.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Tag className="w-7 h-7 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Todas as Receitas</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {demais.map((receita) => (
                <ReceitaCard key={receita.id} receita={receita} />
              ))}
            </div>
          </section>
        )}

        {filteredReceitas.length === 0 && searchTerm && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma receita encontrada</h3>
            <p className="text-gray-600">Tente buscar por outro termo</p>
          </div>
        )}
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