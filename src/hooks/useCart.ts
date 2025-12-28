import { useCallback, useMemo, useEffect } from 'react'
import { useCartContext } from '@/context/CartContext'
import { CartItem } from './useCart'

export function useCart() {
  const cartContext = useCartContext()

  // Return the same interface but using the context
  return cartContext
}

// Re-export CartItem type for backward compatibility
export type { CartItem }