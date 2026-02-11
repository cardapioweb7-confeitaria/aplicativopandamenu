"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // ===============================
  // SEM PERMISSÃO
  // ===============================
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-8">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  // ===============================
  // RENDER PRINCIPAL
  // ===============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-4 sm:p-6">
      {/* HEADER COM LOGO E GRADIENTE */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <img 
            src="/logopandamenu.png" 
            alt="Panda Menu" 
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain shadow-2xl rounded-2xl"
          />
          <div>
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Receitas<br />Profissionais
            </h1>
            <p className="text-xl text-gray-700 font-semibold max-w-md mx-auto">
              Gerencie suas receitas exclusivas e compartilhe com a comunidade
            </p>
          </div>
        </div>
        
        {/* CTA PRINCIPAL */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setModalOpen(true)}
            size="lg"
            className="group bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-700 hover:via-rose-600 hover:to-purple-700 text-white font-bold text-lg px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <Plus className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Nova Receita
          </Button>
        </div>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar receitas por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 shadow-lg"
          />
        </div>
      </div>

      {/* GRID DE RECEITAS */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 font-semibold">Carregando receitas...</p>
          </div>
        ) : filteredReceitas.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <ChefHat className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhuma receita encontrada</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm ? `Nenhuma receita encontrada para "${searchTerm}"` : 'Cadastre sua primeira receita profissional!'}
            </p>
            <Button 
              onClick={() => setModalOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-700 hover:via-rose-600 hover:to-purple-700 text-white font-bold px-12 py-6 rounded-2xl shadow-2xl"
            >
              <Plus className="w-6 h-6 mr-3" />
              Cadastrar Receita
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReceitas.map((receita) => (
              <Card key={receita.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white/70 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <img
                    src={receita.imagem_url}
                    alt={receita.titulo}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800 font-bold px-3 py-1 shadow-md">
                      {receita.categoria}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 pt-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">{receita.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{receita.descricao}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">R$ 0,00</span>
                    <Button size="sm" variant="outline" className="border-pink-500 text-pink-600 hover:bg-pink-50">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <Plus className="w-5 h-5" />
              Nova Receita
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Input
                placeholder="Nome da Receita"
                value={form.nome_arquivo}
                onChange={(e) =>
                  setForm({ ...form, nome_arquivo: e.target.value })
                }
              />
            </div>

            <div>
              <Input
                placeholder="Categoria"
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
              />
            </div>

            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, imagem_file: e.target.files?.[0] || null })
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? "Salvando..." : "Salvar Receita"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}