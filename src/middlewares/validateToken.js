import { TOKEN_SECRET } from "../config/config.js";
import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Recupera el token del encabezado


    if (!token) {

        return res.status(401).json({ message: "No token, authorization denied" });
    }

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            
            return res.status(403).json({ message: "Invalid token" });
        }

        
        req.user = user;
        next();
    });
};