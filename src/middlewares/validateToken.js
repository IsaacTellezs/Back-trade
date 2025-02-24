import { TOKEN_SECRET } from "../config/config.js";
import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Recupera el token del encabezado

    console.log("Token recibido en authRequired:", token); // Log para depuración

    if (!token) {
        console.log("No se encontró token, denegando acceso..."); // Log si no hay token
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("Token inválido:", err); // Log si el token es inválido
            return res.status(403).json({ message: "Invalid token" });
        }

        console.log("Token válido, usuario:", user); // Log si el token es válido
        req.user = user;
        next();
    });
};