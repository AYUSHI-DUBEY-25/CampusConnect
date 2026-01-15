// frontend/src/context/cart.js
import React, { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./auth";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { auth } = useAuth(); // logged-in user
  const [cart, setCart] = useState([]);
  const storageKey = auth?.user?._id ? `cart_${auth.user._id}` : null;

  // load user's cart on login (or clear on logout)
  useEffect(() => {
    if (auth?.user?._id && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) setCart(JSON.parse(saved));
      else setCart([]);
    } else {
      setCart([]); // not logged in
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?._id]);

  // persist cart for the current user
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    }
  }, [cart, storageKey]);

  // ======= Cart operations =======

  // Add item to cart (item should include id, price, name and optionally maxTickets)
  // qty defaults to 1. Returns the final quantity for the item.
  const addToCart = (item, qty = 1) => {
    if (!item?.id) {
      console.warn("addToCart: item must have an id field");
      return;
    }

    setCart(prev => {
      const exists = prev.find(ci => ci.id === item.id);
      const max = Number(item.maxTickets ?? Infinity);

      if (exists) {
        // increase but cap at max
        const newQty = Math.min(exists.quantity + qty, max);
        return prev.map(ci => (ci.id === item.id ? { ...ci, quantity: newQty } : ci));
      } else {
        const initialQty = Math.min(Math.max(1, qty), max);
        return [...prev, { ...item, quantity: initialQty }];
      }
    });
  };

  // Increase quantity by 1 (caps at maxTickets)
  const increaseQty = (eventId) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id !== eventId) return item;
        const max = Number(item.maxTickets ?? Infinity);
        if (item.quantity >= max) return item; // already at max
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  // Decrease quantity by 1 (removes item if quantity becomes 0)
  const decreaseQty = (eventId) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id !== eventId) return item;
          const newQty = Math.max(item.quantity - 1, 0);
          return { ...item, quantity: newQty };
        })
        .filter(item => item.quantity > 0) // remove if quantity 0
    );
  };

  // Remove item regardless of quantity
  const removeFromCart = (eventId) => {
    setCart(prev => prev.filter(item => item.id !== eventId));
  };

  // Clear the cart entirely
  const clearCart = () => setCart([]);

  // Utilities
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = cart.reduce((s, it) => s + it.quantity * (Number(it.price) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

export { CartProvider, useCart };
