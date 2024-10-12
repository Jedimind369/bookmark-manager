module.exports = (req, res, next) => {
  if (req.user.tier === 'premium' || (req.user.trialEndDate && new Date() < new Date(req.user.trialEndDate))) {
    next();
  } else {
    res.status(403).json({ message: 'This feature requires a premium subscription' });
  }
};