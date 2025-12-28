"use client";
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Settings2, Edit2, Trash2, Plus, Check } from 'lucide-react'
import { Produto } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { showError, showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

interface ProductCustomizationProps {
  product: Partial<Produto> | null
  onFieldChange: (field: keyof Produto, value: any) => void
}

interface CustomizationManagerProps {
  title: string
  items: string[]
  masterItems: string[]
  onToggle: (item: string) => void
  onAdd: (name: string) => Promise<string | null>
  onEdit: (oldName: string, newName: string) => Promise<void>
  onDelete: (name: string) => Promise<void>
  newItemPlaceholder: string
  tableName: string
  fieldName: string
  refreshData: () => Promise<void>
}

function CustomizationManager({ 
  title, 
  items, 
  masterItems, 
  onToggle, 
  onAdd, 
  onEdit, 
  onDelete, 
  newItemPlaceholder, 
  tableName,
  fieldName,
  refreshData
}: CustomizationManagerProps) {
  const [newItemInput, setNewItemInput] = useState('')
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editItemValue, setEditItemValue] = useState('')

  const handleAdd = async () => {
    const name = newItemInput.trim()
    if (!name) {
      showError(`Digite o nome ${title.toLowerCase().slice(0, -1)}`)
      return
    }
    
    if (masterItems.includes(name)) {
      showError(`O ${title.toLowerCase().slice(0, -1)} "${name}" já existe.`)
      return
    }
    
    try {
      console.log(`Tentando adicionar ${title.toLowerCase().slice(0, -1)}:`, name)
      const newItem = await onAdd(name)
      console.log(`Resultado da adição:`, newItem)
      
      if (newItem) {
        showSuccess(`${title.slice(0, -1)} "${newItem}" adicionado!`)
        setNewItemInput('')
        // Auto-select the newly added item
        onToggle(newItem)
        await refreshData()
      } else {
        console.error(`Falha ao adicionar ${title.toLowerCase().slice(0, -1)} - retorno nulo`)
        showError(`Erro ao adicionar ${title.toLowerCase().slice(0, -1)}.`)
      }
    } catch (error) {
      console.error(`Erro ao adicionar ${title.toLowerCase().slice(0, -1)}:`, error)
      showError(`Erro ao adicionar ${title.toLowerCase().slice(0, -1)}.`)
    }
  }

  const handleEdit = (item: string) => {
    setEditingItem(item)
    setEditItemValue(item)
  }

  const handleSaveEdit = async () => {
    if (!editingItem || !editItemValue.trim()) return
    
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ nome: editItemValue.trim() })
        .eq('nome', editingItem)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      
      if (error) throw error
      
      // Update products that use this item
      const { data: products } = await supabase
        .from('produtos')
        .select(`id, ${fieldName}`)
        .contains(fieldName, [editingItem])
      
      if (products) {
        for (const product of products) {
          const updatedItems = product[fieldName].map((item: string) => 
            item === editingItem ? editItemValue.trim() : item
          )
          await supabase
            .from('produtos')
            .update({ [fieldName]: updatedItems })
            .eq('id', product.id)
        }
      }
      
      setEditingItem(null)
      setEditItemValue('')
      showSuccess(`${title.slice(0, -1)} atualizado com sucesso!`)
    } catch (error: any) {
      showError(`Erro ao atualizar ${title.toLowerCase().slice(0, -1)}`)
    }
  }

  const handleDelete = async (item: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${item}"?`)) return
    
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('nome', item)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      
      if (error) throw error
      
      // Remove from products
      const { data: products } = await supabase
        .from('produtos')
        .select(`id, ${fieldName}`)
        .contains(fieldName, [item])
      
      if (products) {
        for (const product of products) {
          const updatedItems = product[fieldName].filter((i: string) => i !== item)
          await supabase
            .from('produtos')
            .update({ [fieldName]: updatedItems })
            .eq('id', product.id)
        }
      }
      
      // Remove from current product selection if it was selected
      if (items.includes(item)) {
        onToggle(item)
      }
      
      showSuccess(`${title.slice(0, -1)} excluído com sucesso!`)
      await refreshData()
    } catch (error: any) {
      showError(`Erro ao excluir ${title.toLowerCase().slice(0, -1)}`)
    }
  }

  return (
    <div className="space-y-3 min-w-0">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wide">{title}</h4>
      </div>
      <div className="space-y-2">
        {masterItems.map((item) => (
          <div 
            key={item} 
            className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold border-2 bg-gray-50 hover:bg-white transition-all"
            style={{ borderColor: '#fbcfe8' }}
          >
            <button 
              onClick={() => onToggle(item)}
              className="w-5 h-5 rounded flex items-center justify-center border-2 border-pink-300 transition-colors flex-shrink-0"
              style={{ background: items.includes(item) ? '#ec4899' : 'white' }}
            >
              {items.includes(item) && <Check className="w-3 h-3 text-white" />}
            </button>
            <span className="flex-1 truncate">{item}</span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleEdit(item)} 
              className="text-blue-500 hover:text-blue-700 h-6 w-6 p-0 flex-shrink-0"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleDelete(item)} 
              className="text-red-500 hover:text-red-700 h-6 w-6 p-0 flex-shrink-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <div className="relative flex gap-2 mt-2">
          <Input 
            value={newItemInput} 
            onChange={(e) => setNewItemInput(e.target.value)} 
            placeholder={newItemPlaceholder} 
            className="h-9 rounded-lg text-xs border-pink-200 focus:border-pink-400 focus:ring-pink-100 pr-10 min-w-0"
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()} 
          />
          <Button 
            onClick={handleAdd} 
            className="absolute right-1 top-1 h-7 w-7 p-0 bg-pink-600 hover:bg-pink-700 rounded-lg flex-shrink-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ProductCustomization({ product, onFieldChange }: ProductCustomizationProps) {
  const { massas = [], recheios = [], coberturas = [], addMassa, addRecheio, addCobertura, refreshData } = useDatabase()
  
  const [productMassas, setProductMassas] = useState<string[]>(product?.massas_disponiveis || [])
  const [productRecheios, setProductRecheios] = useState<string[]>(product?.recheios_disponiveis || [])
  const [productCoberturas, setProductCoberturas] = useState<string[]>(product?.coberturas_disponiveis || [])

  useEffect(() => {
    setProductMassas(product?.massas_disponiveis || [])
    setProductRecheios(product?.recheios_disponiveis || [])
    setProductCoberturas(product?.coberturas_disponiveis || [])
  }, [product])

  const shouldShowPersonalization = () => {
    return (
      product?.id || 
      massas.length > 0 || 
      recheios.length > 0 || 
      coberturas.length > 0 ||
      productMassas.length > 0 || 
      productRecheios.length > 0 || 
      productCoberturas.length > 0
    )
  }

  const toggleMassa = (massa: string) => {
    const newList = productMassas.includes(massa) 
      ? productMassas.filter(m => m !== massa) 
      : [...productMassas, massa]
    setProductMassas(newList)
    onFieldChange('massas_disponiveis', newList)
  }

  const toggleRecheio = (recheio: string) => {
    const newList = productRecheios.includes(recheio) 
      ? productRecheios.filter(r => r !== recheio) 
      : [...productRecheios, recheio]
    setProductRecheios(newList)
    onFieldChange('recheios_disponiveis', newList)
  }

  const toggleCobertura = (cobertura: string) => {
    const newList = productCoberturas.includes(cobertura) 
      ? productCoberturas.filter(c => c !== cobertura) 
      : [...productCoberturas, cobertura]
    setProductCoberturas(newList)
    onFieldChange('coberturas_disponiveis', newList)
  }

  if (!shouldShowPersonalization()) {
    return (
      <section className="bg-white border-gray-200 shadow-sm p-5 rounded-2xl border">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
            <Settings2 className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm font-medium">Produto sem opções de personalização</p>
          <p className="text-gray-300 text-xs mt-1">Clientes verão apenas as informações básicas</p>
        </div>
      </section>
    )
  }

  return (
    <section className={`rounded-2xl border transition-all ${
      product?.permite_personalizacao 
        ? 'bg-white border-pink-200 shadow-md shadow-pink-50/50 p-5' 
        : 'bg-white border-gray-200 shadow-sm p-5'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            product?.permite_personalizacao 
              ? 'bg-pink-100' 
              : 'bg-gray-100'
          }`}>
            <Settings2 className={`w-4 h-4 ${product?.permite_personalizacao ? 'text-pink-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: '#ff75b3' }}>Opções de Montagem</h3>
          </div>
        </div>
        
        <div 
          className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
            product?.permite_personalizacao 
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 border-pink-500 text-white shadow-lg shadow-pink-200' 
              : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
          }`}
          onClick={() => onFieldChange('permite_personalizacao', !product?.permite_personalizacao)}
        >
          <Switch 
            checked={product?.permite_personalizacao || false} 
            onCheckedChange={(c) => onFieldChange('permite_personalizacao', c)} 
            className="data-[state=checked]:bg-white data-[state=unchecked]:bg-gray-400 [&>span]:data-[state=checked]:bg-pink-600 [&>span]:bg-white"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-xs font-bold uppercase tracking-wide">
            {product?.permite_personalizacao ? 'ATIVADO' : 'ATIVAR'}
          </span>
        </div>
      </div>
      
      {product?.permite_personalizacao && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-2">
          <CustomizationManager
            title="Massas"
            items={productMassas}
            masterItems={massas}
            onToggle={toggleMassa}
            onAdd={addMassa}
            onEdit={(oldName, newName) => onEditMassa(oldName, newName)}
            onDelete={(name) => onDeleteMassa(name)}
            newItemPlaceholder="Adicionar massa..."
            tableName="massas"
            fieldName="massas_disponiveis"
            refreshData={refreshData}
          />
          
          <CustomizationManager
            title="Recheios"
            items={productRecheios}
            masterItems={recheios}
            onToggle={toggleRecheio}
            onAdd={addRecheio}
            onEdit={(oldName, newName) => onEditRecheio(oldName, newName)}
            onDelete={(name) => onDeleteRecheio(name)}
            newItemPlaceholder="Adicionar recheio..."
            tableName="recheios"
            fieldName="recheios_disponiveis"
            refreshData={refreshData}
          />
          
          <CustomizationManager
            title="Coberturas"
            items={productCoberturas}
            masterItems={coberturas}
            onToggle={toggleCobertura}
            onAdd={addCobertura}
            onEdit={(oldName, newName) => onEditCobertura(oldName, newName)}
            onDelete={(name) => onDeleteCobertura(name)}
            newItemPlaceholder="Adicionar cobertura..."
            tableName="coberturas"
            fieldName="coberturas_disponiveis"
            refreshData={refreshData}
          />
        </div>
      )}
    </section>
  )

  // Helper functions that will be used by CustomizationManager
  const onEditMassa = async (oldName: string, newName: string) => {
    const { error } = await supabase
      .from('massas')
      .update({ nome: newName.trim() })
      .eq('nome', oldName)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    
    if (error) throw error
    
    setProductMassas(prev => prev.map(m => m === oldName ? newName.trim() : m))
    await refreshData()
  }

  const onEditRecheio = async (oldName: string, newName: string) => {
    const { error } = await supabase
      .from('recheios')
      .update({ nome: newName.trim() })
      .eq('nome', oldName)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    
    if (error) throw error
    
    setProductRecheios(prev => prev.map(r => r === oldName ? newName.trim() : r))
    await refreshData()
  }

  const onEditCobertura = async (oldName: string, newName: string) => {
    const { error } = await supabase
      .from('coberturas')
      .update({ nome: newName.trim() })
      .eq('nome', oldName)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    
    if (error) throw error
    
    setProductCoberturas(prev => prev.map(c => c === oldName ? newName.trim() : c))
    await refreshData()
  }

  const onDeleteMassa = async (name: string) => {
    setProductMassas(prev => prev.filter(m => m !== name))
    await refreshData()
  }

  const onDeleteRecheio = async (name: string) => {
    setProductRecheios(prev => prev.filter(r => r !== name))
    await refreshData()
  }

  const onDeleteCobertura = async (name: string) => {
    setProductCoberturas(prev => prev.filter(c => c !== name))
    await refreshData()
  }
}