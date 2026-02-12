"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Upload,
  FileText,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  ChefHat,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";

interface Receita {
  id: string;
  titulo: string;
  categoria: string;
  imagem_url: string;
  pdf_url: string;
  created_at: string;
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
];

const BUCKET_NAME = 'public_files';

export default function Receitas() {
  const { user } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [search, setSearch] = useState("");
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    imagem_url: "",
    pdf_url: "",
  });

  useEffect(() => {
    const checkOwnerStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data?.role === "owner") setIsOwner(true);
      } catch (error) {
        console.error(error);
      }
    };

    checkOwnerStatus();
  }, [user]);

  const loadReceitas = async () => {
    const { data, error } = await supabase
      .from("receitas")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setReceitas(data as Receita[]);
  };

  useEffect(() => {
    loadReceitas();
  }, []);

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
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Usar upsert para substituir se existir
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
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
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Usar upsert para substituir se existir
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
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

  const resetForm = () => {
    setFormData({
      titulo: "",
      categoria: "",
      imagem_url: "",
      pdf_url: "",
    })
  }

  const handleOpenModal = () => {
    resetForm();
    setShowUploadModal(true);
  };

  const handleEdit = (receita: Receita) => {
    setEditingReceita(receita);
    setFormData({
      titulo: receita.titulo,
      categoria: receita.categoria,
      imagem_url: receita.imagem_url,
      pdf_url: receita.pdf_url,
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!user) {
      showError('Sessão expirada. Por favor, faça login novamente para continuar.');
      return;
    }

    if (!formData.titulo.trim() || !formData.categoria || !formData.imagem_url) {
      showError('Título, categoria e imagem são obrigatórios.')
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
          user_id: user.id,
          is_global: true
        })
        .select()
        .single()

      if (error) throw error

      showSuccess('Receita cadastrada com sucesso!')
      setShowUploadModal(false)
      resetForm()
      loadReceitas()
    } catch (error: any) {
      console.error('Erro ao salvar receita:', error)
      showError(error.message || 'Erro ao salvar receita')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingReceita) return;

    if (!formData.titulo.trim() || !formData.categoria || !formData.imagem_url) {
      showError('Título, categoria e imagem são obrigatórios.')
      return
    }

    setUploading(true);
    try {
      const { error } = await supabase
        .from('receitas')
        .update({
          titulo: formData.titulo.trim(),
          categoria: formData.categoria,
          imagem_url: formData.imagem_url,
          pdf_url: formData.pdf_url,
        })
        .eq('id', editingReceita.id);

      if (error) throw error;

      showSuccess('Receita atualizada com sucesso!');
      setShowEditModal(false);
      setEditingReceita(null);
      loadReceitas();
    } catch (error: any) {
      showError(error.message || 'Erro ao atualizar receita');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingReceita) return;

    if (window.confirm(`Tem certeza que deseja excluir a receita "${editingReceita.titulo}"?`)) {
      setUploading(true);
      try {
        // Deletar do banco de dados
        const { error } = await supabase.from('receitas').delete().eq('id', editingReceita.id);
        if (error) throw error;

        // Deletar arquivos do storage
        if (editingReceita.imagem_url) {
          const imagePath = new URL(editingReceita.imagem_url).pathname.split(`/${BUCKET_NAME}/`)[1];
          await supabase.storage.from(BUCKET_NAME).remove([imagePath]);
        }
        if (editingReceita.pdf_url) {
          const pdfPath = new URL(editingReceita.pdf_url).pathname.split(`/${BUCKET_NAME}/`)[1];
          await supabase.storage.from(BUCKET_NAME).remove([pdfPath]);
        }

        showSuccess('Receita excluída com sucesso!');
        setShowEditModal(false);
        setEditingReceita(null);
        loadReceitas();
      } catch (error: any) {
        showError(error.message || 'Erro ao excluir receita');
      } finally {
        setUploading(false);
      }
    }
  };

  const downloadPdf = (url: string, title: string) => {
    if (!url) return showError("Nenhum arquivo PDF para baixar.");

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.pdf`;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isNew = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = (now.getTime() - createdDate.getTime()) / (1000 * 60);
    return diffInMinutes < 5;
  };

  const filteredReceitas = receitas.filter((r) => {
    const matchesSearch = r.titulo.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      <section className="relative w-full flex flex-col items-center justify-start pt-8 text-center px-6 pb-8">
        <img
          src="/101012.png"
          alt="Logo Receitas"
          className="mx-auto mb-4 w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain"
        />
        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#fff4b0] bg-[length:200%_200%] bg-clip-text text-transparent animate-gold">
          RECEITAS PROFISSIONAIS
        </h1>
        {isOwner && (
          <Button
            onClick={handleOpenModal}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mb-4"
          >
            Cadastrar Conteúdo
          </Button>
        )}
        <div className="w-full max-w-md mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Pesquisar receitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white text-black"
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 mt-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredReceitas.map((receita) => (
              <div
                key={receita.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col text-gray-800 relative group"
              >
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-20 bg-black/50 text-white hover:bg-black/70 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEdit(receita)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {isNew(receita.created_at) && (
                  <Badge className="absolute top-2 left-2 bg-yellow-400 text-black font-bold z-10">
                    NOVO
                  </Badge>
                )}
                <div className="w-full aspect-[4/5] bg-gray-50 overflow-hidden relative">
                  {receita.imagem_url ? (
                    <img
                      src={receita.imagem_url}
                      alt={receita.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h4 className="font-semibold text-sm mb-2">
                    {receita.titulo}
                  </h4>
                  <Button
                    onClick={() =>
                      downloadPdf(receita.pdf_url, receita.titulo)
                    }
                    className="bg-[#FF4F97] text-white mt-auto"
                  >
                    Acessar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Cadastro */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <ChefHat className="w-6 h-6" />
              Cadastrar Nova Receita
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Título da Receita *</Label>
                <Input value={formData.titulo} onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))} placeholder="Ex: Bolo de Chocolate Perfeito" className="bg-gray-800 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Selecione a categoria..." /></SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">{categorias.map(cat => (<SelectItem key={cat} value={cat} className="text-white hover:bg-gray-700">{cat}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-white text-lg font-semibold">Imagem de Capa *</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="hidden" id="image-upload" disabled={uploading} />
                  <label htmlFor="image-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                    <div className="text-center"><Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" /><p className="text-gray-400">Clique para selecionar a imagem de capa</p><p className="text-xs text-gray-500">PNG, JPG até 5MB</p></div>
                  </label>
                </div>
                {formData.imagem_url && (<div className="w-32 h-32 relative"><img src={formData.imagem_url} alt="Preview" className="w-full h-full object-cover rounded-lg" /><button onClick={() => setFormData(prev => ({ ...prev, imagem_url: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"><X className="w-3 h-3" /></button></div>)}
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-white text-lg font-semibold">Arquivo PDF da Receita (Opcional)</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])} className="hidden" id="pdf-upload" disabled={uploading} />
                  <label htmlFor="pdf-upload" className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                    <div className="text-center"><FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" /><p className="text-gray-400">Clique para selecionar o arquivo PDF</p><p className="text-xs text-gray-500">PDF até 10MB</p></div>
                  </label>
                </div>
                {formData.pdf_url && (<div className="flex items-center gap-2 bg-green-900/20 border border-green-500 rounded-lg p-3"><FileText className="w-5 h-5 text-green-400" /><span className="text-green-400 text-sm">PDF anexado</span><button onClick={() => setFormData(prev => ({ ...prev, pdf_url: '' }))} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button></div>)}
              </div>
            </div>
            <div className="flex gap-4 pt-6 border-t border-gray-700">
              <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)} className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700" disabled={uploading}>Cancelar</Button>
              <Button type="button" onClick={handleSave} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white" disabled={uploading}><Save className="w-4 h-4 mr-2" />{uploading ? 'Salvando...' : 'Salvar Receita'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Edit className="w-6 h-6" />
              Editar Receita
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Título da Receita *</Label>
                <Input value={formData.titulo} onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))} placeholder="Ex: Bolo de Chocolate Perfeito" className="bg-gray-800 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Selecione a categoria..." /></SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">{categorias.map(cat => (<SelectItem key={cat} value={cat} className="text-white hover:bg-gray-700">{cat}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-white text-lg font-semibold">Imagem de Capa *</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="hidden" id="edit-image-upload" disabled={uploading} />
                  <label htmlFor="edit-image-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                    <div className="text-center"><Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" /><p className="text-gray-400">Clique para alterar a imagem</p><p className="text-xs text-gray-500">PNG, JPG até 5MB</p></div>
                  </label>
                </div>
                {formData.imagem_url && (<div className="w-32 h-32 relative"><img src={formData.imagem_url} alt="Preview" className="w-full h-full object-cover rounded-lg" /><button onClick={() => setFormData(prev => ({ ...prev, imagem_url: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"><X className="w-3 h-3" /></button></div>)}
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-white text-lg font-semibold">Arquivo PDF da Receita (Opcional)</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])} className="hidden" id="edit-pdf-upload" disabled={uploading} />
                  <label htmlFor="edit-pdf-upload" className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                    <div className="text-center"><FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" /><p className="text-gray-400">Clique para alterar o PDF</p><p className="text-xs text-gray-500">PDF até 10MB</p></div>
                  </label>
                </div>
                {formData.pdf_url && (<div className="flex items-center gap-2 bg-green-900/20 border border-green-500 rounded-lg p-3"><FileText className="w-5 h-5 text-green-400" /><span className="text-green-400 text-sm">PDF anexado</span><button onClick={() => setFormData(prev => ({ ...prev, pdf_url: '' }))} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button></div>)}
              </div>
            </div>
            <div className="flex gap-4 pt-6 border-t border-gray-700">
              <Button type="button" variant="destructive" onClick={handleDelete} className="flex-1" disabled={uploading}><Trash2 className="w-4 h-4 mr-2" />{uploading ? 'Excluindo...' : 'Excluir Receita'}</Button>
              <Button type="button" onClick={handleUpdate} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white" disabled={uploading}><Save className="w-4 h-4 mr-2" />{uploading ? 'Salvando...' : 'Salvar Alterações'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes goldMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gold {
          animation: goldMove 6s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}