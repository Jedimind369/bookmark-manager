
const auth = (req, res, next) => {
  const userId = req.headers['x-replit-user-id'];
  const userName = req.headers['x-replit-user-name'];

  if (!userId && !req.path.startsWith('/__repl')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (userId) {
    req.user = { id: userId, name: userName };
  }
  
  next();
};

module.exports = auth;
