"use client";
import React, { useState, useEffect } from "react";
import { Search, Upload, FileText, Plus, Save, Download, Edit, Trash2 } from "lucide-react";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'
import { Badge } from "@/components/ui/badge";

interface Receita {
  id: string;
  titulo: string;
  categoria: string;
  imagem_url: string;
  pdf_url: string;
}

export default function Receitas() {
  const { user } = useAuth()
  const [isOwner, setIsOwner] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categorias, setCategorias] = useState<string[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [newCategoria, setNewCategoria] = useState('')
  const [showNewCategoriaInput, setShowNewCategoriaInput] = useState(false)
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
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

  const loadReceitas = async () => {
    const { data: receitasData, error: receitasError } = await supabase
      .from('receitas')
      .select('*')
      .order('created_at', { ascending: false })
    if (!receitasError && receitasData) {
      setReceitas(receitasData)
    }
  }

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
      loadReceitas()
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

  const resetForm = () => {
    setFormData({
      titulo: '',
      categoria: '',
      imagem_url: '',
      pdf_url: ''
    });
    setImagemFile(null);
    setPdfFile(null);
    setNewCategoria('');
    setShowNewCategoriaInput(false);
    setEditingReceita(null);
  }

  const handleOpenUploadModal = () => {
    resetForm();
    const minimizeEvent = new CustomEvent('minimizeNavigation');
    window.dispatchEvent(minimizeEvent);
    setTimeout(() => {
      setShowUploadModal(true);
    }, 300);
  };

  const handleOpenEditModal = (receita: Receita) => {
    setEditingReceita(receita);
    setFormData({
      titulo: receita.titulo,
      categoria: receita.categoria,
      imagem_url: receita.imagem_url,
      pdf_url: receita.pdf_url,
    });
    setImagemFile(null);
    setPdfFile(null);
    setShowUploadModal(true);
  }

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    resetForm();
  };

  const handleSaveOrUpdate = async () => {
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
      let finalImageUrl = editingReceita ? editingReceita.imagem_url : formData.imagem_url;
      if (imagemFile) {
        const imagemFileName = `receitas/${Date.now()}_${imagemFile.name}`;
        const { error: imagemError } = await supabase.storage.from('products').upload(imagemFileName, imagemFile);
        if (imagemError) throw imagemError;
        finalImageUrl = supabase.storage.from('products').getPublicUrl(imagemFileName).data.publicUrl;
      }

      let finalPdfUrl = editingReceita ? editingReceita.pdf_url : formData.pdf_url;
      if (pdfFile) {
        const pdfFileName = `receitas/${Date.now()}_${pdfFile.name}`;
        const { error: pdfError } = await supabase.storage.from('products').upload(pdfFileName, pdfFile);
        if (pdfError) throw pdfError;
        finalPdfUrl = supabase.storage.from('products').getPublicUrl(pdfFileName).data.publicUrl;
      }

      const recipeData = {
        titulo: formData.titulo,
        categoria: formData.categoria,
        imagem_url: finalImageUrl,
        pdf_url: finalPdfUrl,
        user_id: user?.id,
        is_global: true
      };

      if (editingReceita) {
        const { error } = await supabase.from('receitas').update(recipeData).eq('id', editingReceita.id);
        if (error) throw error;
        showSuccess('Receita atualizada com sucesso!');
      } else {
        const { error } = await supabase.from('receitas').insert(recipeData);
        if (error) throw error;
        showSuccess('Receita cadastrada com sucesso!');
      }

      handleCloseUploadModal();
      loadReceitas();

    } catch (error: any) {
      console.error('Error saving content:', error)
      showError('Erro ao salvar conteúdo: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!editingReceita) return;
    if (!confirm(`Tem certeza que deseja excluir a receita "${editingReceita.titulo}"?`)) return;

    setUploading(true);
    try {
      const { error } = await supabase.from('receitas').delete().eq('id', editingReceita.id);
      if (error) throw error;
      showSuccess('Receita excluída com sucesso!');
      handleCloseUploadModal();
      loadReceitas();
    } catch (error: any) {
      showError('Erro ao excluir receita: ' + error.message);
    } finally {
      setUploading(false);
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
    if (!url) {
      showError('Nenhum arquivo PDF para baixar.');
      return;
    }
    const link = document.createElement('a')
    link.href = url
    link.download = `${title}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const receitasEmAlta = receitas.slice(0, 3);
  const outrasReceitas = receitas.slice(3);

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
      <section className="px-6 pb-20 space-y-12">
        {/* SEÇÃO EM ALTA */}
{receitasEmAlta.length > 0 && (
  <div className="px-6">
    <div className="max-w-6xl mx-auto p-8 rounded-3xl shadow-2xl 
      bg-gradient-to-r from-[#3a2e00] via-[#b88900] to-[#fbbf24]">
      
      <h2 className="text-2xl font-bold mb-8 text-center text-white">
        🔥 Em Alta
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {receitasEmAlta.map((receita) => (
          <div
            key={receita.id}
            className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col border border-gray-100 text-gray-800"
          >
            <div className="w-full aspect-square bg-gray-50 overflow-hidden relative">
              {isOwner && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleOpenEditModal(receita)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}

              {receita.imagem_url ? (
                <img
                  src={receita.imagem_url}
                  alt={receita.titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-semibold text-sm leading-tight flex-1 line-clamp-2 mb-3">
                {receita.titulo}
              </h4>

              <div className="mt-auto">
                <div className="mb-3">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{ backgroundColor: '#6A0122', color: 'white' }}
                  >
                    {receita.categoria}
                  </Badge>
                </div>

                <Button
                  onClick={() =>
                    downloadPdf(receita.pdf_url, receita.titulo)
                  }
                  className="w-full py-2 px-3 rounded-lg text-white text-xs font-medium transition-colors text-center whitespace-nowrap"
                  style={{ backgroundColor: '#FF4F97' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E64280';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF4F97';
                  }}
                  disabled={!receita.pdf_url}
                >
                  Acessar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        {/* OUTRAS RECEITAS */}
        {outrasReceitas.length > 0 && (
          <div className="max-w-6xl mx-auto">
             <h2 className="text-2xl font-bold mb-6 text-center text-gray-400">Todas as Receitas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {outrasReceitas.map((receita) => (
                <div key={receita.id} className="bg-white rounded-lg overflow-hidden shadow-sm h-full flex flex-col border border-gray-100 text-gray-800">
                  <div className="w-full aspect-[4/5] bg-gray-50 overflow-hidden relative">
                    {isOwner && (
                      <Button size="icon" variant="secondary" onClick={() => handleOpenEditModal(receita)} className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {receita.imagem_url ? <img src={receita.imagem_url} alt={receita.titulo} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <div className="w-full h-full flex items-center justify-center"><FileText className="w-8 h-8 text-gray-400" /></div>}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h4 className="font-semibold text-sm leading-tight flex-1 line-clamp-2 mb-2">{receita.titulo}</h4>
                    <div className="mt-auto">
                      <div className="mb-2"><Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-sm" style={{ backgroundColor: '#6A0122', color: 'white' }}>{receita.categoria}</Badge></div>
                      <Button onClick={() => downloadPdf(receita.pdf_url, receita.titulo)} className="w-full py-2 px-3 rounded-lg text-white text-xs font-medium transition-colors text-center whitespace-nowrap" style={{ backgroundColor: '#FF4F97' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E64280' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FF4F97' }} disabled={!receita.pdf_url}>Acessar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MODAL DE UPLOAD/EDIÇÃO */}
      <Dialog open={showUploadModal} onOpenChange={handleCloseUploadModal}>
        <DialogContent className="max-w-md w-[95vw] bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">{editingReceita ? 'Editar Receita' : 'Cadastrar Conteúdo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Upload da Imagem */}
            <div className="space-y-2">
              <label className="text-white text-sm">Capa *</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                  {formData.imagem_url ? (
                    <div className="relative w-full h-full">
                      <img src={formData.imagem_url} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                  <input type="file" className="hidden" accept="image/*" onChange={handleImagemUpload} />
                </label>
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <label className="text-white text-sm">Título *</label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Nome do conteúdo"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <label className="text-white text-sm">Categoria *</label>
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
                <Button onClick={addNewCategoria} className="bg-pink-600 hover:bg-pink-700">
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
                  <Button onClick={saveNewCategoria} className="bg-green-600 hover:bg-green-700">
                    Salvar
                  </Button>
                </div>
              )}
            </div>

            {/* Upload do PDF */}
            <div className="space-y-2">
              <label className="text-white text-sm">Arquivo PDF *</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                  {pdfFile || formData.pdf_url ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 text-green-500" />
                      <p className="text-xs text-green-500 mt-2">{pdfFile ? pdfFile.name : 'PDF selecionado'}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <p className="text-xs text-gray-400 mt-2">Clique para enviar</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="application/pdf" onChange={handlePdfUpload} />
                </label>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              {editingReceita && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={uploading}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleCloseUploadModal}
                className="flex-1 border-gray-600 text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveOrUpdate}
                disabled={uploading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {uploading ? 'Salvando...' : (editingReceita ? 'Salvar Alterações' : 'Salvar')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}