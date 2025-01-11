import { Router } from "express";
import {authRequired} from '../middlewares/validateToken.js'
import { getWalletUser } from "../controllers/wallet.controllers.js";

const router = Router();

router.get('/wallet/:id', getWalletUser)

export default router;