import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from '@/hooks/useCart'

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  updateObservations: (id: string, observations: string) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Initialize cart from localStorage only once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('pandamenu-cart')
        const cart = savedCart ? JSON.parse(savedCart) : []
        console.log('🛒 CartProvider: Carrinho carregado do localStorage:', cart.length, 'itens')
        setItems(cart)
      } catch (error) { 
        console.error('🛒 CartProvider: Erro ao carregar carrinho:', error)
        setItems([])
      }
    }
  }, [])

  // Save to localStorage and dispatch event whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pandamenu-cart', JSON.stringify(items))
        console.log('🛒 CartProvider: Carrinho salvo no localStorage:', items.length, 'itens')
        
        // Disparar evento para notificar outros componentes
        const event = new CustomEvent('cartUpdated', { detail: items })
        window.dispatchEvent(event)
        console.log('🛒 CartProvider: Evento cartUpdated disparado com', items.length, 'itens')
      } catch (error) {
        console.error('🛒 CartProvider: Erro ao salvar carrinho:', error)
      }
    }
  }, [items])

  const totalItems = items.reduce((sum, item) => sum + (item.saleType === 'kg' ? item.quantity : Math.floor(item.quantity)), 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const addItem = (newItem: CartItem) => {
    console.log('🛒 CartProvider: Adicionando item ao carrinho:', newItem.name)
    setItems(prev => {
      const existing = prev.findIndex(i => i.id === newItem.id && i.selectedMassa === newItem.selectedMassa && i.selectedRecheio === newItem.selectedRecheio && i.selectedCobertura === newItem.selectedCobertura)
      if (existing >= 0) {
        console.log('🛒 CartProvider: Item já existe, atualizando quantidade')
        const updated = [...prev]
        updated[existing].quantity += newItem.quantity
        return updated
      }
      console.log('🛒 CartProvider: Novo item adicionado')
      return [...prev, newItem]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    console.log('🛒 CartProvider: Atualizando quantidade do item:', id, 'para:', quantity)
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
  }

  const updateObservations = (id: string, observations: string) => {
    console.log('🛒 CartProvider: Atualizando observações do item:', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, observations } : i))
  }

  const removeItem = (id: string) => {
    console.log('🛒 CartProvider: Removendo item:', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearCart = () => {
    console.log('🛒 CartProvider: Limpando carrinho')
    setItems([])
  }

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      addItem,
      updateQuantity,
      updateObservations,
      removeItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}