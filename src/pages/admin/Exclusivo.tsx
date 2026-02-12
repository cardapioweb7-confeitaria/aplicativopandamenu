"use client";

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileText, X, Save, Plus, ChefHat } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'

interface RecipeFormData {
  titulo: string
  categoria: string
  imagem_url: string
  pdf_url: string
}

const categorias = [
  'Bolos',
  'Tortas',
  'Cupcakes',
  'Doces',
  'Salgados',
  'Massas',
  'Coberturas',
  'Recheios',
  'Outros'
]

export default function Exclusivo() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<RecipeFormData>({
    titulo: '',
    categoria: '',
    imagem_url: '',
    pdf_url: '',
  })

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        navigate('/')
        return
      }

      // Verificar se é o usuário administrador (teste@gmail.com)
      if (user.email === 'teste@gmail.com') {
        setIsOwner(true)
      } else {
        navigate('/')
        return
      }

      setLoading(false)
    }

    if (!authLoading) {
      checkAccess()
    }
  }, [user, authLoading, navigate])

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showError('Apenas imagens são permitidas')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('Arquivo muito grande (máximo 5MB)')
      return
    }

    setUploading(true)
    try {
      const fileName = `receita-${Date.now()}.${file.name.split('.').pop()}`
      const { data, error } = await supabase.storage
        .from('receitas')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('receitas')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, imagem_url: publicUrl }))
      showSuccess('Imagem enviada com sucesso!')
    } catch (error: any) {
      console.error('Erro no upload da imagem:', error)
      showError(error.message || 'Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const handlePdfUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      showError('Apenas arquivos PDF são permitidos')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('Arquivo muito grande (máximo 10MB)')
      return
    }

    setUploading(true)
    try {
      const fileName = `receita-pdf-${Date.now()}.pdf`
      const { data, error } = await supabase.storage
        .from('receitas')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('receitas')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, pdf_url: publicUrl }))
      showSuccess('PDF enviado com sucesso!')
    } catch (error: any) {
      console.error('Erro no upload do PDF:', error)
      showError(error.message || 'Erro ao fazer upload do PDF')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.titulo.trim()) {
      showError('Título é obrigatório')
      return
    }

    if (!formData.categoria) {
      showError('Categoria é obrigatória')
      return
    }

    if (!formData.imagem_url) {
      showError('Imagem é obrigatória')
      return
    }

    setUploading(true)
    try {
      const { data, error } = await supabase
        .from('receitas')
        .insert({
          titulo: formData.titulo.trim(),
          categoria: formData.categoria,
          imagem_url: formData.imagem_url,
          pdf_url: formData.pdf_url,
          user_id: user?.id,
          is_global: true // Marca como receita global
        })
        .select()
        .single()

      if (error) throw error

      showSuccess('Receita cadastrada com sucesso!')
      setShowModal(false)
      resetForm()
    } catch (error: any) {
      console.error('Erro ao salvar receita:', error)
      showError(error.message || 'Erro ao salvar receita')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: '',
      categoria: '',
      imagem_url: '',
      pdf_url: '',
    })
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!isOwner) {
    return null // Já redirecionou
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Área Exclusiva</h1>
          <p className="text-gray-400 text-lg">Gerencie receitas globais do sistema</p>
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-8 text-center">
              <Button
                onClick={() => setShowModal(true)}
                className="w-full h-16 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-6 h-6 mr-3" />
                Cadastrar Receita
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Cadastro */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <ChefHat className="w-6 h-6" />
              Cadastrar Receita Global
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-6">
            {/* Upload de Imagem */}
            <div className="space-y-4">
              <Label className="text-white text-lg font-semibold">Capa da Receita *</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Clique para selecionar imagem</p>
                      <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                    </div>
                  </label>
                </div>
                {formData.imagem_url && (
                  <div className="w-32 h-32 relative">
                    <img
                      src={formData.imagem_url}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, imagem_url: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upload de PDF */}
            <div className="space-y-4">
              <Label className="text-white text-lg font-semibold">Arquivo PDF (Opcional)</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
                    className="hidden"
                    id="pdf-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 transition-colors"
                  >
                    <div className="text-center">
                      <FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Clique para selecionar PDF</p>
                      <p className="text-xs text-gray-500">PDF até 10MB</p>
                    </div>
                  </label>
                </div>
                {formData.pdf_url && (
                  <div className="flex items-center gap-2 bg-green-900/20 border border-green-500 rounded-lg p-3">
                    <FileText className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">PDF anexado</span>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, pdf_url: '' }))}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Título e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Título *</Label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Nome da receita"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-white hover:bg-gray-700">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                disabled={uploading}
              >
                <Save className="w-4 h-4 mr-2" />
                {uploading ? 'Salvando...' : 'Salvar Receita'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}