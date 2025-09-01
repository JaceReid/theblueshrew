import { NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    // Calculate the order total on the server to prevent manipulation
    const total = items.reduce((acc: number, item: any) => {
      const price = Number(item.price.replace('R', '')); // Convert "R400" to 400
      return acc + price * item.quantity;
    }, 0);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // Stripe expects amount in cents
      currency: 'zar',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    return NextResponse.json(
      { error: 'Error creating PaymentIntent' },
      { status: 500 }
    );
  }
}
