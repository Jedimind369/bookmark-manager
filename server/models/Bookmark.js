
const db = require('../db');

class Bookmark {
  static async create(data) {
    const { title, url, description, tags, collections, userId } = data;
    const query = `
      INSERT INTO bookmarks (title, url, description, tags, collections, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [title, url, description, tags, collections, userId]);
    return result.rows[0];
  }

  static async findByUser(userId) {
    const query = 'SELECT * FROM bookmarks WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async update(id, data) {
    const { title, url, description, tags, collections } = data;
    const query = `
      UPDATE bookmarks 
      SET title = $1, url = $2, description = $3, tags = $4, collections = $5
      WHERE id = $6
      RETURNING *
    `;
    const result = await db.query(query, [title, url, description, tags, collections, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM bookmarks WHERE id = $1';
    await db.query(query, [id]);
    return true;
  }
}

module.exports = Bookmark;
