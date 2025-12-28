"use client";
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X, Check, FolderPlus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { showError, showSuccess } from '@/utils/toast'
import { IconSelectorModal } from './IconSelectorModal'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onCategoryCreated: (categoryName: string) => void
  designSettings: any
  saveDesignSettings: (settings: any) => Promise<void>
}

export function CreateCategoryModal({ 
  isOpen, 
  onClose, 
  onCategoryCreated, 
  designSettings, 
  saveDesignSettings 
}: CreateCategoryModalProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState('/icons/1.png')
  const [isLoading, setIsLoading] = useState(false)
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false)

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) {
      showError('Digite o nome da categoria')
      return
    }
    
    setIsLoading(true)
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')
      
      const { error: catError } = await supabase.from('categorias').insert({
        nome: name,
        user_id: user.user.id
      })
      
      if (catError) throw catError
      
      if (designSettings) {
        const currentIcons = designSettings.category_icons || {}
        await saveDesignSettings({
          category_icons: {
            ...currentIcons,
            [name]: selectedCategoryIcon
          }
        })
      }
      
      onCategoryCreated(name)
      setNewCategoryName('')
      setSelectedCategoryIcon('/icons/1.png')
      showSuccess('Categoria e ícone criados!')
      onClose()
    } catch (error: any) {
      showError('Erro ao criar categoria')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setNewCategoryName('')
    setSelectedCategoryIcon('/icons/1.png')
    onClose()
  }

  const handleIconSelect = (iconPath: string) => {
    setSelectedCategoryIcon(iconPath)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md border-2 border-gray-200 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <FolderPlus className="w-5 h-5 text-pink-600" />
              Criar Nova Categoria
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-sm font-medium text-gray-700">
                Nome da Categoria
              </Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Bolos, Doces, Salgados..."
                className="h-11 rounded-lg border-gray-200 focus:border-pink-400 focus:ring-pink-100"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Ícone da Categoria</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsIconSelectorOpen(true)}
                  className="h-12 w-12 rounded-lg border-2 border-pink-200 flex items-center justify-center hover:bg-pink-50 transition-colors cursor-pointer"
                >
                  <img src={selectedCategoryIcon} alt="Icon" className="w-7 h-7 object-contain" />
                </button>
                <span className="text-sm text-gray-500">Clique para escolher ícone</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              className="h-10 px-4 rounded-lg"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={isLoading || !newCategoryName.trim()}
              className="bg-pink-600 hover:bg-pink-700 h-10 px-4 rounded-lg"
            >
              <Check className="w-4 h-4 mr-2" />
              {isLoading ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <IconSelectorModal
        isOpen={isIconSelectorOpen}
        onClose={() => setIsIconSelectorOpen(false)}
        onSelectIcon={handleIconSelect}
        selectedIcon={selectedCategoryIcon}
      />
    </>
  )
}