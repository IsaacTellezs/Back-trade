import { Router } from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controllers.js";

const router = Router();

router.get('/users', getUsers)


router.get('/users/:id', getUser)


router.delete('/users/:id', deleteUser);


router.put('/users/:id', updateUser );

export default router;