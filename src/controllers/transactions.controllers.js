import { pool } from "../models/db.js";

export const getTransactions = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM transactions ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Error fetching transactions" });
    }
};

export const createTransaction = async (req, res) => {
    const { user_id, wallet_id, payment_type, bank, amount, currency } = req.body;

    try {
        const { rows } = await pool.query(
            `
            INSERT INTO transactions (user_id, wallet_id, payment_type, bank, amount, currency, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `,
            [user_id, wallet_id, payment_type, bank || null, amount, currency, "pendiente"]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Error creating transaction" });
    }
};
