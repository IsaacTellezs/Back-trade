import { pool } from "../models/db.js";
import bcrypt from "bcryptjs";
import { createAccesToken } from "../libs/jwt.js";
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from "../config/config.js";

export const createUser = async(req, res) => {
    try {
        const data = req.body
        const {rows: existingUsers} = await pool.query('SELECT * FROM users where email = $1', [data.email])
        if (existingUsers.length > 0) {
            return res.status(400).json( ["Email is already in use"] );
        }

        const hashedPassword = await bcrypt.hash(data.password_hash, 10);
        const {rows} = await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1 ,$2, $3) RETURNING *', [data.name, data.email, hashedPassword])
        const {id, name, email, created_at} = rows[0];
        const token = await createAccesToken({id: id})
        res.cookie('token', token)
        return res.status(201).json({id, name, email, created_at});

    }
    catch(error){
        console.error(error);
        if(error?.code ==="23505"){
            return res.status(409).json({message: "Email already exists"});
        }
        return res.status(500).json({message: "Internal server error"});
        
    }
}

export const login = async(req, res) => {
    
    try {
        const data = req.body
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [data.email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        const userFound = rows[0];

        const isMatch = await bcrypt.compare(data.password_hash, userFound.password_hash);
        if(!isMatch) return res.status(400).json({message: "Incorrect password"})

        const {id, name, email, created_at} = rows[0];
        const token = await createAccesToken({id: userFound.id})
        res.cookie('token', token)
        return res.status(201).json({
            id: userFound.id,
            name: userFound.name,
            email:userFound.email,
            created_at: userFound.created_at
        });

    }
    catch(error){
        console.error(error);
        if(error?.code ==="23505"){
            return res.status(409).json({message: "Email already exists"});
        }
        return res.status(500).json({message: "Internal server error"});
        
    }
}

export const logout = async(req, res) => {
    res.cookie('token', "",{
        expires: new Date(0)
    });
    return res.sendStatus(200);
};

export const profile = async(req, res) => {
    const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id])

    if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
    const userFound = rows[0];
   
    return res.json({
        id: userFound.id,
        name: userFound.name,
        email:userFound.email,
        created_at: userFound.created_at,
    })
}

export const verifyToken = async(req, res) => {
    const {token} = req.cookies

    if(!token) return restart.status(401).json({message: "unauthorized"});

    jwt.verify(token, TOKEN_SECRET, async(err, user) => {
        if(err) return res.status(401).json({message: "unauthorized"});

        const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [user.id])

        if (rows.length === 0) {
            return res.status(404).json({ message: "unauthorized" });
        }
        const userFound = rows[0];

        return res.json({
            id: userFound.id,
            name: userFound.name,
            email:userFound.email,
            created_at: userFound.created_at,
        })
    })

}