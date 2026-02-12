import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RecipeCategoryFilter } from '@/components/receitas/RecipeCategoryFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Recipe {
  id: string;
  titulo: string;
  categoria: string;
  imagem_url: string;
}

export default function ReceitasPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('receitas')
        .select('id, titulo, categoria, imagem_url');

      if (error) {
        console.error('Erro ao buscar receitas:', error);
      } else {
        setRecipes(data);
        const uniqueCategories = [...new Set(data.map(item => item.categoria))];
        setCategories(uniqueCategories.map(name => ({ name })));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredRecipes = selectedCategory
    ? recipes.filter(recipe => recipe.categoria === selectedCategory)
    : recipes;

  return (
    <div className="p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-pink-400">Minhas Receitas</h1>
        <p className="text-center text-gray-400">Encontre inspiração para sua próxima obra-prima.</p>
      </header>

      {/* O filtro de categoria foi removido daqui */}

      {loading ? (
        <div className="text-center">Carregando receitas...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map(recipe => (
            <Card key={recipe.id} className="bg-gray-800 border-pink-500/50 overflow-hidden">
              <CardHeader className="p-0">
                <img src={recipe.imagem_url || 'https://placehold.co/600x400/27272a/fe62a6?text=Receita'} alt={recipe.titulo} className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2 bg-pink-500 text-white">{recipe.categoria}</Badge>
                <CardTitle className="text-lg font-semibold text-white">{recipe.titulo}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}