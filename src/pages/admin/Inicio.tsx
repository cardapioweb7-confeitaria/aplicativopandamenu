"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function Inicio() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        fetchProfile(user.id);
      }
    });
  }, []);

  const fetchProfile = async (id) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar perfil:', error);
    } else {
      setProfile(data);
      setNewName(data?.nome || '');
      setNewAvatarUrl(data?.avatar_url || '');
      setImageSrc(data?.avatar_url || null);
    }
  };

  const handleEditClick = () => {
    setNewName(profile?.nome || '');
    setNewAvatarUrl(profile?.avatar_url || '');
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        nome: newName.trim() || null,
        avatar_url: newAvatarUrl.trim() || null,
      });
      if (error) throw error;
      await fetchProfile(user.id);
      setEditOpen(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const nameDisplay = profile?.nome ? `Olá ${profile.nome}` : 'Olá';

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start md:justify-center pt-2 px-4 pb-8 md:p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <Card className="w-full max-w-md border-0 rounded-3xl overflow-hidden bg-white mt-8 md:mt-12">
          <CardContent className="relative pt-12 md:pt-20 p-8 md:p-12 pb-8 md:pb-12 text-center">
            {/* BOTÃO SAIR VERMELHO - APENAS MOBILE - TOP-LEFT ACIMA DA LOGO */}
            <div className="md:hidden absolute top-4 left-4 z-30">
              <Button
                variant="destructive"
                size="sm"
                className="px-3 py-1 text-xs font-semibold h-auto"
                onClick={handleLogout}
              >
                SAIR
              </Button>
            </div>

            {/* Logo EXATA do cardapio público + borda rosa ANIMADA */}
            <div className="relative mx-auto mb-2 w-48 h-48">
              {/* Anel gradient FULL SIZE - borda colorida externa girando SOZINHA */}
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 animate-[spin_6s_linear_infinite]"
                style={{
                  zIndex: 1,
                  filter: 'blur(0px)'
                }}
              />
              
              {/* Container ESTÁTICO da imagem + bordas internas (z-10 > girando) */}
              <div 
                className="relative z-10 w-full h-full flex items-center justify-center rounded-full"
                style={{
                  padding: '6px',
                  backgroundClip: 'content-box',
                  WebkitBackgroundClip: 'content-box',
                  boxSizing: 'border-box'
                }}
              >
                {/* Borda branca interna + padding - EXATO do Logo.tsx */}
                <div 
                  className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white"
                  style={{
                    border: '3px solid white',
                    padding: '2px'
                  }}
                >
                  {/* Imagem ou Placeholder dinâmico */}
                  {imageSrc ? (
                    <img 
                      src={imageSrc} 
                      alt="Foto do perfil" 
                      className="w-full h-full object-cover rounded-full block"
                      onError={() => setImageSrc(null)}
                    />
                  ) : (
                    <User className="w-full h-full text-gray-300 p-4 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>

            {/* Nome do Cliente com ícone de lápis inline na mesma linha */}
            <div className="flex items-center justify-center gap-2 mb-6 p-4 rounded-2xl bg-white">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{nameDisplay}</h1>
              <button 
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all cursor-pointer group border border-gray-100 flex-shrink-0"
                title="Editar perfil"
                type="button"
                onClick={handleEditClick}
              >
                <Edit className="w-5 h-5 text-gray-500 group-hover:text-pink-500 transition-colors" />
              </button>
            </div>

            {/* Status simples - texto empilhado sem background, centralizado no bloco mas alinhado à esquerda */}
            <div className="space-y-2 mx-auto w-64 p-6 rounded-2xl border-2 border-dashed border-pink-300 bg-white/50 shadow-lg backdrop-blur-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="grid grid-cols-[1fr_auto] items-center gap-1">
                <span className="text-lg font-medium text-gray-800">Seu acesso é</span>
                <span className="inline-block bg-[#660033]/70 text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  Vitalício
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-1">
                <span className="text-lg font-medium text-gray-800">Você agora é</span>
                <span className="inline-block bg-[#660033]/70 text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  Premium
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-1">
                <span className="text-lg font-medium text-gray-800">Nível Atual é</span>
                <span className="inline-block bg-[#660033]/70 text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  Iniciante
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD REFAZIDO: Instale o App - AZUL ESCURO #010135 + faviconapp.png + selo Recomendado + stats abaixo */}
        <Card className="w-full max-w-md border-0 rounded-3xl overflow-hidden bg-[#010135] mt-6 relative">
          {/* Faixa "Recomendado" estilo ribbon igual promoções */}
          <div 
            className="absolute top-4 -right-12 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold px-6 py-2 transform rotate-45 shadow-lg z-10"
            style={{ 
              width: '180px',
              textAlign: 'center',
              fontSize: '0.8rem'
            }}
          >
            Recomendado
          </div>
          
          <CardContent className="p-8 text-center pt-16 md:pt-20">
            <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
              {/* ÍCONE à ESQUERDA + TÍTULO lado a lado, centralizado - QUEBRA EXATA APÓS 'INSTALE' */}
              <div className="flex items-center gap-4 justify-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-2xl">
                  <img 
                    src="/faviconapp.png" 
                    alt="App" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight text-left leading-tight">
                  INSTALE<br />NOSSO APP
                </h2>
              </div>
              
              {/* Textos centralizados - SUBTEXTO EM 2 LINHAS COM ESPAÇAMENTO MÍNIMO */}
              <div className="text-white text-base max-w-sm mx-auto leading-5 text-center space-y-0.5">
                <span className="block">Todas as funcionalidades na</span>
                <span className="block">palma da sua mão agora!</span>
              </div>
              
              {/* Botão NEON DOURADO abaixo, centralizado full-width responsivo */}
              <Button 
                className="w-full h-14 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-gray-900 font-bold text-lg rounded-2xl px-8 shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/70 transition-all duration-300 glow-neon"
              >
                Instalar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Edição de Perfil */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Altere seu nome e adicione uma URL de imagem de perfil (ex: Imgur).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatar">URL da Imagem (opcional)</Label>
              <Input
                id="avatar"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="https://exemplo.com/sua-imagem.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes spin-border {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-border {
          animation: spin-border 3s linear infinite;
        }
        .glow-neon {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
        }
        @media (hover: hover) {
          .glow-neon:hover {
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.8);
          }
        }
      `}</style>
    </>
  )
}