import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createActivity, deleteActivity, getActivity, getUnverifiedUsers, getUsersAdmin, getVerifiedUsers, unverifyUser, updateActivity, verifyUser } from "../controllers/admin.controllers.js";


const router = Router();

router.get("/users-admin", getUsersAdmin);

// Obtener usuarios no verificados
router.get("/unverified-users", getUnverifiedUsers);

router.get("/verified-users", getVerifiedUsers);

// Verificar un usuario
router.post("/verify-user/:userId", verifyUser);

router.post("/unverify-user/:userId", unverifyUser);

router.post("/activity", createActivity);

router.get("/account-activity/:userId", getActivity);

router.put("/activity/:activityId", updateActivity);

router.delete("/activity/:activityId", deleteActivity);

export default router;