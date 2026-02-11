"use client";

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Package, Calendar, Clock, DownloadCloud, Star, TrendingUp, ShoppingBag } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* LOGO PROEMINENTE + TIPO DE ACESSO EM DIV BRANCA COM SOMBRA */}
        <div className="text-center mb-12">
          {/* Card principal com logo e tipo de acesso */}
          <Card className="max-w-lg mx-auto shadow-2xl border-0 overflow-hidden bg-white">
            <CardContent className="p-8 pt-16 pb-16">
              {/* Logo MAIOR com bordas extras rosas externas + internas brancas duplas + PLACEHOLDER */}
              <div className="mx-auto mb-8 relative group">
                {/* Bordas extras ROSAS externas (dupla camada para profundidade) */}
                <div className="absolute inset-0 mx-6 my-6 rounded-full border-8 border-pink-400 shadow-2xl group-hover:scale-105 transition-all duration-500 animate-pulse-slow">
                  <div className="absolute inset-0 mx-4 my-4 rounded-full border-8 border-pink-500 shadow-2xl" />
                </div>
                
                {/* Container interno com bordas BRANCAS duplas */}
                <div className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72 bg-gradient-to-br from-pink-50 to-white shadow-3xl rounded-full border-12 border-white p-4 flex items-center justify-center">
                  {/* PLACEHOLDER até sistema de upload - Ícone de bolo grande */}
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-pink-200 shadow-inner p-8">
                    <div className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl animate-bounce-slow">
                      🎂
                    </div>
                    <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-pink-600 uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full shadow-md">
                      Logo Placeholder
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Tipo de Acesso: Vitalício com ponto verde piscando */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-xl md:text-2xl font-black text-gray-900 tracking-wide">
                    Tipo de Acesso: <span className="text-green-600">Vitalício</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CARDS DE INFORMAÇÕES - GRID RESPONSIVO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Card 1: Usuários */}
          <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black text-blue-900">7.690</CardTitle>
                  <CardDescription className="text-blue-700 font-semibold">Usuários Ativos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-bold">+12% este mês</Badge>
            </CardContent>
          </Card>

          {/* Card 2: Versão */}
          <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 overflow-hidden bg-gradient-to-br from-green-50 to-green-100 shadow-xl">
            <CardHeader className="pb-4 bg-gradient-to-r from-green-500/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black text-green-900">2.1.9</CardTitle>
                  <CardDescription className="text-green-700 font-semibold">Versão Atual</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold">Atualizado hoje</Badge>
            </CardContent>
          </Card>

          {/* Card 3: Última Atualização */}
          <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-500/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black text-purple-900">15/12/2025</CardTitle>
                  <CardDescription className="text-purple-700 font-semibold">Última Atualização</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge className="bg-purple-500 hover:bg-purple-600 text-white font-bold">Estável</Badge>
            </CardContent>
          </Card>

          {/* Card 4: Próxima Atualização */}
          <Card className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl">
            <CardHeader className="pb-4 bg-gradient-to-r from-orange-500/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 animate-pulse">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black text-orange-900">{countdown.days}d {countdown.hours}h</CardTitle>
                  <CardDescription className="text-orange-700 font-semibold">Próxima Atualização</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold animate-pulse">Em Breve</Badge>
            </CardContent>
          </Card>
        </div>

        {/* CARDS DE INFORMAÇÕES ADICIONAIS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contagem Regressiva */}
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-400 text-white overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-black mb-2 flex items-center justify-center gap-3">
                ⏰ <span>Contagem Regressiva</span>
              </CardTitle>
              <CardDescription className="opacity-90">Próxima grande atualização</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 group-hover:scale-110 transition-all duration-300">
                  <div className="text-4xl lg:text-5xl font-black mb-1">{countdown.days.toString().padStart(2, '0')}</div>
                  <div className="text-sm uppercase tracking-wide font-bold opacity-90">Dias</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 group-hover:scale-110 transition-all duration-300">
                  <div className="text-4xl lg:text-5xl font-black mb-1">{countdown.hours.toString().padStart(2, '0')}</div>
                  <div className="text-sm uppercase tracking-wide font-bold opacity-90">Horas</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 group-hover:scale-110 transition-all duration-300">
                  <div className="text-4xl lg:text-5xl font-black mb-1">{countdown.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-sm uppercase tracking-wide font-bold opacity-90">Minutos</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 group-hover:scale-110 transition-all duration-300">
                  <div className="text-4xl lg:text-5xl font-black mb-1">{countdown.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-sm uppercase tracking-wide font-bold opacity-90">Segundos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changelog Preview */}
          <Card className="border-0 shadow-2xl bg-white overflow-hidden group hover:shadow-3xl hover:scale-[1.02] transition-all duration-500">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <CardTitle className="flex items-center gap-3 text-2xl font-black">
                <DownloadCloud className="w-8 h-8" />
                Próximas Atualizações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-all">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-lg text-blue-900 mb-1">Sistema de Pedidos Avançado</h4>
                  <p className="text-blue-700 text-sm">Gerencie pedidos em tempo real com notificações push</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-all">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-lg text-green-900 mb-1">Analytics Completo</h4>
                  <p className="text-green-700 text-sm">Veja quais produtos vendem mais e otimize seu cardápio</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-all">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-lg text-purple-900 mb-1">Integração WhatsApp Business</h4>
                  <p className="text-purple-700 text-sm">Responda pedidos diretamente do WhatsApp Business</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}