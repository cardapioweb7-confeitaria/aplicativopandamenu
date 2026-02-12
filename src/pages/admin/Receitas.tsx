"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Upload,
  FileText,
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
import { CategoryFilter } from "@/components/cardapio/CategoryFilter";

interface Receita {
  id: string;
  titulo: string;
  categoria: string;
  imagem_url: string;
  pdf_url: string;
  created_at: string;
}

const categorias = [
  "Bolos",
  "Tortas",
  "Cupcakes",
  "Doces",
  "Salgados",
  "Massas",
  "Coberturas",
  "Recheios",
  "Outros",
];

const BUCKET_NAME = "public_files";

export default function Receitas() {
  const { user } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

    if (!error && data) setReceitas(data as Receita[]);
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

  const isNew = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMinutes =
      (now.getTime() - createdDate.getTime()) / (1000 * 60);
    return diffInMinutes < 5;
  };

  const filteredReceitas = receitas.filter((r) => {
    const matchesSearch = r.titulo
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? r.categoria === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const filterCategories = [
    { name: "Todos", icon: "" },
    ...categorias.map((cat) => ({ name: cat, icon: "" })),
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* HERO */}
      <section className="relative w-full flex flex-col items-center justify-start pt-8 text-center px-6 pb-8">

        <img
          src="/101012.png"
          alt="Logo Receitas"
          className="mx-auto mb-6 w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain"
        />

        {isOwner && (
          <Button
            onClick={() => setShowUploadModal(true)}
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

        {/* FILTRO DE CATEGORIAS */}
        <div className="w-full max-w-4xl mt-6">
          <CategoryFilter
            categories={filterCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={(cat) =>
              setSelectedCategory(cat === "Todos" ? null : cat)
            }
          />
        </div>
      </section>

      {/* TODAS AS RECEITAS */}
      <section className="px-6 pb-20 mt-4">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredReceitas.map((receita) => (
              <div
                key={receita.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col text-gray-800 relative"
              >
                {isNew(receita.created_at) && (
                  <Badge className="absolute top-2 left-2 bg-yellow-400 text-black font-bold z-10">
                    NOVO
                  </Badge>
                )}

                <div className="w-full aspect-[3/4] bg-gray-50 overflow-hidden relative">

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
                  <h4 className="font-semibold text-sm mb-3">
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

    </div>
  );
}
