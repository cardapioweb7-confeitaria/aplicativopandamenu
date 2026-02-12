"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Upload,
  FileText,
  Plus,
  Edit,
  Trash2,
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

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";

interface Receita {
  id: string;
  titulo: string;
  categoria: string;
  imagem_url: string;
  pdf_url: string;
}

export default function Receitas() {
  const { user } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [newCategoria, setNewCategoria] = useState("");
  const [showNewCategoriaInput, setShowNewCategoriaInput] = useState(false);
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    imagem_url: "",
    pdf_url: "",
  });

  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // =============================
  // CHECK OWNER
  // =============================
  useEffect(() => {
    const checkOwnerStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data?.role === "owner") {
          setIsOwner(true);
        }
      } catch (error) {
        console.error("Error checking owner status:", error);
      }
    };

    checkOwnerStatus();
  }, [user]);

  // =============================
  // LOAD RECEITAS
  // =============================
  const loadReceitas = async () => {
    const { data, error } = await supabase
      .from("receitas")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReceitas(data);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from("receitas")
        .select("categoria");

      if (!error && data) {
        const categoriasList = data
          .map((item) => item.categoria)
          .filter(Boolean) as string[];

        setCategorias(Array.from(new Set(categoriasList)));
      }

      loadReceitas();
    };

    loadData();
  }, []);

  // =============================
  // UPLOADS
  // =============================
  const handleImagemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setImagemFile(file);
    setFormData({
      ...formData,
      imagem_url: URL.createObjectURL(file),
    });
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setPdfFile(file);
    setFormData({
      ...formData,
      pdf_url: URL.createObjectURL(file),
    });
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      categoria: "",
      imagem_url: "",
      pdf_url: "",
    });
    setImagemFile(null);
    setPdfFile(null);
    setNewCategoria("");
    setShowNewCategoriaInput(false);
    setEditingReceita(null);
  };

  const handleOpenUploadModal = () => {
    resetForm();
    setShowUploadModal(true);
  };

  const handleOpenEditModal = (receita: Receita) => {
    setEditingReceita(receita);
    setFormData({
      titulo: receita.titulo,
      categoria: receita.categoria,
      imagem_url: receita.imagem_url,
      pdf_url: receita.pdf_url,
    });
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    resetForm();
  };

  // =============================
  // SAVE / UPDATE
  // =============================
  const handleSaveOrUpdate = async () => {
    if (!formData.titulo.trim()) {
      showError("Título é obrigatório");
      return;
    }

    if (!formData.categoria) {
      showError("Categoria é obrigatória");
      return;
    }

    if (!formData.imagem_url) {
      showError("Imagem é obrigatória");
      return;
    }

    setUploading(true);

    try {
      let finalImageUrl = editingReceita
        ? editingReceita.imagem_url
        : formData.imagem_url;

      if (imagemFile) {
        const imagemFileName = `receitas/${Date.now()}_${imagemFile.name}`;

        const { error } = await supabase.storage
          .from("products")
          .upload(imagemFileName, imagemFile);

        if (error) throw error;

        finalImageUrl = supabase.storage
          .from("products")
          .getPublicUrl(imagemFileName).data.publicUrl;
      }

      let finalPdfUrl = editingReceita
        ? editingReceita.pdf_url
        : formData.pdf_url;

      if (pdfFile) {
        const pdfFileName = `receitas/${Date.now()}_${pdfFile.name}`;

        const { error } = await supabase.storage
          .from("products")
          .upload(pdfFileName, pdfFile);

        if (error) throw error;

        finalPdfUrl = supabase.storage
          .from("products")
          .getPublicUrl(pdfFileName).data.publicUrl;
      }

      const recipeData = {
        titulo: formData.titulo,
        categoria: formData.categoria,
        imagem_url: finalImageUrl,
        pdf_url: finalPdfUrl,
        user_id: user?.id,
        is_global: true,
      };

      if (editingReceita) {
        const { error } = await supabase
          .from("receitas")
          .update(recipeData)
          .eq("id", editingReceita.id);

        if (error) throw error;

        showSuccess("Receita atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from("receitas")
          .insert(recipeData);

        if (error) throw error;

        showSuccess("Receita cadastrada com sucesso!");
      }

      handleCloseUploadModal();
      loadReceitas();
    } catch (error: any) {
      showError("Erro ao salvar conteúdo: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingReceita) return;

    if (
      !confirm(
        `Tem certeza que deseja excluir a receita "${editingReceita.titulo}"?`
      )
    )
      return;

    setUploading(true);

    try {
      const { error } = await supabase
        .from("receitas")
        .delete()
        .eq("id", editingReceita.id);

      if (error) throw error;

      showSuccess("Receita excluída com sucesso!");
      handleCloseUploadModal();
      loadReceitas();
    } catch (error: any) {
      showError("Erro ao excluir receita: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadPdf = (url: string, title: string) => {
    if (!url) {
      showError("Nenhum arquivo PDF para baixar.");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.pdf`;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =============================
  // RENDER
  // =============================
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Seu JSX continua exatamente igual ao que você enviou */}
    </div>
  );
}
