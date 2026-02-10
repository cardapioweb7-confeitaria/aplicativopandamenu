"use client";

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Receita {
  id: string
  titulo: string
  descricao: string
  ingredientes: string[]
  modo_preparo: string
  categoria: string
}

export default function Receitas() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    titulo: '',
    descricao: '',
    ingredientes: '',
    modo_preparo: '',
    categoria: ''
  })

  useEffect(() => {
    fetchReceitas()
  }, [])

  const fetchReceitas = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setReceitas(data || [])
    } catch (error) {
      showError('Erro ao carregar receitas')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (receita: Receita) => {
    setEditingId(receita.id)
    setEditForm({
      titulo: receita.titulo,
      descricao: receita.descricao,
      ingredientes: receita.ingredientes.join(', '),
      modo_preparo: receita.modo_preparo,
      categoria: receita.categoria
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    
    try {
      const { error } = await supabase
        .from('receitas')
        .update({
          titulo: editForm.titulo,
          descricao: editForm.descricao,
          ingredientes: editForm.ingredientes.split(',').map(i => i.trim()),
          modo_preparo: editForm.modo_preparo,
          categoria: editForm.categoria
        })
        .eq('id', editingId)
      
      if (error) throw error
      
      showSuccess('Receita atualizada!')
      setEditingId(null)
      fetchReceitas()
    } catch (error) {
      showError('Erro ao salvar')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta receita?')) return
    
    try {
      const { error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      showSuccess('Receita excluída!')
      fetchReceitas()
    } catch (error) {
      showError('Erro ao excluir')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando receitas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Receitas</h1>
        <Button onClick={() => {}} className="bg-gradient-to-r from-pink-500 to-purple-500">
          <Plus className="w-4 h-4 mr-2" />
          Nova Receita
        </Button>
      </div>

      {receitas.length === 0 ? (
        <Card className="text-center p-12">
          <CardTitle>Nenhuma receita cadastrada</CardTitle>
          <CardContent className="pt-4">
            <p>Adicione suas receitas favoritas para compartilhar com clientes!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receitas.map((receita) => (
            <Card key={receita.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{receita.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{receita.descricao}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(receita)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(receita.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Formulário de edição inline */}
      {editingId && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Editar Receita</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Título"
              value={editForm.titulo}
              onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
            />
            <Input
              placeholder="Categoria"
              value={editForm.categoria}
              onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
            />
            <Input
              placeholder="Ingredientes (separados por vírgula)"
              value={editForm.ingredientes}
              onChange={(e) => setEditForm({ ...editForm, ingredientes: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Descrição"
              value={editForm.descricao}
              onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
            />
            <Input
              placeholder="Modo de preparo"
              value={editForm.modo_preparo}
              onChange={(e) => setEditForm({ ...editForm, modo_preparo: e.target.value })}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveEdit}>Salvar</Button>
            <Button variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
          </div>
        </Card>
      )}
    </div>
  )
}