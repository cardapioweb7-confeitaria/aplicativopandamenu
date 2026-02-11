"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import {
  Button
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";

export default function Receitas() {
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', categoria: '', imagem_file: null });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Verificar role do usuário
  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setLoadingRole(false);
        return;
      }

      try {
        if (user.email === 'teste@gmail.com') {
          setIsOwner(true);
          setLoadingRole(false);
          return;
        }

        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setIsOwner(data?.role === 'owner');
      } catch (error) {
        console.error('Erro ao verificar role:', error);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, [user]);

  // Fetch receitas do usuário
  const fetchReceitas = async () => {
    if (!user || !isOwner) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('receitas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setReceitas(data || []);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceitas();
  }, [user, isOwner]);

  // Handlers modal
  const openModal = () => {
    setModalOpen(true);
    setForm({ titulo: '', categoria: '', imagem_file: null });
    setPreviewUrl(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Imagem muito grande (máx 5MB)');
        return;
      }
      setForm({ ...form, imagem_file: file });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!form.titulo.trim() || !form.categoria.trim() || !form.imagem_file) {
      showError('Preencha todos os campos');
      return;
    }

    setUploading(true);
    try {
      // Upload imagem
      const fileExt = form.imagem_file.name.split('.').pop();
      const fileName = `recipes/${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData } = await supabase.storage
        .from('recipes-images')
        .upload(fileName, form.imagem_file, { upsert: true });

      if (!uploadData) throw new Error('Falha no upload da imagem');

      const { data: publicUrl } = supabase.storage
        .from('recipes-images')
        .getPublicUrl(fileName);

      // Insert receita
      const { error } = await supabase.from('receitas').insert({
        user_id: user.id,
        titulo: form.titulo.trim(),
        categoria: form.categoria.trim(),
        imagem_url: publicUrl.publicUrl,
      });

      if (error) throw error;

      showSuccess('Receita cadastrada com sucesso!');
      closeModal();
      fetchReceitas();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showError(error.message || 'Erro ao cadastrar receita');
    } finally {
      setUploading(false);
    }
  };

  // Filtrar receitas por busca
  const filteredReceitas = receitas.filter(
    (r) =>
      r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar por categoria
  const grouped = filteredReceitas.reduce((acc, receita) => {
    if (!acc[receita.categoria]) acc[receita.categoria] = [];
    acc[receita.categoria].push(receita);
    return acc;
  }, {});

  if (loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <style>{`
        @keyframes goldGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <section className="relative w-full min-h-[40vh] flex flex-col items-center justify-start pt-12 text-center px-6">
        {isOwner && (
          <div className="absolute top-2 left-4 z-20">
            <Button 
              size="sm"
              className="px-3 py-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 border border-green-300"
              style={{
                backgroundColor: '#D4EDDA',
                color: '#155724',
                borderColor: '#C3E6CB'
              }}
              onClick={openModal}
            >
              Cadastrar Receita
            </Button>
          </div>
        )}

        <img 
          src="/101012.png" 
          alt="Logo Receitas" 
          className="mx-auto mb-4 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain drop-shadow-2xl"
        />

        <h1 className="text-3xl md:text-5xl font-black mb-6 leading-[0.95]">
          <span className="block">Receitas</span>
          <span className="block text-transparent bg-clip-text bg-[linear-gradient(90deg,#b88900,#fbbf24,#ffffff,#fbbf24,#b88900)] bg-[length:300%_300%] animate-[goldGradient_6s_linear_infinite]">
            Profissionais
          </span>
        </h1>

        <div className="relative w-full max-w-md mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar receitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg bg-white border border-gray-300 rounded-xl focus:outline-none shadow-none text-gray-900"
          />
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400 mb-4">Nenhuma receita encontrada</p>
            </div>
          ) : (
            Object.entries(grouped).map(([categoria, items]) => (
              <div key={categoria} className="space-y-4">
                <h2 className="text-2xl font-bold px-4 border-l-4 border-pink-500">
                  {categoria} ({items.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((receita) => (
                    <Card
                      key={receita.id}
                      className="bg-[#1a1a1a] border-gray-800 hover:bg-[#262626] transition-all duration-200 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 group"
                    >
                      <CardHeader className="p-0 h-40 relative overflow-hidden">
                        {receita.imagem_url ? (
                          <img
                            src={receita.imagem_url}
                            alt={receita.titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-pink-900 group-hover:to-purple-900 transition-all duration-300 flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <h3 className="font-bold text-lg mb-2 text-white truncate group-hover:text-pink-400 transition-colors">
                          {receita.titulo}
                        </h3>
                        <span className="inline-block bg-pink-600/80 text-white px-2 py-1 rounded-full text-xs font-semibold mb-3">
                          {receita.categoria}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>⭐ 4.9</span>
                          <span>•</span>
                          <span>30 min</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal Cadastrar Receita */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md mx-auto p-0 rounded-2xl">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-2xl font-black text-center">Nova Receita</DialogTitle>
            <DialogDescription className="text-center text-sm">Preencha os dados básicos</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Nome da Receita</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: Bolo de Chocolate"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                placeholder="Ex: Bolos"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imagem">Foto da Capa</Label>
              <Input
                id="imagem"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full h-12 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {previewUrl && (
                <div className="relative w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setForm({ ...form, imagem_file: null });
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="p-6 pt-0 border-t bg-gray-50/50 rounded-b-2xl">
            <Button variant="outline" onClick={closeModal} className="h-12 flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={uploading || !form.titulo.trim() || !form.categoria.trim() || !form.imagem_file}
              className="h-12 flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {uploading ? 'Salvando...' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}