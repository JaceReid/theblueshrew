'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

const Cart: React.FC = () => {
  const { state, addItem, removeItem, clearCart } = useCart();

  // Calculate total price
  const totalPrice = state.items.reduce((total, item) => {
    // Extract number from price string (e.g., "R400" -> 400)
    const price = Number(item.price.replace('R', ''));
    return total + price * item.quantity;
  }, 0);

  if (state.items.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      <ul className="divide-y divide-blue-700">
  {state.items.map((item) => (
    <li key={`${item.id}-${item.size}`} className="py-4 flex">
      <div className="h-16 w-16 relative flex-shrink-0">
        <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-blue-300">
          {item.price} • Size: {item.size} • Qty: {item.quantity}
        </p>
        <div className="mt-1 flex space-x-2">
          <button
            onClick={() => removeItem(item.id, item.size)}  // ⬅️ pass size
            className="text-blue-400 hover:text-blue-200 text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  ))}
</ul> 
      <div className="border-t border-blue-700 mt-4 pt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>R{totalPrice}</span>
        </div>
        <button
          onClick={clearCart}
          className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Clear Cart
        </button>
        {/* This will link to our checkout page */}
        <Link href="/checkout" className="block mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
