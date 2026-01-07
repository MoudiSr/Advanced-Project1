import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const API = process.env.REACT_APP_API_URL;

export function CartProvider({ children }) {
  const { currentUser } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  //ADD TO CART
  const addToCart = (dish) => {
    const exists = cartItems.find(item => item.id === dish.id);
    if (exists) { //if item already added to cart before, increment quantity +1
      setCartItems(
        cartItems.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else { 
      setCartItems([...cartItems, { ...dish, quantity: 1 }]);
    }
  };
//REMOVE FROM CART
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
//UPDATE QUANTITY
  const updateQuantity = (id, qty) => {
    setCartItems(
      cartItems.map(item => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  //SUBMIT ORDER USING BACKEND
  const submitOrder = async () => {
    if (!currentUser || cartItems.length === 0) return;

    await fetch(`${API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        items: cartItems,
        total: cartItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
      }),
    });

    setCartItems([]);
  };

  // UPDATE ORDER STATUS USING BACKEND
  const updateOrderStatus = async (id, status) => {
    await fetch(`${API}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };
//DELETE ORDER USING BACKEND
  const deleteOrder = async (id) => {
    await fetch(`${API}/orders/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      submitOrder,
      orders,
      updateOrderStatus,
      deleteOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}
