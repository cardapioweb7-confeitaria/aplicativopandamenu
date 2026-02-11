import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import { CacheProvider } from "@/hooks/useCache";
import { CartProvider } from "@/context/CartContext";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import CardapioPublico from "./pages/cardapio/[slug]";
import Cadastro from "./pages/cardapio/Cadastro";
import NotFound from "./pages/NotFound";
import { EnvironmentError } from "./components/EnvironmentError";
import { ErrorBoundary } from "./pages/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,        // Desativa recarregamento ao focar na janela
      refetchOnReconnect: false,        // Desativa recarregamento ao reconectar
      staleTime: 1000 * 60 * 5,        // 5 minutos de cache
    },
  },
});

const App = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Verificação das variáveis de ambiente
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // DEBUG: Mostrar valores no console
  console.log('🔍 Verificação de ambiente:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Presente' : 'Ausente');
  
  // Se não tiver as variáveis, mostra erro
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variáveis de ambiente ausentes!');
    return <EnvironmentError />;
  }

  // Aguardar hidratação no cliente
  if (!isClient) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#fef2f2'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <CacheProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cardapio/cadastro" element={<Cadastro />} />
                  <Route path="/admin" element={<AdminLayout />} />
                  <Route path="/admin/exclusivo" element={<AdminLayout />} />
                  {/* ROTA DO CARDÁPIO PÚBLICO */}
                  <Route path="/cardapio/:slug" element={<CardapioPublico />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
};

export default App;