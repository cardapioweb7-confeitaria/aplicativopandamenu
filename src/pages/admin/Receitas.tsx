"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";

export default function Receitas() {
  const { user } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [receitas, setReceitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    nome_arquivo: "",
    categoria: "",
    imagem_file: null as File | null,
    arquivo_file: null as File | null,
  });

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState("");

  // ===============================
  // Verificar Role
  // ===============================
  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setLoadingRole(false);
        return;
      }

      try {
        if (user.email === "teste@gmail.com") {
          setIsOwner(true);
          setLoadingRole(false);
          return;
        }

        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsOwner(data?.role === "owner");
      } catch (error) {
        console.error("Erro ao verificar role:", error);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, [user]);

  // ===============================
  // Buscar receitas
  // ===============================
  const fetchData = async () => {
    if (!user || !isOwner) return;

    setLoading(true);

    try {
      const { data } = await supabase
        .from("receitas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setReceitas(data || []);
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, isOwner]);

  // ===============================
  // Upload
  // ===============================
  const handleSave = async () => {
    if (!form.nome_arquivo || !form.categoria || !form.imagem_file) {
      showError("Preencha Nome, Categoria e Imagem");
      return;
    }

    if (!user) return;

    setUploading(true);

    try {
      const imgExt = form.imagem_file.name.split(".").pop();
      const imgName = `recipes/${user.id}-${Date.now()}.${imgExt}`;

      const { error: uploadError } = await supabase.storage
        .from("recipes-images")
        .upload(imgName, form.imagem_file);

      if (uploadError) throw uploadError;

      const { data: imgUrl } = supabase.storage
        .from("recipes-images")
        .getPublicUrl(imgName);

      await supabase.from("receitas").insert({
        user_id: user.id,
        titulo: form.nome_arquivo,
        categoria: form.categoria,
        imagem_url: imgUrl.publicUrl,
      });

      showSuccess("Receita cadastrada com sucesso!");
      setModalOpen(false);
      fetchData();
    } catch (error: any) {
      showError(error.message || "Erro ao salvar");
    } finally {
      setUploading(false);
    }
  };

  // ===============================
  // Filtro
  // ===============================
  const filteredReceitas = receitas.filter(
    (r) =>
      r.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===============================
  // LOADING ROLE
  // ===============================
  if (loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // ===============================
  // SEM PERMISSÃO
  // ===============================
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Você não tem permissão para acessar essa página.</p>
      </div>
    );
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Receitas</h1>

        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Nova Receita
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Search size={18} />
        <Input
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Carregando receitas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredReceitas.map((receita) => (
            <Card key={receita.id}>
              <CardContent className="p-4">
                <img
                  src={receita.imagem_url}
                  alt={receita.titulo}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h2 className="font-semibold">{receita.titulo}</h2>
                <p className="text-sm text-gray-500">
                  {receita.categoria}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Receita</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Nome"
            value={form.nome_arquivo}
            onChange={(e) =>
              setForm({ ...form, nome_arquivo: e.target.value })
            }
          />

          <Input
            placeholder="Categoria"
            value={form.categoria}
            onChange={(e) =>
              setForm({ ...form, categoria: e.target.value })
            }
          />

          <Input
            type="file"
            onChange={(e) =>
              setForm({ ...form, imagem_file: e.target.files?.[0] || null })
            }
          />

          <DialogFooter>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
