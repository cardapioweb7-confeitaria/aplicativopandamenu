"use client";

import React, { useState, useEffect } from "react";
import { Search, ChefHat, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
      setForm({ nome_arquivo: "", categoria: "", imagem_file: null, arquivo_file: null });
      fetchData();
    } reset form
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
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // ===============================
  // SEM PERMISSÃO
  // ===============================
  if (!isOwner)Assistant: First, the user wants: "deixe apenas 1 botão de nova receita e bem pequeno logo abaixo da barra de pesquisa na cor verde fixo sem emoji/icone ao lado."

So, only ONE button for "Nova Receita":
- Small size
- Below the search bar
- Green color
- Fixed (probably means always visible)
- No icon/emoji next to it

Remove all other buttons: the big one in hero, the one in empty state.

There's a "Selected components" list, which seems like suggestions for edits in the empty state, but the main request is about the button.

The previous code has:
- Big gradient button in hero section
- Button in empty state
- I need to remove those, add only one small green button right after the search bar.

The design is dark theme: bg-[#0f0f0f]

Green button: probably bg-green-500 or similar Tailwind classes.

Use shadcn Button with size="sm", className with green colors.

Position: logo abaixo da barra de pesquisa -> right after the search input div.

Make it fixed? "fixo" might mean static/always there, not floating fixed position.

Also, there's selected components for empty state: ChefHat, div, h3, p, Button – probably to edit the empty state, but since we're removing the button there, adjust accordingly.

In empty state, keep the ChefHat icon, but remove the button.

Reset form after save: in handleSave, add setForm reset.

In the assistant's previous incomplete response, it has some syntax errors, but I need to generate the full file.

Structure:
- Keep hero with logo, title, search bar
- IMMEDIATELY after search div, add the small green button
- Remove the big button from hero
- In grid section: loading, empty state (without button), or list
- Empty state: keep icon, title "Nenhuma receita encontrada", p text, NO button
- Modal unchanged

Button: <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl mx-auto block" onClick={() => setModalOpen(true)}>Nova Receita</Button>

Center it with mx-auto block.

In hero section, after the search div mb-12, but since removing big button, adjust.

Search div has mb-12, then was big button. Now put small button there with mb-4 or something.

Also, import only necessary icons: Search, ChefHat (for empty), Plus? No, no icon on button.

User said sem emoji/icone ao lado, so no Plus.

In previous code, X was imported but not used.

In handleSave, after success: setForm reset.

setForm({ nome_arquivo: "", categoria: "", imagem_file: null, arquivo_file: null });

In empty state snippets, perhaps customize text, but main request is button.

The selected components seem like VSCode-like suggestions, but I think it's for me to edit those parts if needed. For now, focus on request.

Output: Brief explanation, then <dyad-write> full file, then summary.

Explanation: Removido todos os botões extras. Adicionado apenas 1 botão pequeno verde abaixo da barra de pesquisa. Empty state sem botão. Form reseta após salvar.

Chat summary: Um botão verde pequeno para nova receita

Language: Portuguese, since user is using PT.Removidos todos os botões extras (hero e empty state). Adicionado **apenas 1 botão pequeno verde** ("Nova Receita", sem ícone) logo abaixo da barra de pesquisa, centralizado e sempre visível. Empty state limpo (mantido ícone ChefHat, mas sem botão). Form reseta após salvar.

<dyad-write path="src/pages/admin/Receitas.tsx" description="Apenas 1 botão pequeno verde fixo abaixo da busca (sem ícone). Removidos extras. Empty state sem botão. Reset form.">
"use client";

import React, { useState, useEffect } from "react";
import { Search, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
      setForm({
        nome_arquivo: "",
        categoria: "",
        imagem_file: null,
        arquivo_file: null,
      });
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
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // ===============================
  // SEM PERMISSÃO
  // ===============================
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-gray-400 mb-8">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  // ===============================
  // RENDER PRINCIPAL - DESIGN ORIGINAL
  // ===============================
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
        <img 
          src="/101012.png" 
          alt="Logo Receitas" 
          className="mx-auto mb-6 w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain drop-shadow-2xl"
        />

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-12 py-4 text-lg bg-white border border-gray-300 rounded-xl focus:outline-none shadow-none text-gray-900"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* ÚNICO BOTÃO - PEQUENO VERDE */}
        <Button
          onClick={() => setModalOpen(true)}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2 rounded-xl border-0 shadow-lg mx-auto mb-12"
        >
          Nova Receita
        </Button>

      </section>

      {/* CONTEÚDO ABAIXO */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xl text-gray-400 font-semibold">Carregando receitas...</p>
            </div>
          ) : filteredReceitas.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Nenhuma receita encontrada</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm ? `Nenhuma receita encontrada para "${searchTerm}"` : 'Cadastre sua primeira receita profissional!'}
              </p>
            </div>
          ) : (
            filteredReceitas.map((receita) => (
              <div
                key={receita.id}
                className="bg-[#1a1a1a] p-6 rounded-2xl group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-[#262626] hover:border-pink-500"
              >
                <div className="h-32 bg-[#262626] rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  <img 
                    src={receita.imagem_url} 
                    alt={receita.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-2 text-white line-clamp-2">{receita.titulo}</h3>
                <p className="text-sm text-gray-400 line-clamp-1">{receita.categoria}</p>
              </div>
            ))
          )}

        </div>
      </section>

      {/* MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
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