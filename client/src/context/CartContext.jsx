import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as api from '../api/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // Загрузка корзины с сервера для текущего пользователя
  const loadCart = useCallback(async () => {
    if (!user) {
      setCart([])
      setTotal(0)
      return
    }
    setLoading(true)
    try {
      const data = await api.getCart(user.id)
      setCart(data.items)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Перезагружаем корзину при смене пользователя
  useEffect(() => {
    loadCart()
  }, [loadCart])

  // Добавить услугу в корзину
  async function addToCart(service) {
    if (!user) throw new Error('Нужно войти в аккаунт')
    await api.addToCart(user.id, service.id)
    await loadCart()
  }

  // Удалить позицию из корзины
  async function removeFromCart(cartItemId) {
    await api.removeFromCart(cartItemId)
    await loadCart()
  }

  // Очистить корзину
  async function clearCart() {
    if (!user) return
    await api.clearCart(user.id)
    await loadCart()
  }

  return (
    <CartContext.Provider
      value={{ cart, total, loading, addToCart, removeFromCart, clearCart, reload: loadCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}