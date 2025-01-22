

import { Router } from "express";
import { getUserProfile, upsertUserProfile } from "../controllers/dataProfile.controllers.js";


const router = Router();


router.get('/profile/:id', getUserProfile);

router.put('/profile/:id', upsertUserProfile);

export default router;