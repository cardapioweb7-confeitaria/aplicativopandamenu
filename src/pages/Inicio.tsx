"use client";

import { useState, ReactNode } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";

// Este é o conteúdo que será exibido na aba "Home".
// Você deve substituir este componente pelo conteúdo real da sua página inicial.
const HomeContent = () => (
  <div className="p-4 text-black">
    <h1 className="text-2xl font-bold">Página Inicial</h1>
    <p>Bem-vindo(a)! O conteúdo principal da sua aplicação deve aparecer aqui.</p>
    <div className="mt-4 p-4 border border-dashed border-gray-400 rounded-lg bg-gray-50">
      <p className="text-sm text-gray-600 text-center">
        (Área para o conteúdo da sua página `Inicio.tsx`)
      </p>
    </div>
  </div>
);

const FavoritosTabContent = () => (
  <div className="p-4 text-black">
    <h1 className="text-2xl font-bold">Favoritos</h1>
    <p>Aqui estão seus itens favoritos.</p>
  </div>
);

const MensagensTabContent = () => (
  <div className="p-4 text-black">
    <h1 className="text-2xl font-bold">Mensagens</h1>
    <p>Suas conversas estão aqui.</p>
  </div>
);

const TrendingTabContent = () => (
  <div className="p-4 text-black">
    <h1 className="text-2xl font-bold">Em Alta</h1>
    <p>Veja o que está bombando no momento.</p>
  </div>
);

export default function InicioPage() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = (): ReactNode => {
    switch (activeTab) {
      case "home":
        return <HomeContent />;
      case "favoritos":
        return <FavoritosTabContent />;
      case "mensagens":
        return <MensagensTabContent />;
      case "trending":
        return <TrendingTabContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <MobileLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      content={renderContent()}
    />
  );
}