"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function FavoritosTab() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
            <Heart className="w-8 h-8" /> Seus Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-600">Nenhum favorito ainda. Adicione produtos aos favoritos!</p>
        </CardContent>
      </Card>
    </div>
  );
}