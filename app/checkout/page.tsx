'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

const CheckoutPage = () => {
  const { state, clearCart } = useCart();
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Calculate total price
  const totalPrice = state.items.reduce((total, item) => {
    const price = Number(item.price.replace('R', ''));
    return total + price * item.quantity;
  }, 0);

  // Generate a unique reference number
  const referenceNumber = `TBS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const sendOrderNotification = async () => {
    try {
      const response = await fetch('/api/send-order-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderDetails: state.items,
          customerInfo: customerData,
          totalAmount: totalPrice,
          referenceNumber: referenceNumber
        })
      });

      if (!response.ok) {
        console.error('Failed to send notification');
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const handleOrderComplete = async () => {
    if (!customerData.firstName || !customerData.lastName || !customerData.email) {
      alert('Please fill in all required customer information');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendOrderNotification();
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Order completion error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-blue-800 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty!</h1>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-blue-800 rounded-lg shadow-xl max-w-md mx-4">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-4">Order Received!</h1>
          <p className="text-blue-200 mb-6">
            Thank you for your order! We've sent a confirmation to your email and will process your order once payment is confirmed.
          </p>
          <div className="bg-blue-900 p-4 rounded-lg mb-6">
            <p className="font-semibold">Reference Number:</p>
            <p className="text-green-400 text-xl font-mono">{referenceNumber}</p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-blue-300">Complete your purchase with EFT or SnapScan</p>
        </div>

        {/* Customer Information Form */}
        <div className="bg-blue-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 border-b border-blue-700 pb-2">Customer Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-300 mb-2">First Name *</label>
              <input
                type="text"
                placeholder="First Name"
                value={customerData.firstName}
                onChange={(e) => setCustomerData({...customerData, firstName: e.target.value})}
                className="w-full p-3 rounded bg-blue-700 text-white placeholder-blue-300 border border-blue-600 focus:border-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-blue-300 mb-2">Last Name *</label>
              <input
                type="text"
                placeholder="Last Name"
                value={customerData.lastName}
                onChange={(e) => setCustomerData({...customerData, lastName: e.target.value})}
                className="w-full p-3 rounded bg-blue-700 text-white placeholder-blue-300 border border-blue-600 focus:border-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-blue-300 mb-2">Email Address *</label>
              <input
                type="email"
                placeholder="Email Address"
                value={customerData.email}
                onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                className="w-full p-3 rounded bg-blue-700 text-white placeholder-blue-300 border border-blue-600 focus:border-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-blue-300 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerData.phone}
                onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                className="w-full p-3 rounded bg-blue-700 text-white placeholder-blue-300 border border-blue-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b border-blue-700 pb-2">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {state.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 relative mr-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-blue-300">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">R{Number(item.price.replace('R', '')) * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-blue-700 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-green-400">R{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-6">
            {/* EFT Payment */}
            <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 border-b border-blue-700 pb-2">EFT Payment</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-300">Bank:</span>
                  <span className="font-medium">Standard Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Account Number:</span>
                  <span className="font-medium">08 604 666 7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Account Type:</span>
                  <span className="font-medium">Current</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Branch Code:</span>
                  <span className="font-medium">314</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Reference:</span>
                  <span className="font-medium text-green-400">{referenceNumber}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-900 rounded-lg">
                <p className="text-sm text-blue-200">
                  💡 <strong>Important:</strong> Please use <span className="text-green-400">{referenceNumber}</span> as your payment reference. 
                  Send proof of payment to{' '}
                  <a href="mailto:theblueshreww@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                    theblueshreww@gmail.com
                  </a>{' '}
                  to confirm your order.
                </p>
              </div>
            </div>

            {/* SnapScan Payment */}
            <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 border-b border-blue-700 pb-2">SnapScan Payment</h2>
              
              <div className="text-center">
                <div className="mb-4 p-4 bg-white rounded-lg inline-block">
                  <div className="w-48 h-48 flex items-center justify-center rounded">
                    <Image
                      src="/snapscan.jpeg"
                      alt="SnapScan QR Code"
                      width={200}
                      height={200}
                      className="rounded object-contain"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-blue-200 mb-2">
                  Scan the QR code with SnapScan to pay instantly
                </p>
                
                <div className="flex justify-center mb-3">
                  <div className="bg-black text-white px-3 py-1 rounded text-sm font-medium">
                    TheBlueShrew
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-3">📋 Order Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-200">
            <li>Fill in your customer information above</li>
            <li>Choose your preferred payment method (EFT or SnapScan)</li>
            <li>Make payment for <strong>R{totalPrice}</strong></li>
            <li>Use reference number: <strong className="text-green-400">{referenceNumber}</strong></li>
            <li>Click "Complete Order" below to finalize your purchase</li>
            <li>Email proof of payment to <strong>theblueshreww@gmail.com</strong></li>
            <li>We'll confirm your order within 24 hours and arrange shipping</li>
          </ol>
        </div>

        {/* Complete Order Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleOrderComplete}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-lg text-lg transition duration-300 inline-block"
          >
            {isSubmitting ? 'Processing...' : 'Complete Order'}
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center text-blue-300">
          <p>Questions? Email us at{' '}
            <a href="mailto:theblueshreww@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
              theblueshreww@gmail.com
            </a>
          </p>
          <p className="text-sm mt-2">Usually respond within 2 hours during business days</p>
        </div>

        {/* Continue Shopping Button */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;