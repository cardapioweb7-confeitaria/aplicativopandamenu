"use client";
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Coins } from 'lucide-react'
import { Produto } from '@/types/database'

interface ProductPricingProps {
  product: Partial<Produto> | null
  onFieldChange: (field: keyof Produto, value: any) => void
}

const saleTypes = [
  { value: 'unidade', label: 'Por Unidade' },
  { value: 'fatia', label: 'Por Fatia' },
  { value: 'kg', label: 'Por Quilo (kg)' },
  { value: 'cento', label: 'Por Cento' },
  { value: 'tamanho-p', label: 'Tamanho P' },
  { value: 'tamanho-m', label: 'Tamanho M' },
  { value: 'tamanho-g', label: 'Tamanho G' },
  { value: 'tamanho-xg', label: 'Tamanho XG' },
  { value: 'kit-caixa', label: 'Kit / Caixa' },
  { value: 'sob-encomenda', label: 'Sob Encomenda' },
  { value: 'outros', label: 'Outros' }
]

export function ProductPricing({ product, onFieldChange }: ProductPricingProps) {
  const handlePriceChange = (field: 'preco_normal' | 'preco_promocional', value: string) => {
    const numbers = value.replace(/\D/g, '')
    const numericValue = (parseInt(numbers) || 0) / 100
    onFieldChange(field, numericValue)
  }

  const getPriceDisplay = (value: number | undefined) => {
    if (value === undefined) return ''
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 flex items-center justify-center">
          <img src="/venda.gif" alt="Venda" className="w-6 h-6" />
        </div>
        <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: '#ff75b3' }}>Preço e Venda</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-700">Preço</Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-green-600 text-sm">R$</span>
            <Input 
              value={getPriceDisplay(product?.preco_normal)} 
              onChange={(e) => handlePriceChange('preco_normal', e.target.value)} 
              className="h-11 pl-9 rounded-lg font-bold text-green-900 text-sm border-green-200 bg-green-50/50 focus:border-green-400 focus:ring-green-100" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-700">Vendido por</Label>
          <Select value={product?.forma_venda} onValueChange={(v) => onFieldChange('forma_venda', v)}>
            <SelectTrigger className={`h-11 rounded-lg text-sm font-semibold border-gray-200 focus:border-pink-400 focus:ring-pink-100 ${
              product?.forma_venda ? 'bg-[#ff75b3] text-white' : ''
            }`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200 shadow-lg">
              {saleTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-700">Status</Label>
          <div className="flex flex-col gap-3">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-lg border-2 transition-all cursor-pointer w-full ${
              product?.promocao 
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 border-pink-500 text-white' 
                : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
            }`} onClick={() => onFieldChange('promocao', !product?.promocao)}>
              <Switch 
                checked={product?.promocao || false} 
                onCheckedChange={(c) => onFieldChange('promocao', c)} 
                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-gray-400 [&>span]:data-[state=checked]:bg-pink-600 [&>span]:bg-white"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-xs font-bold uppercase tracking-wide">Promoção</span>
            </div>
          </div>
        </div>
      </div>
      
      {product?.promocao && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <Label className="text-xs font-bold text-gray-700 min-w-max">Preço Promocional</Label>
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-white text-sm">R$</span>
              <Input 
                value={getPriceDisplay(product?.preco_promocional)} 
                onChange={(e) => handlePriceChange('preco_promocional', e.target.value)} 
                className="h-10 pl-9 rounded-lg font-bold text-white text-sm bg-[#1c1c1c] border-[#1c1c1c] placeholder:text-white/50 focus:bg-[#1c1c1c] focus:border-[#1c1c1c]" 
                placeholder="0,00"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg border-2 transition-all cursor-pointer w-full ${
            product?.disponivel !== false 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
          }`} onClick={() => onFieldChange('disponivel', product?.disponivel === false)}>
            <Switch 
              checked={product?.disponivel !== false} 
              onCheckedChange={(c) => onFieldChange('disponivel', c)} 
              className="data-[state=checked]:bg-white data-[state=unchecked]:bg-gray-400 [&>span]:data-[state=checked]:bg-green-600 [&>span]:bg-white"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-xs font-bold uppercase tracking-wide">Disponível</span>
          </div>
        </div>
      </div>
    </section>
  )
}