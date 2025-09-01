'use client';

import React, { useState } from 'react';
import { availableSizes } from '../context/CartContext';

interface SizeSelectorProps {
  onSizeSelect: (size: string) => void;
  selectedSize?: string;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ onSizeSelect, selectedSize }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSizeSelect = (size: string) => {
    onSizeSelect(size);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition text-center"
      >
        {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-blue-800 border border-blue-700 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="grid grid-cols-3 gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  className={`p-2 text-center rounded transition ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-700 hover:bg-blue-600 text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
