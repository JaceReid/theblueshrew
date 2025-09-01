import Link from 'next/link';
import React from 'react';

const OrderSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white flex items-center justify-center">
      <div className="text-center p-8 bg-blue-800 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Order Successful!</h1>
        <p className="text-xl mb-8">Thank you for your purchase.</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
