"use client";

import { useState, useEffect } from 'react'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { TabletLayout } from '@/components/layout/TabletLayout'
import { DesktopLayout } from '@/components/layout/DesktopLayout'
import Inicio from './Inicio'
import Receitas from './Receitas'
import Arquivos from './Arquivos'
import Toppers from './Toppers'
import Comunidade from './Comunidade'
import Preview from './Preview'
import DesignSettings from './DesignSettings'
import ProductManager from './ProductManager'
import Clientes from './Clientes'
import Precificacao from './Precificacao'

export default function AdminLayout() {
  const [isCardapioMode, setIsCardapioMode] = useState(false)
  const [activeTab, setActiveTab] = useState('inicio')
  const device = useDeviceDetection()

  // Tabs por modo
  const mainTabs = ['inicio', 'receitas', 'arquivos', 'toppers', 'comunidade', 'cardapio']
  const cardapioTabs = ['previa', 'design', 'produtos', 'clientes', 'precificacao', 'voltar']
  const currentTabs = isCardapioMode ? cardapioTabs : mainTabs

  // Labels por modo
  const mainLabels = {
    inicio: 'Inicio',
    receitas: 'Receitas',
    arquivos: 'Arquivos',
    toppers: 'Toppers',
    comunidade: 'Comunidade',
    cardapio: 'Cardápio'
  }
  const cardapioLabels = {
    previa: 'Prévia',
    design: 'Design',
    produtos: 'Produtos',
    clientes: 'Clientes',
    precificacao: 'Precificação',
    voltar: 'Voltar'
  }
  const currentLabels = isCardapioMode ? cardapioLabels : mainLabels

  // Conteúdo por aba
  const contentMap: Record<string, JSX.Element> = {
    inicio: <Inicio />,
    receitas: <Receitas />,
    arquivos: <Arquivos />,
    toppers: <Toppers />,
    comunidade: <Comunidade />,
    previa: <Preview />,
    design: <DesignSettings />,
    produtos: <ProductManager />,
    clientes: <Clientes />,
    precificacao: <Precificacao />
  }

  // Handlers
  const handleTabChange = (tab: string) => {
    if (!isCardapioMode && tab === 'cardapio') {
      // Entrar no modo Cardápio (primeira aba: Prévia)
      setIsCardapioMode(true)
      setActiveTab('previa')
    } else if (isCardapioMode && tab === 'voltar') {
      // Voltar ao menu principal
      setIsCardapioMode(false)
      setActiveTab('cardapio')
    } else if (isCardapioMode) {
      setActiveTab(tab)
    } else {
      setActiveTab(tab)
    }
  }

  // Salvar estado no localStorage
  useEffect(() => {
    localStorage.setItem('admin-mode', isCardapioMode ? 'cardapio' : 'main')
    localStorage.setItem('admin-active-tab', activeTab)
  }, [isCardapioMode, activeTab])

  useEffect(() => {
    const savedMode = localStorage.getItem('admin-mode')
    const savedTab = localStorage.getItem('admin-active-tab')
    if (savedMode === 'cardapio') {
      setIsCardapioMode(true)
      setActiveTab(savedTab || 'previa')
    } else {
      setIsCardapioMode(false)
      setActiveTab(savedTab || 'inicio')
    }
  }, [])

  const layoutProps = {
    tabs: currentTabs,
    labels: currentLabels,
    activeTab,
    onTabChange: handleTabChange,
    content: contentMap[activeTab as keyof typeof contentMap]
  }

  return (
    <AuthGuard>
      {device === 'mobile' ? (
        <MobileLayout {...layoutProps} />
      ) : device === 'tablet' ? (
        <TabletLayout {...layoutProps} />
      ) : (
        <DesktopLayout {...layoutProps} />
      )}
    </AuthGuard>
  )
}