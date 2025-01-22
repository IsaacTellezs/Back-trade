import { pool } from "../models/db.js";

export const getUserProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const upsertUserProfile = async (req, res) => {
    const {
        full_name,
        phone,
        passport_number,
        id_front,
        id_back,
        address,
        city,
        postal_code,
        proof_of_address,
    } = req.body;
    const { id } = req.params;

    const query = `
        INSERT INTO user_profiles (user_id, full_name, phone, passport_number, id_front, id_back, address, city, postal_code, proof_of_address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            passport_number = EXCLUDED.passport_number,
            id_front = EXCLUDED.id_front,
            id_back = EXCLUDED.id_back,
            address = EXCLUDED.address,
            city = EXCLUDED.city,
            postal_code = EXCLUDED.postal_code,
            proof_of_address = EXCLUDED.proof_of_address,
            updated_at = CURRENT_TIMESTAMP;
    `;

    try {
        await pool.query(query, [
            id,
            full_name,
            phone,
            passport_number,
            id_front,
            id_back,
            address,
            city,
            postal_code,
            proof_of_address,
        ]);

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
