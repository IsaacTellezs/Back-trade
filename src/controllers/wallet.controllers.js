import { pool } from "../models/db.js";

export const getWalletUser = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [id]);

    if (rows.length === 0) {
        return res.status(404).json({ message: "Wallet not found" });
    }
    res.json(rows);
}