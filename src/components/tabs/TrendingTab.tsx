"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

export default function TrendingTab() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <Flame className="w-8 h-8" /> Trending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-600">Os mais populares do momento em breve aqui!</p>
        </CardContent>
      </Card>
    </div>
  );
}