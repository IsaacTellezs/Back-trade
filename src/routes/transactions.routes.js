
import { Router } from "express";
import { createTransaction, getTransactions } from "../controllers/transactions.controllers.js";


const router = Router();

router.get('/transactions', getTransactions)

router.post('/transactions', createTransaction)

export default router;