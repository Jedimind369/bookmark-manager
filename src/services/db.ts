
import { Pool } from 'pg';
import { Bookmark } from '../types';

const pool = new Pool({
  connectionString: import.meta.env.VITE_DATABASE_URL,
  max: 10
});

export const bookmarkService = {
  getBookmarks: async (userId: string): Promise<Bookmark[]> => {
    const result = await pool.query(
      'SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY date_added DESC',
      [userId]
    );
    return result.rows.map(row => ({
      id: row.id,
      url: row.url,
      title: row.title,
      description: row.description,
      tags: row.tags,
      collections: row.collections,
      dateAdded: new Date(row.date_added),
      userId: row.user_id,
      analysis: row.analysis,
      metadata: row.metadata
    }));
  },

  addBookmark: async (userId: string, bookmark: Omit<Bookmark, 'id'>) => {
    const result = await pool.query(
      `INSERT INTO bookmarks (url, title, description, tags, collections, date_added, user_id, analysis, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [bookmark.url, bookmark.title, bookmark.description, bookmark.tags, 
       bookmark.collections, new Date(), userId, bookmark.analysis, bookmark.metadata]
    );
    return result.rows[0].id;
  },

  deleteBookmark: async (userId: string, bookmarkId: string) => {
    await pool.query('DELETE FROM bookmarks WHERE id = $1 AND user_id = $2', 
      [bookmarkId, userId]);
  }
};
