import { pool } from "../models/db.js";


export const getUsersAdmin = async (req,res) => {
    const {rows} = await pool.query("SELECT * FROM users");   
    res.json(rows);

}

export const getUnverifiedUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE is_verified = false"
    );

    // Verificar si hay usuarios no verificados
    if (rows.length === 0) {
      return res.status(404).json({ message: "No hay usuarios no verificados" });
    }

    // Enviar la respuesta con los usuarios no verificados
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios no verificados" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar si el usuario existe
    const { rows } = await pool.query(
      "UPDATE users SET is_verified = true WHERE id = $1 RETURNING *",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Enviar la respuesta con el usuario verificado
    res.status(200).json({ message: "Usuario verificado exitosamente", user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al verificar el usuario" });
  }
};