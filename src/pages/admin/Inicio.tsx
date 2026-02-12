"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AccessCard() {
  const navigate = useNavigate();
  const [nivel, setNivel] = useState("cliente");
  const [loadingNivel, setLoadingNivel] = useState(true);

  // Pega o nível do usuário do Supabase
  useEffect(() => {
    const fetchNivel = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          const userRole = data?.role || "user";
          setNivel(
            userRole === "admin" || userRole === "owner"
              ? "Administrador"
              : "Cliente"
          );
        }
      } catch (error) {
        console.error("Erro ao buscar nível:", error);
        setNivel("Cliente");
      } finally {
        setLoadingNivel(false);
      }
    };

    fetchNivel();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-8">
      <Card className="relative bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Botão Sair */}
        <div className="absolute top-3 right-3 z-20">
          <Button
            variant="destructive"
            size="sm"
            className="px-3 py-1 text-xs font-semibold"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>

        <CardContent className="p-6 text-center space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Status da Conta
          </h2>

          {/* Informações do acesso */}
          <div className="space-y-2">
            <InfoRow label="Seu acesso é" value="Vitalício" color="bg-gradient-to-r from-purple-500 to-indigo-500" />
            <InfoRow label="Você agora é" value="Premium" color="bg-gradient-to-r from-green-400 to-teal-400" />
            <InfoRow label="Nível Atual" value={loadingNivel ? "Carregando..." : nivel} color="bg-gradient-to-r from-yellow-400 to-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente auxiliar para linhas de informação
interface InfoRowProps {
  label: string;
  value: string;
  color?: string;
}

const InfoRow = ({ label, value, color }: InfoRowProps) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg shadow-sm">
      <span className="text-gray-600 text-sm font-medium">{label}</span>
      <span
        className={`text-white text-xs font-bold px-2 py-1 rounded-full ${color}`}
      >
        {value}
      </span>
    </div>
  );
};
