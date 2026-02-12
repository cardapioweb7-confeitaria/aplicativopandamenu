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
      {/* restante do código JSX exatamente como você enviou */}
    </div>
  );
}
