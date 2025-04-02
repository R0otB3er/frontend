import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
  const [userId, setUserId] = useState("guest");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser") || "guest";
    setUserId(storedUser);

    const storedCart = JSON.parse(localStorage.getItem(`cart_${storedUser}`)) || [];
    setCartItems(storedCart);
  }, []);

  const syncCart = (items, userKey = userId) => {
    setCartItems(items);
    localStorage.setItem(`cart_${userKey}`, JSON.stringify(items));
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find((i) => i.id === item.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    syncCart(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    syncCart(updatedCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  const switchUser = (newUserId) => {
    const guestCart = cartItems;

    const storedNewUserCart = JSON.parse(localStorage.getItem(`cart_${newUserId}`)) || [];
    const mergedCart = [...storedNewUserCart];

    guestCart.forEach((item) => {
      const match = mergedCart.find((i) => i.id === item.id);
      if (match) {
        match.quantity += item.quantity;
      } else {
        mergedCart.push(item);
      }
    });

    setUserId(newUserId);
    syncCart(mergedCart, newUserId);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        switchUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

