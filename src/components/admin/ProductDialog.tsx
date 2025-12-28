import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProductForm } from './ProductForm'
import { Produto } from '@/types/database'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { supabase } from '@/lib/supabase'
import { X, Save, ChevronRight } from 'lucide-react'

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  product: Partial<Produto> | null
}

export function ProductDialog({ isOpen, onClose, product }: ProductDialogProps) {
  const { addProduto, editProduto, removeProduto } = useDatabase()
  const [localProduct, setLocalProduct] = useState<Partial<Produto> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingCategory, setPendingCategory] = useState<{ name: string; icon: string } | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 2
  const neutralFocusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setLocalProduct(product || {
        nome: '',
        descricao: '',
        preco_normal: 0,
        preco_promocional: 0,
        imagem_url: '',
        categoria: '',
        forma_venda: 'unidade',
        disponivel: true,
        promocao: false,
      })
      setCurrentStep(1)
      
      setTimeout(() => {
        if (neutralFocusRef.current) {
          neutralFocusRef.current.focus()
        }
      }, 100)
    }
  }, [isOpen, product])

  const handleSave = async () => {
    if (!localProduct) return

    if (!localProduct.nome?.trim()) {
      showError('Nome do produto é obrigatório')
      return
    }

    if (!localProduct.categoria?.trim()) {
      showError('Categoria do produto é obrigatória')
      return
    }

    const precoNormal = parseFloat(localProduct.preco_normal?.toString() || '0')
    if (precoNormal <= 0 || isNaN(precoNormal)) {
      showError('Preço normal deve ser maior que zero')
      return
    }

    setIsSaving(true)
    try {
      if (pendingCategory) {
        const { error } = await supabase
          .from('categorias')
          .insert({ 
            nome: pendingCategory.name,
            user_id: (await supabase.auth.getUser()).data.user?.id
          })
        
        if (error) throw error
        showSuccess('Categoria criada!')
        setPendingCategory(null)
      }

      if (localProduct.id) {
        const success = await editProduto(localProduct.id, localProduct)
        if (success) showSuccess('Produto atualizado!')
      } else {
        const result = await addProduto(localProduct as Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        if (result) showSuccess('Produto criado!')
      }
      onClose()
    } catch {
      showError('Erro ao salvar produto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!localProduct?.id || !removeProduto) return
    
    if (confirm(`Tem certeza que deseja excluir o produto "${localProduct.nome}"? Esta ação não poderá ser desfeita.`)) {
      setIsSaving(true)
      try {
        const success = await removeProduto(localProduct.id)
        if (success) {
          showSuccess('Produto excluído!')
          onClose()
        }
      } catch {
        showError('Erro ao excluir produto')
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleFieldChange = (updatedProduct: Partial<Produto>) => {
    setLocalProduct(updatedProduct)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[98vw] max-h-[95vh] border-0 shadow-2xl rounded-2xl flex flex-col">
        <div 
          ref={neutralFocusRef}
          tabIndex={-1}
          className="sr-only"
          aria-hidden="true"
        />
        
        {/* Header Simplificado */}
        <div className="px-6 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                {localProduct?.id ? 'Editar Produto' : ''}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                {localProduct?.id ? 'Atualize as informações do produto' : ''}
              </DialogDescription>
            </div>
          </div>
        </div>
        
        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <ProductForm
            product={localProduct}
            onSave={handleFieldChange}
            onDelete={localProduct?.id ? handleDelete : undefined}
            onCancel={onClose}
          />
        </div>

        {/* Footer Sticky */}
        <div className="px-6 py-4 flex-shrink-0 border-t border-gray-200 bg-white">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button 
              variant="ghost" 
              onClick={onClose}
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3 text-gray-600 font-semibold hover:bg-gray-100 h-11"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-lg shadow-pink-200/50 flex gap-2 justify-center rounded-xl h-11"
            >
              {isSaving ? 'Salvando...' : (
                <>
                  <Save className="w-4 h-4" />
                  {localProduct?.id ? 'Salvar Alterações' : 'Publicar Produto'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}