
import { Router } from 'express';
import { getMarketData } from '../controllers/market.controllers.js';

const router = Router();

router.get('/market', getMarketData);


export default router;