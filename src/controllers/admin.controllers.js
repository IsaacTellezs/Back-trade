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

export const createActivity = async (req, res) => {
  try {
    const { date, code, description, ticket, withdrawals, deposits, balance, user_id } = req.body;

    console.log(req.body);
      
      if (!date || !code || !description || !ticket || !user_id) {
          return res.status(400).json({ message: "Debe proporcionar todos los campos obligatorios" });
      }

      
      const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [user_id]);
      
      if (userCheck.rows.length === 0) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }

      
      const formattedDate = new Date(date).toISOString().split('T')[0];

      
      const withdrawalsValue = withdrawals !== undefined ? withdrawals : 0;
      const depositsValue = deposits !== undefined ? deposits : 0;
      const balanceValue = balance !== undefined ? balance : 0;

   
      const { rows } = await pool.query(
          "INSERT INTO account_activity (date, code, description, ticket, withdrawals, deposits, balance, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
          [formattedDate, code, description, ticket, withdrawalsValue, depositsValue, balanceValue, user_id]
      );

      
      res.status(201).json({ 
          message: "Actividad creada correctamente", 
          activity: rows[0],
          activityId: rows[0].id 
      });
  } catch (error) {
      console.error("Error en la consulta SQL:", error);
      res.status(500).json({ message: "Error al crear la actividad", error: error.message });
  }
};

export const getActivity = async (req, res) => {
  try {
      const { userId } = req.params; 

      const { rows } = await pool.query(
          "SELECT * FROM account_activity WHERE user_id = $1 ORDER BY id ASC",
          [userId]
      );
      res.status(200).json(rows);
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener la actividad reciente" });
  }
};

export const updateActivity = async (req, res) => {
  try {
      const { activityId } = req.params; 
      const { date, code, description, ticket, withdrawals, deposits, balance } = req.body;

      
      if (!date && !code && !description && !ticket && withdrawals === undefined && deposits === undefined && balance === undefined) {
          return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
      }

      
      let query = "UPDATE account_activity SET ";
      const values = [];
      let count = 1;

      if (date) {
          query += `date = $${count}, `;
          values.push(date);
          count++;
      }
      if (code) {
          query += `code = $${count}, `;
          values.push(code);
          count++;
      }
      if (description) {
          query += `description = $${count}, `;
          values.push(description);
          count++;
      }
      if (ticket) {
          query += `ticket = $${count}, `;
          values.push(ticket);
          count++;
      }
      if (withdrawals !== undefined) {
          query += `withdrawals = $${count}, `;
          values.push(withdrawals);
          count++;
      }
      if (deposits !== undefined) {
          query += `deposits = $${count}, `;
          values.push(deposits);
          count++;
      }
      if (balance !== undefined) {
          query += `balance = $${count}, `;
          values.push(balance);
          count++;
      }

      
      query = query.slice(0, -2) + ` WHERE id = $${count} RETURNING *`;
      values.push(activityId);

      
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
          return res.status(404).json({ message: "Actividad no encontrada" });
      }

      res.status(200).json({ message: "Actividad actualizada correctamente", activity: rows[0] });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar la actividad" });
  }
};

export const deleteActivity = async (req, res) => {
  try {
      const { activityId } = req.params; 

      const { rows } = await pool.query(
          "DELETE FROM account_activity WHERE id = $1 RETURNING *",
          [activityId]
      );

      if (rows.length === 0) {
          return res.status(404).json({ message: "Actividad no encontrada" });
      }

      res.status(200).json({ message: "Actividad eliminada correctamente", activity: rows[0] });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar la actividad" });
  }
};
