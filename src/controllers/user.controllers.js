import { pool } from "../models/db.js";

export const getUsers = 
    async (req, res) => {
        const {rows} = await pool.query("SELECT * FROM users");   
        res.json(rows);
    }

export const getUser = async(req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('SELECT * FROM users where id = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "User not found"});
    }
    res.json(rows);
}

export const deleteUser = async(req, res) => {
    const {id} = req.params
    const {rows, rowCount} = await pool.query('DELETE FROM users where id = $1 RETURNING *', [id]);

    if(rowCount === 0){
        return res.status(404).json({message: "User not found"});
    }
    console.log(rows)
    return res.json('Usuario eliminado' + rows);
}

export const updateUser =  async(req, res) => {
    const {id} = req.params;
    const data = req.body;
    const {rows} = await pool.query('UPDATE users SET name =$1, email = $2  where id = $3 RETURNING *', [data.name, data.email, id])
    return res.json( rows[0])
}

export const getUsersWallet = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                COALESCE(SUM(w.balance), 0) AS total_wallet_amount
            FROM users u
            LEFT JOIN wallets w ON u.id = w.user_id
            GROUP BY u.id;
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};
