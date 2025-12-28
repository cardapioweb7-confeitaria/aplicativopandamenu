"use client";
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Check, FolderPlus, AlertCircle, LayoutGrid } from 'lucide-react'
import { Produto } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { showError, showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { CreateCategoryModal } from './CreateCategoryModal'

interface ProductBasicInfoProps {
  product: Partial<Produto> | null
  onFieldChange: (field: keyof Produto, value: any) => void
  errors: { [key: string]: string }
}

export function ProductBasicInfo({ product, onFieldChange, errors }: ProductBasicInfoProps) {
  const { designSettings, saveDesignSettings } = useDatabase()
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: dbCategories } = await supabase.from('categorias').select('nome').order('nome')
        const { data: products } = await supabase.from('produtos').select('categoria').not('categoria', 'is', null)
        
        const dbCategoryNames = dbCategories?.map(cat => cat.nome) || []
        const productCategories = products?.map(p => p.categoria).filter(Boolean) || []
        const allCategories = Array.from(new Set([...dbCategoryNames, ...productCategories]))
          .filter((cat): cat is string => cat !== null && cat.trim() !== '')
          .sort()
        
        setCategories(allCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    
    fetchCategories()
  }, [])

  const handleCategorySelect = (value: string) => {
    if (value === 'create-new') {
      setIsCreateCategoryModalOpen(true)
    } else {
      onFieldChange('categoria', value)
    }
  }

  const handleCategoryCreated = (categoryName: string) => {
    setCategories(prev => [...prev, categoryName].sort())
    onFieldChange('categoria', categoryName)
  }

  return (
    <>
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/lapis.gif" alt="Lápis" className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider whitespace-nowrap" style={{ color: '#ff75b3' }}>Informações do Produto</h3>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700">Nome do Produto</Label>
              <Input 
                value={product?.nome || ''} 
                onChange={(e) => onFieldChange('nome', e.target.value)} 
                placeholder="Ex: Bolo de Morango" 
                className="h-11 rounded-lg text-sm border-gray-200 focus:border-pink-400 focus:ring-pink-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-700">Categoria</Label>
              <Select value={product?.categoria || ''} onValueChange={handleCategorySelect}>
                <SelectTrigger className={`h-11 rounded-lg text-sm cursor-pointer ${
                  product?.categoria 
                    ? 'bg-[#ff75b3] text-white border-[#ff75b3]' 
                    : 'border-gray-200 focus:border-pink-400 focus:ring-pink-100'
                }`}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="create-new" className="text-pink-600 font-semibold border-t mt-1 pt-1">
                    <div className="flex items-center gap-2">
                      <FolderPlus className="w-3.5 h-3.5" /> Criar nova categoria
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-700">Descrição</Label>
            <Textarea 
              value={product?.descricao || ''} 
              onChange={(e) => onFieldChange('descricao', e.target.value)} 
              placeholder="Descreva os ingredientes, sabor, tamanho e outras características do produto..." 
              rows={10} 
              className="rounded-lg resize-none border-gray-200 focus:border-pink-400 focus:ring-pink-100 text-sm" 
            />
            <p className="text-xs text-gray-400 text-center">Esta descrição ajuda seus clientes a conhecer melhor o produto.</p>
          </div>
        </div>
      </section>

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
        designSettings={designSettings}
        saveDesignSettings={saveDesignSettings}
      />
    </>
  )
}