'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// Define the structure of a Cart Item
export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size: string; 
}

export const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

// Define the structure of the Cart State
interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

// Define the actions for the reducer

type CartAction =
  | { type: 'ADD_ITEM'; item: Omit<CartItem, 'quantity'>; size: string }
  | { type: 'REMOVE_ITEM'; id: number; size: string }
  | { type: 'CLEAR_CART' };

// ✅ Fix function signatures in the context shape
const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>, size: string) => void;
  removeItem: (id: number, size: string) => void;
  clearCart: () => void;
} | null>(null);

// Reducer function to handle cart logic
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      // Create a unique key using id + size
      const itemKey = `${action.item.id}-${action.size}`;
      const existingItem = state.items.find(item => 
        `${item.id}-${item.size}` === itemKey
      );
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          `${item.id}-${item.size}` === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { items: updatedItems, totalQuantity: state.totalQuantity + 1 };
      } else {
        return {
          items: [...state.items, { ...action.item, quantity: 1, size: action.size }],
          totalQuantity: state.totalQuantity + 1
        };
      }

    case 'REMOVE_ITEM':
      const itemKeyToRemove = `${action.id}-${action.size}`;
      const itemToRemove = state.items.find(item => 
        `${item.id}-${item.size}` === itemKeyToRemove
      );
      
      if (!itemToRemove) return state;

      if (itemToRemove.quantity > 1) {
        const updatedItems = state.items.map(item =>
          `${item.id}-${item.size}` === itemKeyToRemove
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        return { items: updatedItems, totalQuantity: state.totalQuantity - 1 };
      } else {
        const filteredItems = state.items.filter(item => 
          `${item.id}-${item.size}` !== itemKeyToRemove
        );
        return { items: filteredItems, totalQuantity: state.totalQuantity - 1 };
      }

    case 'CLEAR_CART':
      return { items: [], totalQuantity: 0 };

    default:
      return state;
  }
}



// Context Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], totalQuantity: 0 });

  const addItem = (item: Omit<CartItem, 'quantity'>, size: string) => {
    const itemKey = `${item.id}-${size}`;
    const existingItem = state.items.find(i => 
      `${i.id}-${i.size}` === itemKey
    );
    
    dispatch({ type: 'ADD_ITEM', item, size });
    
    if (existingItem) {
      toast.success(`Added another "${item.name}" (${size}) to cart!`);
    } else {
      toast.success(`Added "${item.name}" (${size}) to cart!`);
    }
  };

  const removeItem = (id: number, size: string) => {
    const itemKey = `${id}-${size}`;
    const itemToRemove = state.items.find(item => 
      `${item.id}-${item.size}` === itemKey
    );
    
    if (!itemToRemove) return;

    dispatch({ type: 'REMOVE_ITEM', id, size });
    
    if (itemToRemove.quantity > 1) {
      toast.success(`Removed one "${itemToRemove.name}" (${size}) from cart.`);
    } else {
      toast.success(`"${itemToRemove.name}" (${size}) removed from cart.`);
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared!');
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
