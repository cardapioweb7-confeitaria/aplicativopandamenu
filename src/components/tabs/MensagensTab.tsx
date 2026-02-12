"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function MensagensTab() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <MessageCircle className="w-8 h-8" /> Mensagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-600">Nenhuma mensagem nova. Fique de olho nos pedidos!</p>
        </CardContent>
      </Card>
    </div>
  );
}