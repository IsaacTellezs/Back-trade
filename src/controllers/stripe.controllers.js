import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
import { pool } from '../models/db.js';

export const createCheckoutSession = async (req, res) => {
    const { amount, userId } = req.body;
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Fondos de la Billetera',
            },
            unit_amount: amount, // Cantidad en centavos
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:5173/success', // URL de éxito
        cancel_url: 'http://localhost:3000/cancel', // URL de cancelación
        metadata: { userId },
      });
  
      res.json({ id: session.id });
    } catch (error) {
      console.error('Error creando la sesión de pago:', error);
      res.status(500).send('Error al crear la sesión de pago');
    }
  }

  export const handleStripeWebhook = async (req, res) => {
    console.log('Webhook recibido:', req.body);
    const sig = req.headers['stripe-signature'];
  
    try {
      const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId; 
        const amount = session.amount_total / 100; 
  
        // Actualizar el balance en la tabla wallets
        const query = `
          UPDATE wallets
          SET balance = balance + $1
          WHERE user_id = $2
          RETURNING balance;
        `;
        const values = [amount, userId];
  
        const { rows } = await pool.query(query, values);
        console.log(`Balance actualizado para el usuario ${userId}: $${rows[0].balance}`);
      }
  
      res.json({ received: true });
    } catch (error) {
      console.error('Error manejando el webhook de Stripe:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  };

  export const getBalance = async (req, res) => {
    const { user_id } = req.params;
    console.log(user_id)
    try {
      const { rows } = await pool.query('SELECT balance, currency FROM wallets WHERE user_id = $1', [user_id]);
      console.log("Cartera actualizada")
  
      if (rows.length > 0) {
        res.json({ balance: rows[0].balance, currency: rows[0].currency });
      } else {
        res.status(404).send('Cartera no encontrada para este usuario');
      }
    } catch (error) {
      console.error('Error obteniendo el balance:', error);
      res.status(500).send('Error al obtener el balance');
    }
  };