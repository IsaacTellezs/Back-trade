import { pool } from "../models/db.js";
import bcrypt from "bcryptjs";
import { createAccesToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET, URL_FRONTEND } from "../config/config.js";
import { sendPasswordResetEmail } from "../utils/email.js";

export const createUser = async (req, res) => {
  try {
    const data = req.body;
    const { rows: existingUsers } = await pool.query(
      "SELECT * FROM users where email = $1",
      [data.email]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json(["Email is already in use"]);
    }

    // const hashedPassword = await bcrypt.hash(data.password_hash, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password_hash, is_verified) VALUES ($1 ,$2, $3, $4) RETURNING *",
      [data.name, data.email, data.password_hash, false]
    );
    const { id, name, email, created_at } = rows[0];

    const { rows: walletRows } = await pool.query(
      "INSERT INTO wallets (user_id, balance) VALUES ($1, $2) RETURNING *",
      [id, 0]
    );

    const wallet = walletRows[0];

    // const token = await createAccesToken({ id: id });
    // res.cookie("token", token);
    return res.status(201).json({ id, name, email, created_at });
  } catch (error) {
    console.error(error);
    if (error?.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const data = req.body;
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      data.email,
    ]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const userFound = rows[0];

    const isMatch = data.password_hash === userFound.password_hash;
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    if (!userFound.is_verified) {
      return res.status(403).json({ message: "Tu cuenta no ha sido verificada" });
    }

    const { id, name, email, created_at } = rows[0];
    const token = await createAccesToken({ id: userFound.id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
      domain: ".trdnation.com",
      maxAge: 24 * 60 * 60 * 1000, 
  });
    return res.status(201).json({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      created_at: userFound.created_at,
    });
  } catch (error) {
    console.error(error);
    if (error?.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.user.id,
  ]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  const userFound = rows[0];

  return res.json({
    id: userFound.id,
    name: userFound.name,
    email: userFound.email,
    password_hash: userFound.password_hash,
    created_at: userFound.created_at,
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return restart.status(401).json({ message: "unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "unauthorized" });

    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      user.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "unauthorized" });
    }
    const userFound = rows[0];

    return res.json({
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      created_at: userFound.created_at,
    });
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    // console.log("Usuario encontrado:", user); // Depuración

    const resetToken = await createAccesToken({ id: user.id });
    const safeToken = resetToken
      .replace(/\./g, "_dot_")
      .replace(/-/g, "_dash_");
    const resetLink = `${URL_FRONTEND}/auth/reset-password/${safeToken}`;
    // console.log("Enlace de recuperación:", resetLink); // Depuración

    await sendPasswordResetEmail(user.email, resetLink);

    return res.status(200).json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    // console.error("Error en forgotPassword:", error); // Depuración
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
//   console.log("Token:", token); // Depuración
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const { id } = decoded;

    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      newPassword,
      id,
    ]);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
