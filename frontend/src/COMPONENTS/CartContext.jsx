import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const increment = (product) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const { id, name, price, image } = product;
      return [...prevItems, { id, name, price, image, quantity: 1 }];
    });
  };

  const decrement = (productId) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === productId);
      if (itemExists?.quantity === 1) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const clearCart = () => setCartItems([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0), [cartItems]);
  const deliveryCharge = useMemo(() => (totalPrice > 0 && totalPrice < 200 ? 25 : 0), [totalPrice]);
  const handlingCharge = useMemo(() => (totalPrice > 0 ? 2 : 0), [totalPrice]);
  const finalGrandTotal = useMemo(() => totalPrice + deliveryCharge + handlingCharge, [totalPrice, deliveryCharge, handlingCharge]);

  const value = {
    cartItems,
    increment,
    decrement,
    clearCart,
    totalPrice,
    finalGrandTotal,
    isCartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}