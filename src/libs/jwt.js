import { TOKEN_SECRET } from "../config/config.js";
import jwt from 'jsonwebtoken'

export function createAccesToken(payload){
    return new Promise((resolve, reject) => {
        jwt.sign (
            payload,
            TOKEN_SECRET,
            {
                expiresIn: "1d",
                sameSite: "Strict",
                priority: "High",

            },
            (err, token) => {
                if(err) reject(err);
                resolve(token)
                
            }
            );
        
    })
}
