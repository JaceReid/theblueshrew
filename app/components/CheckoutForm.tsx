'use client';

import React from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useState } from 'react';

const CheckoutForm = ({ clearCart }: { clearCart: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      // Clear cart on successful payment
      clearCart();
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-800 p-6 rounded-lg shadow-lg">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-4 px-4 rounded transition"
      >
        {isProcessing ? 'Processing...' : `Pay Now`}
      </button>
      {errorMessage && <div className="text-red-400 mt-4">{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
