"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomeTab() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Bem-vindo à Home!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-gray-600">Esta é a página inicial do seu app. Clique nas abas abaixo para navegar.</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card className="p-6 text-center bg-blue-50">
              <CardTitle className="text-xl mb-2">Pedidos</CardTitle>
              <p>Gerencie seus pedidos aqui.</p>
            </Card>
            <Card className="p-6 text-center bg-green-50">
              <CardTitle className="text-xl mb-2">Produtos</CardTitle>
              <p>Veja o cardápio completo.</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}