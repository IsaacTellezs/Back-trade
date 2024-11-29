import { Router } from "express";
import { createUser, login, logout, profile, verifyToken } from "../controllers/auth.controllers.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/validator.schema.js";

const router = Router();

router.post('/register', validateSchema(registerSchema), createUser)

router.post('/login', validateSchema(loginSchema), login)

router.post('/logout', logout)

router.get('/verify',  verifyToken)

router.get('/profile', authRequired,  profile)

export default router;