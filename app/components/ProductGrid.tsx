'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import SizeSelector from './SizeSelector';

interface Shirt {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface ProductGridProps {
  shirts: Shirt[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ shirts }) => {
  const { addItem } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<{[key: number]: string}>({});

  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (shirt: Shirt) => {
    const size = selectedSizes[shirt.id];
    if (!size) {
      alert('Please select a size before adding to cart');
      return;
    }
    addItem(shirt, size );

  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {shirts.map((shirt) => (
        <div key={shirt.id} className="text-center bg-blue-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <div className="h-80 relative rounded-lg overflow-hidden mb-4">
            <Image
              src={shirt.image}
              alt={shirt.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">{shirt.name}</h3>
          <p className="text-blue-300 mb-4">{shirt.price}</p>
          
          {/* Size Selector */}
          <div className="mb-4">
            <SizeSelector
              onSizeSelect={(size) => handleSizeSelect(shirt.id, size)}
              selectedSize={selectedSizes[shirt.id]}
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(shirt)}
            disabled={!selectedSizes[shirt.id]}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition"
          >
            {selectedSizes[shirt.id] ? 'Add to Cart' : 'Select Size First'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
