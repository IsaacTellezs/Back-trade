import { Router } from "express";
import {authRequired} from '../middlewares/validateToken.js'

const router = Router();

router.get('/wallet', authRequired, )

export default router;