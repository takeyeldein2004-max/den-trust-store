import { createContext, useState, useContext } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (product, qty) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + Number(qty) } : item
        )
      } else {
        return [...prev, { ...product, qty: Number(qty) }]
      }
    })
    alert(`Added ${qty} x ${product.name} to cart!`)
  }

  const incrementQty = (id) => {
    setCart(prev => prev.map(item => item.id === id ? {...item, qty: item.qty + 1} : item))
  }

  const decrementQty = (id) => {
    setCart(prev => prev.map(item => item.id === id && item.qty > 1 ? {...item, qty: item.qty - 1} : item))
  }

  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id))
  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, addToCart, incrementQty, decrementQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)