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
    
