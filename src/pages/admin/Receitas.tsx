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

    if (!error && data) setReceitas(data);
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

  const handleImagemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setImagemFile(file);
    setFormData({ ...formData, imagem_url: URL.createObjectURL(file) });
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setPdfFile(file);
    setFormData({ ...formData, pdf_url: URL.createObjectURL(file) });
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

  const handleSaveOrUpdate = async () => {
    if (!formData.titulo.trim()) return showError("Título é obrigatório");
    if (!formData.categoria) return showError("Categoria é obrigatória");
    if (!formData.imagem_url) return showError("Imagem é obrigatória");

    setUploading(true);

    try {
      let finalImageUrl = formData.imagem_url;
      let finalPdfUrl = formData.pdf_url;

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
        await supabase
          .from("receitas")
          .update(recipeData)
          .eq("id", editingReceita.id);
        showSuccess("Receita atualizada com sucesso!");
      } else {
        await supabase.from("receitas").insert(recipeData);
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

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* HERO */}
      <section className="relative w-full min-h-[55vh] flex flex-col items-center justify-start pt-12 text-center px-6">

        <img
          src="/101012.png"
          alt="Logo Receitas"
          className="mx-auto mb-6 w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain"
        />

        <h1 className="text-4xl md:text-6xl font-black mb-8">
          Receitas Profissionais
        </h1>

        {isOwner && (
          <Button
            onClick={handleOpenUploadModal}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mb-8"
          >
            Cadastrar Conteúdo
          </Button>
        )}
      </section>

      {/* TODAS AS RECEITAS */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-400">
            Todas as Receitas
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {receitas.map((receita) => (
              <div
                key={receita.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col text-gray-800"
              >
                <div className="w-full aspect-[4/5] bg-gray-50 overflow-hidden relative">
                  {isOwner && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleOpenEditModal(receita)}
                      className="absolute top-2 right-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}

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

                  <Badge className="mb-3 bg-[#6A0122] text-white">
                    {receita.categoria}
                  </Badge>

                  <Button
                    onClick={() =>
                      downloadPdf(receita.pdf_url, receita.titulo)
                    }
                    className="bg-[#FF4F97] text-white"
                  >
                    Acessar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
