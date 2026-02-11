"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Package, Calendar, Clock, DownloadCloud } from 'lucide-react'

export default function Inicio() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Data alvo: 20/02/2026 às 00:00
  const targetDate = new Date('2026-02-20T00:00:00').getTime()

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 bg-clip-text text-transparent mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-gray-600">Bem-vindo ao painel administrativo do Panda Menu</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Usuários */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">7.690</CardTitle>
                  <CardDescription>Usuários Ativos</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Versão */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">2.1.9</CardTitle>
                  <CardDescription>Versão Atual</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Última Atualização */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">15/12/2025</CardTitle>
                  <CardDescription>Última Atualização</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Próxima Atualização */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-white animate-spin-slow" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">20/02/2026</CardTitle>
                  <CardDescription>Próxima Atualização</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Countdown Timer */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-400 text-white overflow-hidden">
          <CardHeader className="text-center pb-0">
            <CardTitle className="text-3xl font-bold mb-2">⏰ Contagem Regressiva</CardTitle>
            <CardDescription className="text-orange-100">Próxima grande atualização</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl lg:text-4xl font-black">{countdown.days.toString().padStart(2, '0')}</div>
                <div className="text-sm uppercase tracking-wide font-bold">Dias</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl lg:text-4xl font-black">{countdown.hours.toString().padStart(2, '0')}</div>
                <div className="text-sm uppercase tracking-wide font-bold">Horas</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl lg:text-4xl font-black">{countdown.minutes.toString().padStart(2, '0')}</div>
                <div className="text-sm uppercase tracking-wide font-bold">Minutos</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl lg:text-4xl font-black">{countdown.seconds.toString().padStart(2, '0')}</div>
                <div className="text-sm uppercase tracking-wide font-bold">Segundos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changelog Preview */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <DownloadCloud className="w-6 h-6 text-blue-600" />
              O que vem na próxima atualização
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-blue-900">Sistema de Pedidos Avançado</h4>
                <p className="text-blue-700">Gerencie pedidos em tempo real com notificações push</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-green-900">Analytics Completo</h4>
                <p className="text-green-700">Veja quais produtos vendem mais e otimize seu cardápio</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-purple-900">Integração WhatsApp Business</h4>
                <p className="text-purple-700">Responda pedidos diretamente do WhatsApp Business</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}