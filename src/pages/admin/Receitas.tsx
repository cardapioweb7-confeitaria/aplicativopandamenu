"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Define the type for a recipe
interface Receita {
  id: string;
  titulo: string;
  categoria: string;
  imagem_url: string;
  pdf_url: string;
}

export default function Receitas() {
  const { user } = useAuth();
  const [receitasEmAlta, setReceitasEmAlta] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if the user is the owner/admin
      if (user.email === 'teste@gmail.com') {
        setIsOwner(true);
      }
      fetchReceitas();
    }
  }, [user]);

  const fetchReceitas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6); // Fetching 6 for "Em Alta"

      if (error) throw error;
      setReceitasEmAlta(data || []);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (receita: Receita) => {
    // Logic to open an edit modal would go here
    console.log('Editing recipe:', receita);
  };

  const downloadPdf = (pdfUrl: string, title: string) => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando receitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* SEÇÃO EM ALTA */}
      {receitasEmAlta.length > 0 && (
        <div className="px-6">
          <div className="max-w-6xl mx-auto p-8 rounded-3xl shadow-2xl 
            bg-gradient-to-r from-[#3a2e00] via-[#b88900] to-[#fbbf24]">
            
            <h2 className="text-2xl font-bold mb-8 text-center text-white">
              🔥 Em Alta
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {receitasEmAlta.map((receita) => (
                <div
                  key={receita.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col border border-gray-100 text-gray-800"
                >
                  <div className="w-full aspect-square bg-gray-50 overflow-hidden relative">
                    {isOwner && (
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleOpenEditModal(receita)}
                        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}

                    {receita.imagem_url ? (
                      <img
                        src={receita.imagem_url}
                        alt={receita.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-semibold text-sm leading-tight flex-1 line-clamp-2 mb-3">
                      {receita.titulo}
                    </h4>

                    <div className="mt-auto">
                      <div className="mb-3">
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0.5 rounded-sm"
                          style={{ backgroundColor: '#6A0122', color: 'white' }}
                        >
                          {receita.categoria}
                        </Badge>
                      </div>

                      <Button
                        onClick={() =>
                          downloadPdf(receita.pdf_url, receita.titulo)
                        }
                        className="w-full py-2 px-3 rounded-lg text-white text-xs font-medium transition-colors text-center whitespace-nowrap"
                        style={{ backgroundColor: '#FF4F97' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E64280';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FF4F97';
                        }}
                        disabled={!receita.pdf_url}
                      >
                        Acessar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}