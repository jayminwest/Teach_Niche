import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.VITE_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Stripe secret key is not set in environment variables');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use the latest API version
});
