"use client";

import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import HomeTab from "@/components/tabs/HomeTab";
import FavoritosTab from "@/components/tabs/FavoritosTab";
import MensagensTab from "@/components/tabs/MensagensTab";
import TrendingTab from "@/components/tabs/TrendingTab";

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab />;
      case "favoritos":
        return <FavoritosTab />;
      case "mensagens":
        return <MensagensTab />;
      case "trending":
        return <TrendingTab />;
      default:
        return <HomeTab />;
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