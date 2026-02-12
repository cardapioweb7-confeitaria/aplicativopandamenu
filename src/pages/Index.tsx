"use client";

import { useState, ReactNode } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";

const HomeTabContent = () => (
  <div className="p-4 text-black">
    <h1 className="text-2xl font-bold">Página Inicial</h1>
    <p>Bem-vindo(a) à sua página inicial!</p>
    {/* Você pode adicionar o conteúdo da sua home page aqui */}
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

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = (): ReactNode => {
    switch (activeTab) {
      case "home":
        return <HomeTabContent />;
      case "favoritos":
        return <FavoritosTabContent />;
      case "mensagens":
        return <MensagensTabContent />;
      case "trending":
        return <TrendingTabContent />;
      default:
        return <HomeTabContent />;
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