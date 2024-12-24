
const auth = async (req, res, next) => {
  try {
    const userId = req.headers['x-replit-user-id'];
    const userName = req.headers['x-replit-user-name'];
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    req.user = { id: userId, name: userName };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = auth;
