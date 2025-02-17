import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getUnverifiedUsers, getUsersAdmin, verifyUser } from "../controllers/admin.controllers.js";


const router = Router();

router.get("/users-admin", getUsersAdmin);

// Obtener usuarios no verificados
router.get("/unverified-users", getUnverifiedUsers);

// Verificar un usuario
router.post("/verify-user/:userId", verifyUser);


export default router;