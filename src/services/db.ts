
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  
  getClient: async () => {
    const client = await pool.connect();
    return client;
  }
};

export default db;
