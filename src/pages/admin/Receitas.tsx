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
  const [search, setSearch] = useState("");

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
    loadReceitas();
  }, []);

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

  const filteredReceitas = receitas.filter((r) =>
    r.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* HERO */}
      <section className="relative w-full min-h-[45vh] flex flex-col items-center justify-start pt-8 text-center px-6">

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
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mb-4"
          >
            Cadastrar Conteúdo
          </Button>
        )}

        {/* BARRA DE PESQUISA */}
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

      {/* TODAS AS RECEITAS */}
      <section className="px-6 pb-20 mt-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-400">
            Todas as Receitas
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredReceitas.map((receita) => (
              <div
                key={receita.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col text-gray-800"
              >
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

      {/* ANIMAÇÃO DO DEGRADÊ DOURADO */}
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
