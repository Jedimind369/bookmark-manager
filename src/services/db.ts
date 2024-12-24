
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: import.meta.env.VITE_DATABASE_URL,
  max: 10
});

export const addBookmarkToDB = async (bookmark: Bookmark): Promise<string> => {
  const { title, url, description, tags, userId } = bookmark;
  const result = await pool.query(
    'INSERT INTO bookmarks (title, url, description, tags, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [title, url, description, tags, userId]
  );
  return result.rows[0].id;
};

export const getBookmarksFromDB = async (userId: string): Promise<Bookmark[]> => {
  const result = await pool.query(
    'SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    url: row.url,
    description: row.description,
    tags: row.tags,
    userId: row.user_id,
    createdAt: row.created_at
  }));
};

export const deleteBookmarkFromDB = async (id: string): Promise<void> => {
  await pool.query('DELETE FROM bookmarks WHERE id = $1', [id]);
};

export const updateBookmarkInDB = async (id: string, data: Partial<Bookmark>): Promise<void> => {
  const setClause = Object.keys(data)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');
  const values = [id, ...Object.values(data)];
  await pool.query(`UPDATE bookmarks SET ${setClause} WHERE id = $1`, values);
};
