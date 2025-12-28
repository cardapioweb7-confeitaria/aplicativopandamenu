"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Trash2, ImageIcon } from 'lucide-react'
import { Produto } from '@/types/database'
import { supabaseService } from '@/services/supabase'

interface ProductImageUploadProps {
  product: Partial<Produto> | null
  onImageChange: (url: string) => void
}

export function ProductImageUpload({ product, onImageChange }: ProductImageUploadProps) {
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return { success: false, message: 'Apenas imagens são permitidas' }
    
    try {
      const fileName = `produto-${Date.now()}.${file.name.split('.').pop()}`
      const url = await supabaseService.uploadImage(file, 'products', fileName)
      
      if (url) {
        onImageChange(url)
        return { success: true, message: 'Imagem enviada!' }
      }
      return { success: false, message: 'Falha no upload' }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Título que some com scroll */}
      <div className="sticky top-0 z-10 bg-white py-3 mb-3 -mx-4 px-4 border-b border-gray-100">
        <h2 className="text-center text-xl font-bold text-gray-900">Cadastro de Produtos</h2>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/iconecamera.gif" alt="Câmera" className="w-6 h-6" />
        </div>
        <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: '#ff75b3' }}>Foto do Produto</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <div 
            className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-pink-200 bg-pink-50/50 cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all group relative"
            onClick={() => !product?.imagem_url && document.getElementById('product-image')?.click()}
          >
            {product?.imagem_url ? (
              <>
                <img src={product.imagem_url} alt="Produto" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="destructive" 
                    className="rounded-full h-10 w-10 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      onImageChange('')
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-pink-500" />
                </div>
                <p className="text-sm font-bold text-gray-700 text-center mb-1">Toque para enviar foto</p>
                <p className="text-xs text-gray-400 text-center">JPG, PNG ou WEBP</p>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="product-image" 
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}