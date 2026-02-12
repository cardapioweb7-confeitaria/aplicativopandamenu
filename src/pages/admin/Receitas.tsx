"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function AdminExclusivo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    nome_arquivo: "",
    categoria: "",
    imagem_file: null as File | null,
    arquivo_file: null as File | null,
  });

  const handleUpload = async () => {
    if (!form.nome_arquivo || !form.categoria || !form.imagem_file || !form.arquivo_file) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setUploading(true);

      // Upload imagem
      const { data: imagemData, error: imagemError } = await supabase.storage
        .from("receitas")
        .upload(`imagens/${Date.now()}_${form.imagem_file.name}`, form.imagem_file);

      if (imagemError) throw imagemError;

      // Upload PDF
      const { data: arquivoData, error: arquivoError } = await supabase.storage
        .from("receitas")
        .upload(`arquivos/${Date.now()}_${form.arquivo_file.name}`, form.arquivo_file);

      if (arquivoError) throw arquivoError;

      // Pegar URL pública
      const imagemUrl = supabase.storage
        .from("receitas")
        .getPublicUrl(imagemData.path).data.publicUrl;

      const arquivoUrl = supabase.storage
        .from("receitas")
        .getPublicUrl(arquivoData.path).data.publicUrl;

      // Salvar no banco
      const { error: insertError } = await supabase.from("receitas").insert({
        titulo: form.nome_arquivo,
        categoria: form.categoria,
        imagem_url: imagemUrl,
        arquivo_url: arquivoUrl,
      });

      if (insertError) throw insertError;

      alert("Receita cadastrada com sucesso!");

      setModalOpen(false);

      // RESET FORM CORRETO
      setForm({
        nome_arquivo: "",
        categoria: "",
        imagem_file: null,
        arquivo_file: null,
      });

    } catch (error: any) {
      alert(error.message || "Erro ao salvar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">

      {/* Botão central */}
      <button
        onClick={() => setModalOpen(true)}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl"
      >
        Cadastrar Receitas
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-md space-y-4">

            <h2 className="text-2xl font-bold text-center">Nova Receita</h2>

            <input
              type="text"
              placeholder="Nome da receita"
              value={form.nome_arquivo}
              onChange={(e) =>
                setForm({ ...form, nome_arquivo: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-[#262626] border border-gray-600"
            />

            <select
              value={form.categoria}
              onChange={(e) =>
                setForm({ ...form, categoria: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-[#262626] border border-gray-600"
            >
              <option value="">Selecionar categoria</option>
              <option value="Bolos">Bolos</option>
              <option value="Doces">Doces</option>
              <option value="Tortas">Tortas</option>
            </select>

            <div>
              <label className="block mb-1 text-sm">Upload da Imagem</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, imagem_file: e.target.files?.[0] || null })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Upload do PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setForm({ ...form, arquivo_file: e.target.files?.[0] || null })
                }
                className="w-full"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-gray-600 py-2 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-yellow-500 text-black font-bold py-2 rounded-lg"
              >
                {uploading ? "Salvando..." : "Salvar"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
