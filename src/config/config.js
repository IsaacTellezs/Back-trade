
export const DB_USER = process.env.DB_USER
export const DB_HOST = process.env.DB_HOST
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_DATABASE = process.env.DB_DATABASE
export const DB_PORT = process.env.DB_PORT

export const ORIGIN_CORS = process.env.ORIGIN_CORS ? process.env.ORIGIN_CORS.split(',') : [];

//Tokens

export const TOKEN_SECRET = process.env.TOKEN_SECRET

export  const PORT = process.env.PORT || 5000;


export const SUPABASE_URL = process.env.SUPABASE_URL
export const SUPABASE_KEY = process.env.SUPABASE_KEY