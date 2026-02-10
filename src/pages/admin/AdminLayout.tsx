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
import Cardapio from './Cardapio'

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('inicio')
  const device = useDeviceDetection()

  const content = {
    inicio: <Inicio />,
    receitas: <Receitas />,
    arquivos: <Arquivos />,
    cardapio: <Cardapio />
  }

  const layoutProps = {
    activeTab,
    onTabChange: setActiveTab,
  }

  return (
    <AuthGuard>
      {device === 'mobile' ? (
        <MobileLayout {...layoutProps}>
          {content[activeTab as keyof typeof content]}
        </MobileLayout>
      ) : device === 'tablet' ? (
        <TabletLayout {...layoutProps}>
          {content[activeTab as keyof typeof content]}
        </TabletLayout>
      ) : (
        <DesktopLayout {...layoutProps}>
          {content[activeTab as keyof typeof content]}
        </DesktopLayout>
      )}
    </AuthGuard>
  )
}