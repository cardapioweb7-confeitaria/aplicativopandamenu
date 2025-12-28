"use client";
import { useEffect, useState } from 'react'
import { Produto } from '@/types/database'
import { ProductImageUpload } from './ProductImageUpload'
import { ProductBasicInfo } from './ProductBasicInfo'
import { ProductPricing } from './ProductPricing'
import { ProductCustomization } from './ProductCustomization'

interface ProductFormProps {
  product: Partial<Produto> | null
  onSave: (product: Partial<Produto>) => void
  onDelete?: () => void
  onCancel: () => void
}

export function ProductForm({ product, onSave }: ProductFormProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = (p: Partial<Produto> | null) => {
    const newErrors: { [key: string]: string } = {}
    if (!p?.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório.'
    }
    if (!p?.categoria?.trim()) {
      newErrors.categoria = 'Categoria é obrigatória.'
    }
    setErrors(newErrors)
  }

  const handleFieldChange = (field: keyof Produto, value: any) => {
    const updatedProduct = { ...product, [field]: value }
    onSave(updatedProduct)
    validate(updatedProduct)
  }

  const handleImageChange = (url: string) => {
    const updatedProduct = { ...product, imagem_url: url }
    onSave(updatedProduct)
  }

  useEffect(() => {
    validate(product)
  }, [product])

  return (
    <div className="pt-0 pb-4 px-4 sm:px-6 min-w-0">
      <div className="flex flex-col gap-6">
        <ProductImageUpload 
          product={product} 
          onImageChange={handleImageChange}
        />
        
        <ProductBasicInfo 
          product={product} 
          onFieldChange={handleFieldChange}
          errors={errors}
        />
        
        <ProductPricing 
          product={product} 
          onFieldChange={handleFieldChange}
        />
        
        <ProductCustomization 
          product={product} 
          onFieldChange={handleFieldChange}
        />
      </div>
    </div>
  )
}