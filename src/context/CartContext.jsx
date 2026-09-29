import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload]
    case 'REMOVE':
      return state.filter((_, index) => index !== action.payload)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [])

  function addToCart(product) {
    dispatch({ type: 'ADD', payload: product })
  }

  function removeFromCart(index) {
    dispatch({ type: 'REMOVE', payload: index })
  }

  function clearCart() {
    dispatch({ type: 'CLEAR' })
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}