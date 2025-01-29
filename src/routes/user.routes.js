import { Router } from "express";
import { deleteUser, getUser, getUsers, getUsersWallet, updateUser, updateWalletBalance } from "../controllers/user.controllers.js";

const router = Router();

router.get('/users', getUsers)


router.get('/users/:id', getUser)


router.delete('/users/:id', deleteUser);


router.put('/users/:id', updateUser );


router.get('/wallets', getUsersWallet);

router.put('/wallets/:id', updateWalletBalance);

export default router;