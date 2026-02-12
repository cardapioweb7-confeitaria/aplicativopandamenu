"use client";
import React, { useState, useEffect } from "react";
import { Search, Upload, FileText, Plus, X, Save, Download } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'

interface Receita {
  id: string;
  titulo: string;
  categoria: string;
  imagem_url: string;
  pdf_url: string;
  descricao: string;
}

export default function Home() {
  const { user } = useAuth()
  const [isOwner, setIsOwner] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categorias, setCategorias] = useState<string[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [newCategoria, setNewCategoria] = useState('')
  const [showNewCategoriaInput, setShowNewCategoriaInput] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    descricao: '',
    imagem_url: '',
    pdf_url: ''
  })
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  // Check if user is owner
  useEffect(() => {
    const checkOwnerStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          
          if (error) throw error
          
          if (data?.role === 'owner') {
            setIsOwner(true)
          }
        } catch (error) {
          console.error('Error checking owner status:', error)
        }
      }
    }
    
    checkOwnerStatus()
  }, [user])

  // Load categorias and receitas
  useEffect(() => {
    const loadData = async () => {
      // Load categorias
      const { data: categoriasData, error: categoriasError } = await supabase
        .from('receitas')
        .select('categoria')
      
      if (!categoriasError && categoriasData) {
        const categoriasList = categoriasData
          .map(item => item.categoria)
          .filter(Boolean) as string[]
        setCategorias(Array.from(new Set(categoriasList)))
      }
      
      // Load receitas
      const { data: receitasData, error: receitasError } = await supabase
        .from('receitas')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!receitasError && receitasData) {
        setReceitas(receitasData)
      }
    }
    
    loadData()
  }, [])

  const handleImagemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImagemFile(file)
      setFormData({ ...formData, imagem_url: URL.createObjectURL(file) })
    }
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPdfFile(file)
      setFormData({ ...formData, pdf_url: URL.createObjectURL(file) })
    }
  }

  const handleOpenUploadModal = () => {
    // Minimize navigation menu before opening modal
    const minimizeEvent = new CustomEvent('minimizeNavigation');
    window.dispatchEvent(minimizeEvent);
    
    // Open the modal after a short delay to allow animation
    setTimeout(() => {
      setShowUploadModal(true);
    }, 300);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    // Reset form when closing
    setFormData({
      titulo: '',
      categoria: '',
      descricao: '',
      imagem_url: '',
      pdf_url: ''
    });
    setImagemFile(null);
    setPdfFile(null);
    setNewCategoria('');
    setShowNewCategoriaInput(false);
  };

  const handleSave = async () => {
    if (!formData.titulo.trim()) {
      showError('Título é obrigatório')
      return
    }
    
    if (!formData.categoria) {
      showError('Categoria é obrigatória')
      return
    }
    
    if (!imagemFile) {
      showError('Imagem é obrigatória')
      return
    }
    
    if (!pdfFile) {
      showError('PDF é obrigatório')
      return
    }
    
    setUploading(true)
    
    try {
      // Upload imagem
      const imagemFileName = `receitas/${Date.now()}_${imagemFile.name}`
      const { error: imagemError } = await supabase.storage
        .from('receitas')
        .upload(imagemFileName, imagemFile)
      
      if (imagemError) throw imagemError
      
      const { data: imagemData } = supabase.storage
        .from('receitas')
        .getPublicUrl(imagemFileName)
      
      // Upload PDF
      const pdfFileName = `receitas/${Date.now()}_${pdfFile.name}`
      const { error: pdfError } = await supabase.storage
        .from('receitas')
        .upload(pdfFileName, pdfFile)
      
      if (pdfError) throw pdfError
      
      const { data: pdfData } = supabase.storage
        .from('receitas')
        .getPublicUrl(pdfFileName)
      
      // Save to database
      const { error: dbError } = await supabase
        .from('receitas')
        .insert({
          titulo: formData.titulo,
          categoria: formData.categoria,
          descricao: formData.descricao,
          imagem_url: imagemData.publicUrl,
          pdf_url: pdfData.publicUrl,
          user_id: user?.id,
          is_global: true
        })
      
      if (dbError) throw dbError
      
      // Reset form
      setFormData({
        titulo: '',
        categoria: '',
        descricao: '',
        imagem_url: '',
        pdf_url: ''
      })
      setImagemFile(null)
      setPdfFile(null)
      setShowUploadModal(false)
      setShowNewCategoriaInput(false);
      setNewCategoria('');
      
      // Reload receitas
      const { data: receitasData } = await supabase
        .from('receitas')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (receitasData) {
        setReceitas(receitasData)
      }
      
      // Reload categories
      const { data: categoriasData } = await supabase
        .from('receitas')
        .select('categoria')
      
      if (categoriasData) {
        const categoriasList = categoriasData
          .map(item => item.categoria)
          .filter(Boolean) as string[]
        setCategorias(Array.from(new Set(categoriasList)))
      }
      
      showSuccess('Conteúdo cadastrado com sucesso!')
    } catch (error) {
      console.error('Error saving content:', error)
      showError('Erro ao salvar conteúdo')
    } finally {
      setUploading(false)
    }
  }

  const addNewCategoria = () => {
    setShowNewCategoriaInput(true);
  }

  const saveNewCategoria = () => {
    if (newCategoria.trim() && !categorias.includes(newCategoria.trim())) {
      const updatedCategorias = [...categorias, newCategoria.trim()];
      setCategorias(updatedCategorias);
      setFormData({ ...formData, categoria: newCategoria.trim() });
      setShowNewCategoriaInput(false);
    } else if (categorias.includes(newCategoria.trim())) {
      setFormData({ ...formData, categoria: newCategoria.trim() });
      setShowNewCategoriaInput(false);
    }
  }

  const downloadPdf = (url: string, title: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `${title}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
        <img src="/101012.png" alt="Logo Receitas" className="mx-auto mb-6 w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain drop-shadow-2xl" />
        
        {/* TÍTULO */}
        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[0.95]">
          <span className="block">Receitas</span>
          <span className="block text-transparent bg-clip-text bg-[linear-gradient(90deg,#b88900,#fbbf24,#ffffff,#fbbf24,#b88900)] bg-[length:300%_300%] animate-[goldGradient_6s_linear_infinite]">
            Profissionais
          </span>
        </h1>
        
        {/* BARRA DE PESQUISA */}
        <div className="relative w-full max-w-md mx-auto mb-6">
          <input 
            type="text" 
            placeholder="Buscar" 
            className="w-full pl-6 pr-12 py-4 text-lg bg-white border border-gray-300 rounded-xl focus:outline-none shadow-none text-gray-900" 
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        {/* BOTÃO DE CADASTRO (somente para owners) */}
        {isOwner && (
          <Button 
            onClick={handleOpenUploadModal}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mb-8"
          >
            Cadastrar Conteúdo
          </Button>
        )}
      </section>
      
      {/* CONTEÚDO ABAIXO */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {receitas.map((receita) => (
            <div key={receita.id} className="bg-[#1a1a1a] p-6 rounded-2xl">
              <div className="h-32 bg-[#262626] rounded-xl mb-4 overflow-hidden">
                {receita.imagem_url ? (
                  <img 
                    src={receita.imagem_url} 
                    alt={receita.titulo} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold mb-2 truncate">{receita.titulo}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-pink-600 text-white px-2 py-1 rounded-full">
                  {receita.categoria}
                </span>
                {receita.pdf_url && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => downloadPdf(receita.pdf_url, receita.titulo)}
                    className="h-8 px-2 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* MODAL DE UPLOAD */}
      <Dialog open={showUploadModal} onOpenChange={handleCloseUploadModal}>
        <DialogContent className="max-w-md w-[95vw] bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Cadastrar Conteúdo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Upload da Imagem */}
            <div className="space-y-2">
              <label className="text-white text-sm">Capa</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                  {formData.imagem_url ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={formData.imagem_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white">Alterar</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="text-xs text-gray-400 mt-2">Clique para enviar</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImagemUpload}
                  />
                </label>
              </div>
            </div>
            
            {/* Título */}
            <div className="space-y-2">
              <label className="text-white text-sm">Título</label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Nome do conteúdo"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            {/* Categoria */}
            <div className="space-y-2">
              <label className="text-white text-sm">Categoria</label>
              <div className="flex gap-2">
                <Select 
                  value={formData.categoria} 
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={addNewCategoria}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {showNewCategoriaInput && (
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newCategoria}
                    onChange={(e) => setNewCategoria(e.target.value)}
                    placeholder="Nova categoria"
                    className="bg-gray-800 border-gray-700 text-white flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && saveNewCategoria()}
                  />
                  <Button 
                    onClick={saveNewCategoria}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Salvar
                  </Button>
                </div>
              )}
            </div>
            
            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-white text-sm">Descrição</label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição do conteúdo"
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
              />
            </div>
            
            {/* Upload do PDF */}
            <div className="space-y-2">
              <label className="text-white text-sm">Arquivo PDF</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                  {formData.pdf_url ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 text-green-500" />
                      <p className="text-xs text-green-500 mt-2">PDF selecionado</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <p className="text-xs text-gray-400 mt-2">Clique para enviar</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf"
                    onChange={handlePdfUpload}
                  />
                </label>
              </div>
            </div>
            
            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCloseUploadModal}
                className="flex-1 border-gray-600 text-white"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={uploading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {uploading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}