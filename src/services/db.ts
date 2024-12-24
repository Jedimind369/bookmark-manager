
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL
});

export const query = async (text: string, params?: any[]) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getClient = () => pool.connect();
