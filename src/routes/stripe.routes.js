import { Router } from "express";
import { createCheckoutSession, getBalance, handleStripeWebhook } from "../controllers/stripe.controllers.js";
import express from 'express';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);

router.post('/stripe-webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

router.get('/get-balance', getBalance);

export default router;